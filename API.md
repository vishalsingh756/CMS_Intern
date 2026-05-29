# API Reference - MERN CMS

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "userid",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "author"
    }
  }
}

Errors:
409: User already exists
400: Validation error
```

### Login User
```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": { ... }
  }
}

Errors:
401: Invalid credentials
400: Missing email or password
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "userid",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "role": "author",
    "bio": "..."
  }
}

Errors:
401: Unauthorized
404: User not found
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Content creator"
}

Response (200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}

Errors:
401: Unauthorized
400: Validation error
```

### Logout
```
GET /auth/logout
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Logout successful"
}
```

## Posts Endpoints

### Create Post
```
POST /posts
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "My First Post",
  "content": "<p>Post content...</p>",
  "excerpt": "Brief summary",
  "category": "categoryId",
  "tags": "tag1,tag2",
  "status": "draft",
  "seoTitle": "SEO Title",
  "seoDescription": "SEO description",
  "seoKeywords": "keyword1,keyword2"
}

Response (201):
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "postId",
    "title": "My First Post",
    "slug": "my-first-post",
    "status": "draft",
    "author": { ... },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

Errors:
400: Validation error
401: Unauthorized
403: Insufficient permissions
```

### Get All Posts
```
GET /posts?page=1&limit=10&status=published&search=keyword&category=categoryId

Query Parameters:
  page: Page number (default: 1)
  limit: Items per page (default: 10, max: 100)
  status: draft|published|scheduled|archived
  category: Category ID
  search: Search term for title/content/excerpt

Response (200):
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": [ { ... } ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}

Errors:
400: Invalid parameters
```

### Get Single Post
```
GET /posts/{id}

Response (200):
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": "postId",
    "title": "My First Post",
    "content": "...",
    "author": { ... },
    "category": { ... },
    "tags": [ ... ],
    "comments": 5,
    "views": 120,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

Errors:
404: Post not found
```

### Update Post
```
PUT /posts/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request: Same as Create Post

Response (200):
{
  "success": true,
  "message": "Post updated successfully",
  "data": { ... }
}

Errors:
404: Post not found
403: Not authorized
400: Validation error
```

### Delete Post
```
DELETE /posts/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Post deleted successfully"
}

Errors:
404: Post not found
403: Not authorized
```

### Publish Post
```
PUT /posts/{id}/publish
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Post published successfully",
  "data": {
    "status": "published",
    "publishedAt": "2024-01-01T00:00:00Z"
  }
}

Errors:
404: Post not found
403: Not authorized
```

### Get Post Revisions
```
GET /posts/{id}/revisions
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [
    {
      "title": "Original Title",
      "content": "...",
      "author": "userId",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}

Errors:
404: Post not found
```

### Autosave Draft
```
PUT /posts/{id}/autosave
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "content": "...",
  "title": "..."
}

Response (200):
{
  "success": true,
  "message": "Draft autosaved",
  "data": {
    "content": "...",
    "lastSaved": "2024-01-01T00:00:00Z"
  }
}
```

## Categories Endpoints

### Get All Categories
```
GET /categories?page=1&limit=10&search=keyword

Response (200):
{
  "success": true,
  "data": [ { ... } ],
  "pagination": { ... }
}
```

### Get Single Category
```
GET /categories/{id}

Response (200):
{
  "success": true,
  "data": {
    "id": "categoryId",
    "name": "Technology",
    "slug": "technology",
    "description": "Tech posts",
    "postCount": 15
  }
}

Errors:
404: Category not found
```

### Create Category
```
POST /categories
Authorization: Bearer {token}
Content-Type: application/json
Role Required: editor, admin

Request:
{
  "name": "Technology",
  "description": "Technology related posts",
  "color": "#06b6d4"
}

Response (201):
{
  "success": true,
  "message": "Category created successfully",
  "data": { ... }
}

Errors:
400: Validation error
403: Insufficient permissions
```

### Update Category
```
PUT /categories/{id}
Authorization: Bearer {token}
Role Required: editor, admin

Response (200): { ... }
Errors: 404, 403, 400
```

### Delete Category
```
DELETE /categories/{id}
Authorization: Bearer {token}
Role Required: editor, admin

Response (200): { ... }
Errors: 404, 403
```

## Tags Endpoints

### Get All Tags
```
GET /tags?page=1&limit=10&search=keyword

Response (200): Same as categories
```

### Create Tag
```
POST /tags
Authorization: Bearer {token}
Role Required: editor, admin

