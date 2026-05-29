# MERN CMS - Complete Architecture & Best Practices

## Architecture Overview

This CMS is built on a three-tier architecture:

```
┌─────────────────────┐
│   React Frontend    │ (Presentation Layer)
│  - SPA with Router  │
│  - State Management │
│  - Components       │
└──────────┬──────────┘
           │ HTTP/REST
┌──────────▼──────────┐
│  Express Backend    │ (Business Logic Layer)
│  - API Endpoints    │
│  - Authentication   │
│  - Validation       │
│  - Authorization    │
└──────────┬──────────┘
           │ MongoDB Driver
┌──────────▼──────────┐
│   MongoDB Atlas     │ (Data Layer)
│  - Collections      │
│  - Indexes          │
│  - Replication      │
└─────────────────────┘
```

## Data Flow

### User Authentication Flow
```
1. User enters credentials
2. Frontend calls POST /api/auth/login
3. Backend validates credentials with bcrypt
4. JWT token generated with userId and role
5. Token sent back to frontend
6. Frontend stores in localStorage
7. Token added to all subsequent requests
8. Backend middleware validates token
```

### Content Creation Flow
```
1. Author creates post in editor
2. Frontend validates input
3. POST /api/posts with content
4. Backend validates and sanitizes
5. Slug generated from title
6. Post saved to MongoDB
7. Activity logged
8. Post returned with ID
9. Author can edit/publish/schedule
```

### Comment Moderation Flow
```
1. Reader submits comment
2. Comment status = pending
3. Editor receives notification
4. Editor reviews comment
5. PUT /comments/{id}/approve
6. Comment becomes visible to readers
7. Activity logged
```

## Design Patterns Used

### 1. MVC Architecture
- **Models**: Mongoose schemas define data structure
- **Views**: React components render UI
- **Controllers**: Business logic handlers

### 2. Middleware Pattern
```javascript
app.use(cors());           // CORS middleware
app.use(errorHandler);     // Error handling
app.use(protect);          // Authentication
app.use(authorize());      // Authorization
```

### 3. Service Layer Pattern
API calls centralized in `services/api.js` for:
- Single source of truth
- Easy mocking for tests
- Consistent error handling

### 4. Repository Pattern
Mongoose models act as repositories:
- Encapsulate database queries
- Provide consistent interface
- Enable caching implementation

### 5. Factory Pattern
Auth token generation:
```javascript
const token = generateToken(userId, role); // Token factory
```

## Database Design

### Normalization Strategy

**Users** collection:
- Stores user information
- Indexed by email, username
- No post data (referenced via relationship)

**Posts** collection:
- Contains post content
- References author by ID (not embedded)
- Indexes on slug, status, createdAt for fast queries

**Categories** collection:
- Separate from posts
- Allows flexible assignment
- Enables category-specific features

**Comments** collection:
- Separate to allow infinite hierarchy
- Parent-child relationships
- Denormalized postCount for performance

### Indexing Strategy

```javascript
// Frequently queried fields
Post: index on (slug, status, createdAt)
User: index on (email, username)
Comment: index on (post, createdAt)
```

## State Management

### Zustand Store Pattern

```javascript
const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  
  setUser: (user) => set({ user }),
  login: async (credentials) => {
    // Async action
    const response = await authService.login(credentials);
    set({ user: response.data.user });
  }
}));
```

**Benefits:**
- Minimal boilerplate
- Easy async actions
- Middleware support
- Smaller bundle size

## Security Implementation

### Password Security
```javascript
// During registration
const salt = await bcrypt.genSalt(10);
password = await bcrypt.hash(password, salt);

// During login
const isValid = await user.comparePassword(enteredPassword);
```

### JWT Security
```javascript
// Token structure
{
  id: userId,
  role: userRole,
  iat: issuedAt,
  exp: expirationTime
}

// Token verification on every protected route
const decoded = jwt.verify(token, SECRET);
const user = await User.findById(decoded.id);
```

### Input Validation

#### Backend Validation
```javascript
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 }),
body('title').trim().isLength({ min: 5, max: 200 })
```

#### Frontend Validation
```javascript
if (!email.includes('@')) {
  setErrors({ email: 'Invalid email' });
}
```

## Error Handling

### Centralized Error Handler
```javascript
export const errorHandler = (err, req, res, next) => {
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(errors);
  }
  
  // Duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Already exists' });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  // Default error
  res.status(500).json({ message: 'Server error' });
};
```

## Performance Optimization

### Backend Optimizations
1. **Database Indexing**: Queries execute in O(log n)
2. **Pagination**: Limit results to 10-100 items
3. **Compression**: gzip middleware enabled
4. **Rate Limiting**: Prevent abuse
5. **Caching**: Redis for session data (future)

