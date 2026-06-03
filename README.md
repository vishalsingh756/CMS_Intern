# README - MERN CMS

## 🚀 Modern Content Management System

A production-ready, full-stack Content Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

### ✨ Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt hashing
- 👥 **Role-Based Access Control**: Admin, Editor, and Author roles
- 📝 **Content Management**: Create, edit, publish, and schedule posts
- 📁 **Media Library**: Upload and organize media files
- 💬 **Comment System**: Comment moderation and management
- 📊 **Analytics Dashboard**: Real-time statistics and metrics
- 🔍 **SEO Tools**: Meta tags, sitemaps, and slug optimization
- 📱 **Responsive Design**: Mobile-friendly admin interface
- 🎨 **Rich Text Editor**: WYSIWYG editor for content creation
- ⚡ **Performance Optimized**: Pagination, caching, and database indexing

### 🛠️ Technology Stack

**Frontend:**
- React 18.2
- React Router 6
- Tailwind CSS 3
- Zustand (State Management)
- React Quill (Rich Text Editor)
- Axios (HTTP Client)
- Vite (Build Tool)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication
- Bcrypt (Password Hashing)

**DevTools:**
- Nodemon
- ESLint
- Jest

### 📋 Prerequisites

- Node.js >= 16.0
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

### ⚡ Quick Start

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/cms.git
cd cms
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 4. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

### 📁 Project Structure

```
cms/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utilities
│   │   └── server.js       # Entry point
│   └── package.json
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API integration
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app
│   └── package.json
│
├── DOCUMENTATION.md         # Complete documentation
├── DEPLOYMENT.md           # Deployment guide
├── ARCHITECTURE.md         # Architecture & patterns
└── README.md              # This file
```

### 🔑 Default Users

After setup, create accounts via registration or use:
- Email: admin@example.com
- Password: admin123456

### 📚 Documentation

- [Complete Documentation](./DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Architecture & Best Practices](./ARCHITECTURE.md)
- [API Reference](./API.md)

### 🔌 API Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

**Posts**
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/publish` - Publish post

**Categories**
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Tags**
- Similar to categories

**Comments**
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/approve` - Approve comment
- `PUT /api/comments/:id/reject` - Reject comment

**Media**
- `POST /api/media` - Upload file
- `GET /api/media` - Get media library
- `DELETE /api/media/:id` - Delete file

