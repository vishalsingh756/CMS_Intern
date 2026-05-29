# MERN Stack CMS - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Installation Guide](#installation-guide)
5. [API Documentation](#api-documentation)
6. [Frontend Guide](#frontend-guide)
7. [Database Schema](#database-schema)
8. [Deployment](#deployment)
9. [Security Best Practices](#security-best-practices)
10. [Troubleshooting](#troubleshooting)

## Project Overview

This is a modern, production-ready Content Management System built with the MERN stack. It provides comprehensive tools for managing posts, categories, tags, media, users, and comments with role-based access control.

### Key Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control**: Admin, Editor, and Author roles with granular permissions
- **Post Management**: Create, edit, publish, and schedule posts with revision history
- **Media Management**: Upload and organize media files in a centralized library
- **Rich Text Editor**: Integrated rich text editor for content creation
- **SEO Optimization**: Built-in SEO tools including meta tags and sitemap support
- **Comments System**: Moderation system for user comments
- **Activity Logging**: Track all user actions for audit purposes
- **Responsive Dashboard**: Modern admin dashboard with analytics
- **Rate Limiting**: API rate limiting to prevent abuse

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Multer** - File uploads

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Zustand** - State management
- **React Quill** - Rich text editor
- **Recharts** - Data visualization

### DevTools
- **Vite** - Frontend build tool
- **Nodemon** - Auto-restart during development

## Project Structure

```
CMS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── jwt.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── postController.js
│   │   │   ├── categoryController.js
│   │   │   ├── tagController.js
│   │   │   ├── commentController.js
│   │   │   ├── mediaController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── upload.js
│   │   │   └── rateLimiter.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Category.js
│   │   │   ├── Tag.js
│   │   │   ├── Comment.js
│   │   │   ├── Media.js
│   │   │   └── ActivityLog.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── tagRoutes.js
│   │   │   ├── commentRoutes.js
│   │   │   ├── mediaRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── activityLogger.js
│   │   ├── validators/
│   │   │   └── index.js
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PostsList.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditPost.jsx
│   │   │   ├── ViewPost.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Tags.jsx
│   │   │   ├── MediaLibrary.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── ActivityLogs.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── authStore.js
│   │   │   └── ProtectedRoute.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .env.example
└── README.md
```

## Installation Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp ../.env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` with your settings:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cms_db
   JWT_SECRET=your_very_secure_secret_key_minimum_32_characters
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open `http://localhost:3000` in your browser

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- Request body:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- Request body:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

#### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer {token}`

### Posts Endpoints

#### Create Post
- **POST** `/api/posts`
- Headers: `Authorization: Bearer {token}`
- Request body:
  ```json
  {
    "title": "Post Title",
    "content": "<p>Post content</p>",
    "excerpt": "Brief excerpt",
    "category": "category_id",
    "tags": "tag1,tag2",
    "status": "draft"
  }
  ```

#### Get All Posts
- **GET** `/api/posts?page=1&limit=10&status=published&search=keyword`

#### Get Single Post
- **GET** `/api/posts/{id}`

#### Update Post
- **PUT** `/api/posts/{id}`
- Headers: `Authorization: Bearer {token}`

#### Delete Post
- **DELETE** `/api/posts/{id}`
- Headers: `Authorization: Bearer {token}`

#### Publish Post
- **PUT** `/api/posts/{id}/publish`
- Headers: `Authorization: Bearer {token}`

### Categories Endpoints

#### Get All Categories
- **GET** `/api/categories?page=1&limit=10`

#### Create Category
- **POST** `/api/categories`
- Headers: `Authorization: Bearer {token}`
- Request body:
  ```json
  {
    "name": "Category Name",
    "description": "Category description",
    "color": "#06b6d4"
  }
  ```

#### Update Category
- **PUT** `/api/categories/{id}`

#### Delete Category
- **DELETE** `/api/categories/{id}`

### Tags Endpoints
Similar structure to categories.

### Comments Endpoints

#### Get Post Comments
- **GET** `/api/comments/post/{postId}?page=1&limit=20`

#### Create Comment
- **POST** `/api/comments`
- Headers: `Authorization: Bearer {token}`
- Request body:
  ```json
  {
    "postId": "post_id",
    "content": "Comment text",
    "parentCommentId": "optional_parent_comment_id"
  }
  ```

#### Approve Comment
- **PUT** `/api/comments/{id}/approve`
- Headers: `Authorization: Bearer {token}`

#### Reject Comment
- **PUT** `/api/comments/{id}/reject`
- Headers: `Authorization: Bearer {token}`

### Media Endpoints

#### Upload Media
- **POST** `/api/media`
- Headers: `Authorization: Bearer {token}`
- Form data: `file` (multipart/form-data)

#### Get Media Library
- **GET** `/api/media?page=1&limit=20&folder=general&fileType=image`

#### Delete Media
- **DELETE** `/api/media/{id}`

### Users Endpoints (Admin Only)

#### Get All Users
- **GET** `/api/users?page=1&limit=20&role=author`

#### Get Single User
- **GET** `/api/users/{id}`

#### Update User
- **PUT** `/api/users/{id}`

#### Delete User
- **DELETE** `/api/users/{id}`

## Frontend Guide

### Routing

The application uses React Router v6 with protected routes. All authenticated routes require a valid JWT token.

### State Management

Zustand is used for global state management. The `authStore` manages:
- User authentication state
- Login/register operations
- User profile updates
- Logout functionality

### API Integration

All API calls are centralized in `src/services/api.js`. The API client:
- Automatically adds JWT tokens to requests
- Handles 401 errors by redirecting to login
- Includes request/response interceptors for error handling

### Protected Routes

Routes requiring authentication use the `ProtectedRoute` component:
```jsx
<Route path="/posts" element={<ProtectedRoute element={<PostsList />} />} />
```

For role-based routes:
```jsx
<Route 
  path="/users" 
  element={<ProtectedRoute element={<UserManagement />} requiredRole="admin" />} 
/>
```

## Database Schema

### User Schema
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed),
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  role: String (admin, editor, author),
  isActive: Boolean,
  lastLogin: Date,
  emailVerified: Boolean,
  permissions: [String],
  timestamps: true
}
```

### Post Schema
```javascript
{
  title: String (required),
  slug: String (unique, required),
  content: String (required),
  excerpt: String,
  author: ObjectId (ref: User),
  category: ObjectId (ref: Category),
  tags: [ObjectId] (ref: Tag),
  featuredImage: {
    url: String,
    publicId: String
  },
  status: String (draft, published, scheduled, archived),
  publishedAt: Date,
  scheduledFor: Date,
  views: Number,
  likes: Number,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  revisions: [{
    content: String,
    title: String,
    author: ObjectId,
    createdAt: Date
  }],
  timestamps: true
}
```

### Similar schemas exist for Category, Tag, Comment, Media, and ActivityLog

## Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-cms-app
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables in Vercel dashboard**
   - `VITE_API_URL=https://your-backend.herokuapp.com/api`

### Docker Deployment

Create a `docker-compose.yml`:
```yaml
version: '3'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/cms_db
      - JWT_SECRET=your_secret
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo_data:
```

## Security Best Practices

### Implemented Security Measures

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure, expiring tokens with 7-day expiration
3. **CORS**: Configured to allow requests only from frontend domain
4. **Rate Limiting**: Prevents brute force attacks on authentication endpoints
5. **Input Validation**: Express validator used for all user inputs
6. **SQL Injection Prevention**: MongoDB Mongoose prevents injection attacks
7. **XSS Protection**: React automatically escapes content

### Additional Security Recommendations

1. **HTTPS**: Always use HTTPS in production
2. **CSRF Tokens**: Consider implementing CSRF protection
3. **File Upload Security**: 
   - Validate file types and sizes
   - Store files outside public directory
   - Use virus scanning for uploads
4. **API Keys**: Never commit API keys, use environment variables
5. **Database Backups**: Regular MongoDB backups
6. **Monitoring**: Implement error tracking (Sentry, LogRocket)
7. **Dependencies**: Keep npm packages updated regularly

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
```
Solution: Check MONGODB_URI in .env file and ensure MongoDB is running
```

**CORS Error**
```
Solution: Verify FRONTEND_URL in backend .env matches your frontend URL
```

**API Calls Returning 401**
```
Solution: Check if token is properly stored in localStorage and valid
```

**Port Already in Use**
```bash
# For macOS/Linux
lsof -i :5000
kill -9 <PID>

# For Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Best Practices

1. **Always validate user input** on both frontend and backend
2. **Keep API responses consistent** with standard format
3. **Use meaningful error messages** for better debugging
4. **Implement proper logging** for production issues
5. **Write unit and integration tests**
6. **Document API changes** clearly
7. **Use git branches** for feature development
8. **Review code** before merging to main

## Support & Contribution

For issues, questions, or contributions, please refer to the project repository.
