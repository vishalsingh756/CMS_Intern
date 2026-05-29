# QUICK START GUIDE

## ⚡ Get Running in 5 Minutes

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm/yarn

### Step 1: Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cms_db
JWT_SECRET=your_secret_key_minimum_32_characters_long_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Start backend:**
```bash
npm run dev
```
✅ Backend running at: http://localhost:5000/api/health

### Step 2: Frontend Setup

**Open new terminal:**
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running at: http://localhost:3000

### Step 3: Create Your Account

1. Go to http://localhost:3000/register
2. Fill in the registration form
3. Click "Create Account"
4. You'll be automatically logged in to the dashboard

### Step 4: Start Creating Content

- Click "New Post" button
- Add title and content
- Save as draft or publish
- Manage categories and tags
- Upload media files

---

## 📁 Project Structure

```
CMS/
├── backend/          (Express.js API)
├── frontend/         (React App)
└── docs/
    ├── README.md          (Overview)
    ├── API.md             (Endpoints)
    ├── DEPLOYMENT.md      (Deploy guide)
    ├── ARCHITECTURE.md    (Tech details)
    └── DOCUMENTATION.md   (Full docs)
```

---

## 🔑 Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Frontend |
| http://localhost:5000/api | Backend |
| http://localhost:5000/api/health | Health check |
| http://localhost:3000/login | Login page |
| http://localhost:3000/register | Register page |
| http://localhost:3000/dashboard | Dashboard |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Author** | Create/edit own posts |
| **Editor** | Manage categories, tags, approve comments |
| **Admin** | Full access, user management |

---

## 💾 MongoDB Setup

### Option 1: Local MongoDB
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (already running as service)
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

---

## 🆘 Troubleshooting

### Port 5000 Already in Use
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
- Verify MONGODB_URI in .env
- Check MongoDB is running
- For Atlas: Whitelist your IP

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Check FRONTEND_URL in backend .env
- Should match your frontend URL

---

## 📚 Documentation

- **[Full Documentation](./DOCUMENTATION.md)** - Complete guide
- **[API Reference](./API.md)** - All endpoints
- **[Deployment](./DEPLOYMENT.md)** - Deploy options
- **[Architecture](./ARCHITECTURE.md)** - Technical details
- **[README](./README.md)** - Project overview

---

## 🚀 Deploy to Production

```bash
# See DEPLOYMENT.md for:
- Heroku deployment
- Vercel deployment  
- AWS EC2 setup
- Docker setup
```

---

## 📞 Common Tasks

### Add a New User (Admin)
1. Go to Users page
2. View all users
3. Click "Add User"
4. Fill details

### Create Post
1. Click "New Post"
2. Add title, content
3. Select category/tags
4. Save draft or publish

### Upload Media
1. Go to Media Library
2. Click "Upload"
3. Select file
4. Choose folder

### Approve Comments
1. Go to Posts
2. View comments
3. Click "Approve" or "Reject"

---

## ✨ Features Available

✅ Post management (draft/publish/schedule)
✅ Comment moderation
✅ Media uploads
✅ User management
✅ Activity logs
✅ SEO tools
✅ Rich text editor
✅ Analytics dashboard
✅ Role-based access
✅ Rate limiting

---

## 🔒 Security Notes

- Change JWT_SECRET to a strong random value
- Use MongoDB Atlas (cloud) for production
- Enable SSL/HTTPS in production
- Keep npm packages updated
- Never commit .env file

---

## 📱 Testing

### Create Test Post
1. Login with your account
2. Go to Posts → New Post
3. Add test content
4. Save and publish

### Test Authentication
- Try accessing /posts without login (should redirect)
- Login with test account
- Verify token stored in localStorage

### Test Comments
1. View a published post
2. Add a comment
3. Check admin approval needed

---

## 💡 Tips

- Use Rich Text Editor for formatting
- SEO fields are optional but recommended
- Set category before publishing
- Create tags for better organization
- Regular backups recommended

---

## ⚙️ Environment Variables Explained

```
MONGODB_URI      → Your database connection string
JWT_SECRET       → Secret key for tokens (keep safe!)
JWT_EXPIRE       → Token expiration (7d = 7 days)
PORT             → Backend port
NODE_ENV         → development or production
FRONTEND_URL     → URL of your frontend app
```

---

## 📞 Need Help?

Check these resources:
1. Read relevant documentation file
2. Review API.md for endpoint details
3. Check TROUBLESHOOTING in DOCUMENTATION.md
4. Review error messages in console
5. Check browser console for frontend errors

---

**You're all set! Happy content creation! 🎉**

For detailed information, see the documentation files.