**Users** (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### 🔒 Security Features

✅ Password hashing with bcrypt
✅ JWT token authentication
✅ Role-based access control
✅ Input validation and sanitization
✅ CORS protection
✅ Rate limiting
✅ SQL injection prevention
✅ XSS protection

### 📈 Performance Features

✅ Database indexing
✅ Query pagination
✅ Response compression
✅ Lazy loading
✅ Code splitting
✅ Caching headers

### 🚀 Deployment

### Heroku (Backend)
```bash
heroku create your-cms-app
heroku config:set MONGODB_URI="your_uri"
heroku config:set JWT_SECRET="your_secret"
git push heroku main
```

### Vercel (Frontend)
```bash
vercel --prod
```

See [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

### 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cms_db
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### 🐛 Troubleshooting

**MongoDB Connection Error**
- Verify MONGODB_URI in .env
- Ensure MongoDB is running
- Check network access (if using Atlas)

**CORS Error**
- Check FRONTEND_URL in backend .env
- Ensure frontend URL matches configuration

**Port Already in Use**
```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 💬 Support

For support, email support@example.com or open an issue on GitHub.

### 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Authentication](https://jwt.io/)

### 🎯 Roadmap

- [ ] Multi-language support
- [ ] AI-assisted content generation
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Webhooks
- [ ] GraphQL API
- [ ] Mobile app
- [ ] Advanced analytics

### ⭐ Show Your Support

If you like this project, please consider giving it a star on GitHub!

---

Made with ❤️ by the CMS Team


> **Core Principle:** Don't save report data — save report *definitions* and generate data on demand using MongoDB Aggregation Pipelines. This is the same high-level pattern used by enterprise CRM platforms like Salesforce.

### 1. Report Definition Schema

Report configurations are stored in MongoDB, not the generated output:

```js
{
  _id,
  name: "Leads by Status",
  module: "leads",          // clients | deals | tasks | interactions
  columns: ["name", "email", "status", "createdAt"],
  filters: [
    { field: "status",      operator: "equals",      value: "Qualified" },
    { field: "createdAt",   operator: "greaterThan", value: "2026-01-01" },
    { field: "source",      operator: "in",          value: ["Website", "Referral"] }
  ],
  sort:    { field: "createdAt", order: "desc" },
  groupBy: "status",
  createdBy: ObjectId
}
```

### 2. Dynamic Report Builder UI

#### Select Module
Choose the data source your report targets:
- Clients · Deals · Tasks · Interactions · Users

#### Select Columns
```
☑ Name          ☑ Email
☑ Status        ☑ Created Date
☐ Phone         ☐ Source
```

#### Add Filters
```
Status         = Qualified
Created Date   > 01-01-2026
Source         IN (Website, Referral)
```

### 3. MongoDB Aggregation Pipeline (Backend)

User-defined filters are converted into aggregation stages at runtime:

```js
// Generated from report definition
const pipeline = [
  { $match:   { status: "Qualified", createdAt: { $gt: new Date("2026-01-01") } } },
  { $group:   { _id: "$status", count: { $sum: 1 }, totalValue: { $sum: "$value" } } },
  { $sort:    { createdAt: -1 } },
  { $project: { name: 1, email: 1, status: 1, createdAt: 1 } },
  { $skip:    (page - 1) * limit },
  { $limit:   limit }
];

const result = await Lead.aggregate(pipeline);
```

### 4. Feature Phases

#### ✅ Phase 1 — Core Reporting (Must Have)
- Column selection
- Filter builder (equals, contains, greaterThan, in, between)
- Sorting
- Pagination
- Save / load report definitions
- Export to **CSV**

#### 🔄 Phase 2 — Aggregations & Charts
- Group By field
- Aggregate functions: **Count**, **Sum**, **Average**, **Min**, **Max**
- Date range filters (today, this week, this month, custom)
- **Bar / Pie / Line charts** via Recharts

#### 🗓️ Phase 3 — Advanced
- Scheduled reports (cron jobs)
- Email reports to recipients
- Dashboard widgets from saved reports
- Shared / public report links

### 5. Export Technologies

| Format | Library     |
|--------|-------------|
| CSV    | `json2csv`  |
| Excel  | `exceljs`   |
| PDF    | `pdfkit`    |

### 6. Backend API Endpoints

```
POST   /api/reports              → Create report definition
GET    /api/reports              → List saved reports
GET    /api/reports/:id          → Get report definition
POST   /api/reports/:id/run      → Execute report (returns paginated data)
POST   /api/reports/:id/export   → Export as CSV / Excel / PDF
DELETE /api/reports/:id          → Delete report
```

### 7. Tech Stack for Reports

**Frontend**
- React + Recharts (charts)
- AG Grid or Material React Table (data grid)

**Backend**
- Express + Mongoose
- MongoDB Aggregation Pipeline

**Export**
- `json2csv` · `exceljs` · `pdfkit`

### 8. End-to-End Flow

```
User Builds Report
      ↓
Save Definition → MongoDB
      ↓
User Clicks "Run"
      ↓
Generate Aggregation Pipeline
      ↓
Query MongoDB Dynamically
      ↓
Return Paginated Results
      ↓
Display Table / Chart
      ↓
Export CSV / Excel / PDF
```

---

### 🎯 Roadmap

- [ ] Multi-language support
- [ ] AI-assisted content generation
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Webhooks
- [ ] GraphQL API
- [ ] Mobile app
- [x] **Reporting Engine** *(architecture defined — implementation in progress)*
- [ ] Scheduled report emails