### Frontend Optimizations
1. **Code Splitting**: React Router lazy loading
2. **Component Memoization**: React.memo for expensive components
3. **Image Optimization**: Next-gen formats
4. **Bundle Analysis**: Webpack analyzer

### Query Optimization

**Before:**
```javascript
const posts = await Post.find();  // All fields, all posts
```

**After:**
```javascript
const posts = await Post.find()
  .select('title slug status createdAt')
  .limit(10)
  .sort({ createdAt: -1 });
```

## Testing Strategy

### Unit Tests

**Backend Controllers:**
```javascript
describe('Post Controller', () => {
  it('should create a post with valid data', async () => {
    const result = await createPost(mockRequest, mockResponse);
    expect(result).toBeDefined();
  });
  
  it('should reject invalid post data', async () => {
    const result = await createPost(invalidRequest, mockResponse);
    expect(result).toHaveError();
  });
});
```

**Frontend Components:**
```javascript
describe('PostForm', () => {
  it('should render form fields', () => {
    const { getByLabelText } = render(<PostForm />);
    expect(getByLabelText('Title')).toBeInTheDocument();
  });
});
```

### Integration Tests

```javascript
describe('Post API', () => {
  it('should create and retrieve a post', async () => {
    const post = await createPost(postData);
    const retrieved = await getPost(post.id);
    expect(retrieved.title).toBe(postData.title);
  });
});
```

## Scalability Recommendations

### Current Limits
- Single server: ~1000 concurrent users
- MongoDB: Standard cluster
- Storage: 100GB+ with Atlas

### Scaling Strategy

#### Phase 1: Single Server (Current)
- Vertical scaling (increase server resources)
- Implement caching
- Database optimization

#### Phase 2: Load Balancing
```
┌──────────────────┐
│   Load Balancer  │
├──────────────────┤
│ Backend 1  │ Backend 2 │ Backend 3
│ (Port 5000) │ (Port 5001) │ (Port 5002)
└──────────────────┘
    ↓ Shared
  MongoDB Cluster
```

#### Phase 3: Microservices
```
API Gateway
├── Auth Service
├── Post Service
├── Comment Service
├── Media Service
└── User Service
```

#### Phase 4: Global Distribution
- CDN for frontend (Cloudflare)
- Multi-region database (MongoDB Atlas regions)
- Edge computing (Cloudflare Workers)

## Deployment Best Practices

### Environment-Specific Configuration

**.env.development**
```
NODE_ENV=development
DEBUG=true
MONGODB_URI=mongodb://localhost:27017/cms_dev
```

**.env.production**
```
NODE_ENV=production
DEBUG=false
MONGODB_URI=mongodb+srv://prod_cluster/cms_prod
SENTRY_DSN=your_sentry_dsn
```

### Zero-Downtime Deployment

```bash
# Using PM2
pm2 reload all --update-env

# Blue-Green Deployment
# Run version B alongside version A
# Switch traffic to B
# Keep A as rollback option
```

## Monitoring & Observability

### Logging Strategy

```javascript
logger.info('User logged in', { userId, timestamp });
logger.error('Database error', { error, query });
logger.warn('High memory usage', { usage: '85%' });
```

### Metrics to Track

1. **Application Metrics**
   - Response time (p50, p95, p99)
   - Error rate
   - Request volume
   - Database query time

2. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network bandwidth

3. **Business Metrics**
   - User registrations
   - Posts created
   - Comments posted
   - Active users

## Documentation Standards

### Code Comments
```javascript
/**
 * Create a new post with validation
 * @param {Object} req - Express request object
 * @param {Object} req.body - Post data
 * @param {string} req.body.title - Post title
 * @returns {Promise<Object>} Created post object
 */
export const createPost = async (req, res) => {
  // Implementation
};
```

### API Documentation Format
```
POST /api/posts
Create a new post

Request:
  Headers: Authorization: Bearer {token}
  Body: { title, content, category }

Response:
  200: { success: true, data: { id, title, ... } }
  400: { success: false, message: 'Validation error' }
  401: { success: false, message: 'Unauthorized' }
```

## Git Workflow

```bash
# Feature branch
git checkout -b feature/add-comments

# Commit with conventional messages
git commit -m "feat: add comment moderation system"

# Create pull request
# Peer review required
# CI/CD tests must pass
# Merge to main

# Semantic versioning
git tag v1.2.0
git push origin v1.2.0
```

## Conclusion

This architecture provides:
✓ Scalability
✓ Maintainability
✓ Security
✓ Performance
✓ Testability
✓ Flexibility

Follow these patterns for consistent, professional-grade code.