Request:
{
  "name": "JavaScript",
  "color": "#f59e0b"
}

Response (201): { ... }
```

### Update/Delete Tags
Same as categories

## Comments Endpoints

### Get Post Comments
```
GET /comments/post/{postId}?page=1&limit=20&status=approved

Query Parameters:
  page: Page number
  limit: Items per page
  status: pending|approved|rejected|spam

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "commentId",
      "content": "Great post!",
      "author": { ... },
      "status": "approved",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Create Comment
```
POST /comments
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "postId": "postId",
  "content": "Great post!",
  "parentCommentId": "optional_parent_id"
}

Response (201):
{
  "success": true,
  "message": "Comment created successfully",
  "data": { ... }
}

Errors:
400: Validation error
403: Comments disabled
```

### Update Comment
```
PUT /comments/{id}
Authorization: Bearer {token}

Request:
{
  "content": "Updated comment"
}

Response (200): { ... }
Errors: 404, 403
```

### Delete Comment
```
DELETE /comments/{id}
Authorization: Bearer {token}

Response (200): { ... }
Errors: 404, 403
```

### Approve Comment
```
PUT /comments/{id}/approve
Authorization: Bearer {token}
Role Required: editor, admin

Response (200):
{
  "success": true,
  "message": "Comment approved",
  "data": { ... }
}

Errors: 404, 403
```

### Reject Comment
```
PUT /comments/{id}/reject
Authorization: Bearer {token}
Role Required: editor, admin

Response (200):
{
  "success": true,
  "message": "Comment rejected",
  "data": { ... }
}
```

## Media Endpoints

### Upload Media
```
POST /media
Authorization: Bearer {token}
Content-Type: multipart/form-data

Request:
{
  "file": <binary file>,
  "folder": "general"
}

Response (201):
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "mediaId",
    "filename": "image-123.jpg",
    "originalName": "photo.jpg",
    "size": 102400,
    "url": "/uploads/image-123.jpg",
    "fileType": "image",
    "uploadedAt": "2024-01-01T00:00:00Z"
  }
}

Errors:
400: No file uploaded
413: File too large
415: Unsupported file type
```

### Get Media Library
```
GET /media?page=1&limit=20&folder=general&fileType=image&search=keyword
Authorization: Bearer {token}

Query Parameters:
  page: Page number
  limit: Items per page
  folder: Folder name
  fileType: image|video|document|audio|other
  search: Search by filename

Response (200):
{
  "success": true,
  "data": [ { ... } ],
  "pagination": { ... }
}
```

### Get Single Media File
```
GET /media/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {
    "id": "mediaId",
    "filename": "image-123.jpg",
    "uploadedBy": { ... }
  }
}
```

### Delete Media File
```
DELETE /media/{id}
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Media deleted successfully"
}

Errors:
404: Media not found
403: Not authorized
```

## Users Endpoints (Admin Only)

### Get All Users
```
GET /users?page=1&limit=20&role=author&search=keyword
Authorization: Bearer {token}
Role Required: admin

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "userId",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "author",
      "isActive": true,
      "lastLogin": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { ... }
}

Errors:
403: Not admin
```

### Get Single User
```
GET /users/{id}
Authorization: Bearer {token}
Role Required: admin

Response (200): { ... }
```

### Update User
```
PUT /users/{id}
Authorization: Bearer {token}
Role Required: admin

Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@example.com",
  "role": "editor",
  "isActive": true
}

Response (200): { ... }
```

### Delete User
```
DELETE /users/{id}
Authorization: Bearer {token}
Role Required: admin

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}

Errors:
400: Cannot delete own account
404: User not found
```

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 413 | Payload Too Large | File too large |
| 415 | Unsupported Media Type | Invalid file type |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

## Rate Limiting

- Registration: 5 attempts per hour
- Login: 5 attempts per 15 minutes
- General API: 100 requests per 15 minutes

## Pagination

```
Limit: 1-100 (default: 10)
Page: Starting from 1
Total: Total count of items
Pages: Total pages available
```

## Status Codes

### Posts
- `draft`: Not published
- `published`: Live and visible
- `scheduled`: Set to publish later
- `archived`: Hidden from public

### Comments
- `pending`: Awaiting moderation
- `approved`: Visible to public
- `rejected`: Hidden from public
- `spam`: Marked as spam

### Users
- Active: Able to login
- Inactive: Blocked from login

---

For more details, see the complete [Documentation](./DOCUMENTATION.md)
