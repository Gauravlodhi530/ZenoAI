# Debug: Chat Creation Failing

## Error Message
"Failed to create chat. Please try again."

## Step-by-Step Debugging

### 1. Check Backend is Running

**Open a new terminal and run:**
```bash
cd backend
npm start
```

**Expected output:**
```
Server running on port 3000
http://localhost:3000
```

**If you see errors:**
- MongoDB connection error → Start MongoDB
- Port 3000 in use → Kill the process or change port
- Module not found → Run `npm install`

### 2. Test Backend Health

**Open browser and go to:**
```
http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

**If you get an error:**
- Cannot connect → Backend is not running
- 404 → Wrong URL or backend not started

### 3. Check MongoDB Connection

**In backend terminal, look for:**
```
MongoDB connected successfully
```

**If not connected:**

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB
brew services start mongodb-community
# or
sudo systemctl start mongod
```

**Check .env file has:**
```env
MONGO_URI=mongodb://localhost:27017/zenoai
```

### 4. Check Authentication

**Open browser console (F12) and run:**
```javascript
// Check if logged in
console.log("User:", store.getState().auth.user);
console.log("Is Authenticated:", store.getState().auth.isAuthenticated);

// Check cookies
document.cookie
```

**Expected:**
- User object with id, fullName, email
- isAuthenticated: true
- Cookie contains "token="

**If not logged in:**
1. Go to login page
2. Login with your credentials
3. Try creating chat again

### 5. Check Browser Console

**When you click "New chat", check console for:**

**Success logs:**
```
Creating chat with title: Test
API URL: http://localhost:3000
User: {id: "...", fullName: {...}, email: "..."}
Chat created successfully: {_id: "...", title: "Test", ...}
```

**Error logs:**
```
Error creating chat: Error: Request failed with status code 401
Error response: {data: {message: "unauthorized"}, status: 401}
```

### 6. Common Error Codes

**401 Unauthorized:**
- Not logged in
- Token expired
- Cookie not sent
- **Solution:** Logout and login again

**500 Internal Server Error:**
- MongoDB not connected
- Database error
- Backend crash
- **Solution:** Check backend console for errors

**404 Not Found:**
- Wrong API URL
- Route not registered
- **Solution:** Check API_URL in config/api.js

**Network Error:**
- Backend not running
- CORS issue
- Wrong port
- **Solution:** Start backend, check CORS settings

### 7. Check CORS Settings

**In `backend/src/app.js`, verify:**
```javascript
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
```

**If frontend is on different port, update origin**

### 8. Check Environment Variables

**Backend `.env` file must have:**
```env
MONGO_URI=mongodb://localhost:27017/zenoai
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key
PORT=3000
```

**Check if .env exists:**
```bash
cd backend
ls -la .env  # Mac/Linux
dir .env     # Windows
```

### 9. Test API Directly

**Use curl or Postman to test:**

**Get auth token first (login):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}' \
  -c cookies.txt
```

**Create chat with token:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Chat"}' \
  -b cookies.txt
```

**Expected response:**
```json
{
  "message": "chat created successfully",
  "chat": {
    "_id": "...",
    "title": "Test Chat",
    "lastActivity": "..."
  }
}
```

### 10. Check Network Tab

**In browser DevTools:**
1. Open Network tab (F12)
2. Click "New chat"
3. Look for POST request to `/api/chat`
4. Click on the request
5. Check:
   - **Status:** Should be 201
   - **Request Headers:** Should have Cookie
   - **Request Payload:** Should have title
   - **Response:** Should have chat object

**If status is red (failed):**
- Click on request
- Check "Response" tab for error message
- Check "Headers" tab for status code

### 11. Backend Console Logs

**When you create a chat, backend should log:**
```
POST /api/chat 201 - - ms
```

**If you see:**
```
POST /api/chat 401 - - ms
```
→ Authentication failed

```
POST /api/chat 500 - - ms
```
→ Server error (check MongoDB)

### 12. Quick Fixes

**Reset everything:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install
npm start

# Frontend (in new terminal)
cd Frontend
rm -rf node_modules
npm install
npm run dev
```

**Clear browser data:**
1. F12 → Application tab
2. Clear Storage → Clear site data
3. Refresh page
4. Login again

**Restart MongoDB:**
```bash
# Windows
net stop MongoDB
net start MongoDB

# Mac
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

## Still Not Working?

### Collect Debug Info

1. **Backend console output** (copy all text)
2. **Browser console errors** (F12 → Console tab)
3. **Network request details** (F12 → Network tab)
4. **Environment:**
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: Windows/Mac/Linux

### Check These Files

1. `backend/.env` - All variables set?
2. `backend/src/app.js` - CORS configured?
3. `Frontend/src/config/api.js` - Correct API_URL?
4. `backend/package.json` - All dependencies installed?

### Last Resort

**Complete reset:**
```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm start

# Frontend (new terminal)
cd Frontend  
rm -rf node_modules package-lock.json
npm install
npm run dev

# Browser
# Clear all site data
# Login again
# Try creating chat
```

## Success Checklist

When everything works, you should see:

✅ Backend running on port 3000
✅ Frontend running on port 5173
✅ MongoDB connected
✅ User logged in (avatar in header)
✅ Console shows "Chat created successfully"
✅ Chat appears in sidebar
✅ Composer appears at bottom
✅ Can send messages

## Prevention

- Always start backend before frontend
- Keep backend terminal open
- Don't close MongoDB
- Check console regularly
- Keep .env file updated
