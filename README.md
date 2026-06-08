# Client Management System (CMS)

A modern, production-ready, full-stack CMS built with the **MERN** stack (MongoDB, Express, React, Node.js). This application is designed to streamline client onboarding, sales pipelines, task management, and team interactions.

---

## ⚡ Core Features

- 👥 **Client Directory**: Manage customer profiles, contact info, lead sources, and industries.
- 💼 **Sales Pipeline**: Track active deals, deal stages (Prospect $\rightarrow$ Negotiation $\rightarrow$ Proposal $\rightarrow$ Won/Lost), win probabilities, and value.
- 📅 **Task Manager**: Organize follow-ups with priority levels (High, Medium, Low), statuses, and due dates.
- 💬 **Interaction Logs**: Log emails, phone calls, meetings, and visits, including client sentiment outcome tracking.
- 📊 **Dynamic Reports & Analytics**: Run ad-hoc filters and aggregations to generate metrics and charts (via Recharts).
- 🔍 **Global Search**: Instantly query across clients, deals, tasks, and interaction subjects.
- 🛡️ **Role-Based Access Control (RBAC)**:
  - **Admin**: Full access to all data, system activity audit logs, and user management.
  - **Users/Editors**: Isolated workspace. They only see and manage records they created or are assigned to.
- 📥 **Import & Export**: Built-in support for bulk importing and exporting data via CSV and Excel format.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 18** (Vite build system)
- **Tailwind CSS 3** (Custom SaaS indigo/cyan visual styling)
- **Zustand** (Global state management)
- **Recharts** (Visual data reporting)
- **React Router 6** (Client routing & route protection)
- **Axios** (Configured with central API interceptors for auth tokens)

**Backend:**
- **Node.js** & **Express.js** (ES Modules)
- **MongoDB** & **Mongoose ODM** (Proper indices, schemas, and relational references)
- **JWT & Bcrypt** (Secure stateless session authentication & password hashing)
- **Multer, ExcelJS, csv-parser** (File uploads and data conversion)
- **Express Rate Limit** (Anti-abuse protection)

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure you have **Node.js (v16+)** and **MongoDB** (local community server or Atlas) installed.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   *Modify the `MONGODB_URI` and `JWT_SECRET` in `.env` if needed.*
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *Backend will run at http://localhost:5000 (Health Check: http://localhost:5000/api/health)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will run at http://localhost:3000*

---

## 🔑 Development Access & Roles

You can register a new account on the signup page, or log in using these default credentials:

- **Admin Account:**
  - **Email:** `admin@example.com`
  - **Password:** `admin123456`
- **Standard User Account:**
  - Standard accounts can be created at `http://localhost:3000/register`.

---

## 📁 Repository Structure

```text
CMS/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & JWT settings
│   │   ├── controllers/     # Core CMS logic (clients, deals, tasks, reports)
│   │   ├── middleware/      # Auth protection, rate limiter, file upload
│   │   ├── models/          # MongoDB Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   └── server.js        # Backend entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout, Sidebar, Header
│   │   ├── pages/           # Dashboard, Clients, Deals, Tasks, Reports, User Mgmt
│   │   ├── services/        # Axios API integration
│   │   └── utils/           # Zustand Auth store & Protected Routes
│   └── package.json
```
