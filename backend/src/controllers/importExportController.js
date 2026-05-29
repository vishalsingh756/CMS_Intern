import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Parser } from 'json2csv';
import exceljs from 'exceljs';
import Client from '../models/Post.js';
import Deal from '../models/Deal.js';
import { sendResponse } from '../utils/helpers.js';
import { logActivity } from '../utils/activityLogger.js';

// --- EXPORT LOGIC ---

export const exportData = async (req, res) => {
  try {
    const { module, format, ids } = req.body; // module: 'clients', 'deals'. format: 'csv', 'xlsx'
    
    let Model;
    if (module === 'clients') Model = Client;
    else if (module === 'deals') Model = Deal;
    else return sendResponse(res, 400, false, 'Invalid module for export');

    const query = {};
    if (ids && ids.length > 0) {
      query._id = { $in: ids };
    } else if (req.user.role !== 'admin') {
       query.$or = [{ owner: req.user._id }, { assignedTo: req.user._id }];
    }

    const data = await Model.find(query).lean();
    if (data.length === 0) return sendResponse(res, 404, false, 'No data to export');

    // Remove internal fields
    data.forEach(item => {
      delete item.__v;
      delete item.password; // just in case
    });

    if (format === 'csv') {
      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${module}-export.csv`);
      return res.status(200).end(csvData);
    } 
    else if (format === 'xlsx') {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet(module);
      
      const columns = Object.keys(data[0]).map(key => ({ header: key, key: key, width: 20 }));
      worksheet.columns = columns;
      
      data.forEach(item => worksheet.addRow(item));
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${module}-export.xlsx`);
      
      await workbook.xlsx.write(res);
      return res.end();
    } else {
      return sendResponse(res, 400, false, 'Invalid format');
    }

  } catch (error) {
    console.error('Export error:', error);
    sendResponse(res, 500, false, 'Error exporting data');
  }
};

// --- IMPORT LOGIC ---

export const importData = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'Please upload a CSV file');
    }

    const { module } = req.body;
    let Model;
    if (module === 'clients') Model = Client;
    else if (module === 'deals') Model = Deal;
    else {
      fs.unlinkSync(req.file.path);
      return sendResponse(res, 400, false, 'Invalid module for import');
    }

    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let successCount = 0;
        
        for (const row of results) {
          try {
            // Assign to current user if not provided
            if (module === 'clients') {
               row.assignedTo = req.user._id;
            } else if (module === 'deals') {
               row.owner = req.user._id;
               if(row.probability) row.probability = Number(row.probability);
               if(row.amount) row.amount = Number(row.amount);
            }

            const doc = new Model(row);
            await doc.save();
            successCount++;
          } catch (err) {
            errors.push({ row, error: err.message });
          }
        }

        // Clean up file
        fs.unlinkSync(req.file.path);

        await logActivity(req.user._id, 'import_data', module, null, { successCount, errorCount: errors.length }, req);

        sendResponse(res, 200, true, 'Import completed', {
          totalRows: results.length,
          successCount,
          errorCount: errors.length,
          errors: errors.slice(0, 100) // return max 100 errors to avoid massive payloads
        });
      });

  } catch (error) {
    console.error('Import error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    sendResponse(res, 500, false, 'Error importing data');
  }
};

export default {
  exportData,
  importData
};
