# Client Management System (CRM) - Project Overview

This document provides a comprehensive overview of how the Client Management System (CRM) project is structured, its architecture, core features, and the technology stack powering it.

## 🏗️ Architecture Overview
The project is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It follows a standard decoupled architecture where the Frontend and Backend act as separate entities communicating via RESTful APIs.

### The Tech Stack
*   **Frontend**: React (built with Vite), Tailwind CSS for styling, Zustand for global state management, Recharts for dashboard analytics, React Router for navigation, and Axios for HTTP requests.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (via Mongoose ODMs).
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt for password hashing.

---

## 🔐 Security & Role-Based Access Control (RBAC)

The application implements a strict Role-Based Access Control system to ensure data privacy and security.

### Roles Defined:
1.  **Admin**: Has full access to the system. Can view all data across the platform, manage other users, and view system-wide activity logs.
2.  **Editor / Author**: Standard users. They can interact with the system but are **isolated to their own data**. They can only view, edit, and delete Clients, Deals, Tasks, and Interactions that they personally created or are assigned to.

### How it works:
*   **Backend Verification**: Every protected API route passes through an `auth.js` middleware which verifies the JWT token. Specific routes (like User Management) pass through an `authorize('admin')` check.
*   **Data Isolation**: In the backend controllers, if a user is not an Admin, MongoDB queries are automatically appended with `{ owner: req.user._id }` to prevent them from fetching other users' data.
*   **Frontend Routing**: The `ProtectedRoute.jsx` component wraps routes and restricts access based on the user's role stored in the Zustand state manager.

---

## 🌟 Core Features & Modules

### 1. Dashboard (`/dashboard`)
The central hub providing a high-level overview of the user's performance.
*   **Metrics**: Displays total revenue, active deals, task completion stats, and active clients.
*   **Charts**: Uses `recharts` to render visual representations of Deal Pipelines (Prospect, Negotiation, Won, Lost) and Revenue Growth over time.
*   **Dynamic**: Data fetched is specific to the logged-in user (unless they are an Admin).

### 2. Client Management (`/clients`)
The core module for managing business relationships.
*   **Features**: Full CRUD (Create, Read, Update, Delete) operations.
*   **Details**: Tracks company info, contact details, lead sources, and categorizes them by Status (Prospect, Active, Inactive, Lost).
*   **Detail View**: Clicking on a client opens a detailed profile combining their Contact Info, linked Deals, assigned Tasks, and a history of Interactions.

### 3. Deals Pipeline (`/deals`)
Tracks potential revenue and sales opportunities.
*   **Pipeline Stages**: Deals move through stages: Prospect → Negotiation → Proposal → Won/Lost.
*   **Metrics**: Calculates probability percentages and tracks expected close dates.

### 4. Tasks Management (`/tasks`)
A built-in to-do system to track follow-ups and actions required for clients.
*   **Features**: Priority tagging (High, Medium, Low), due dates, and quick status toggles (Open, In Progress, Completed).

### 5. Interactions Log (`/interactions`)
A timeline of all communications with clients.
*   **Types**: Tracks Emails, Phone Calls, Meetings, and Site Visits.
*   **Outcomes**: Records the outcome of the interaction (Positive, Negative, Neutral) to gauge client sentiment.

### 6. User Management & Activity Logs (Admin Only)
*   **User Management**: Admins can view all registered users, change their roles, or deactivate accounts.
*   **Activity Logs**: A system-wide audit trail tracking who did what and when (e.g., "John Doe created Deal: Enterprise License").

---

## 📂 Folder Structure

The project is divided into two distinct directories:

### `/frontend`
```text
frontend/
├── src/
│   ├── components/      # Reusable UI components (Sidebar, Layout, Header)
│   ├── pages/           # Main route views (Dashboard, Clients, Deals, Login, etc.)
│   ├── services/        # API layer (Axios configurations, endpoint definitions)
│   ├── styles/          # Tailwind CSS global styles and variables
│   ├── utils/           # Helper functions, Zustand auth store, Protected Routes
│   ├── App.jsx          # Router configuration
│   └── main.jsx         # React application entry point
```

### `/backend`
```text
backend/
├── src/
│   ├── config/          # Database connection, JWT generation
│   ├── controllers/     # Business logic for all modules (Clients, Deals, Tasks, etc.)
│   ├── middleware/      # JWT Authentication, Error handling, Rate limiting
│   ├── models/          # Mongoose database schemas
│   ├── routes/          # Express route definitions pointing to controllers
│   ├── utils/           # Helpers (Pagination, Activity Logger)
│   └── server.js        # Express application entry point
```

---

## 🚀 Data Flow (Example: Creating a Client)
1.  **User Action**: The user fills out the "Add Client" modal in React and clicks Submit.
2.  **API Call**: The frontend `clientService.createClient(data)` sends an Axios POST request to `/api/clients` containing the form payload and the user's JWT in the Authorization header.
3.  **Authentication**: Express routes the request through the `protect` middleware, validating the JWT and attaching the user object to the request.
4.  **Controller Logic**: `clientController.createClient` extracts the data, automatically sets the `assignedTo` field to the requesting user's ID, and saves it to MongoDB.
5.  **Audit Trail**: The backend triggers the `logActivity` utility, recording that a client was created.
6.  **Response**: The backend returns a 201 Success status with the new client data.
7.  **UI Update**: The frontend receives the success response, triggers a success Toast notification, closes the modal, and refetches the table data to show the new client.
