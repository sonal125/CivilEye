# CivilEye - Setup and Run Instructions

This document provides step-by-step instructions to set up and run the CivilEye frontend application.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software:

1. **Node.js** (v16.0.0 or higher)
   - Download from: https://nodejs.org/
   - Check version: `node --version`
   - Includes npm (Node Package Manager)

2. **A Modern Web Browser**
   - Google Chrome (recommended)
   - Firefox
   - Safari
   - Edge

3. **Code Editor** (optional but recommended)
   - VS Code: https://code.visualstudio.com/
   - Sublime Text
   - Atom

### System Requirements:
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB
- **Disk Space**: 500MB free space

---

## 🚀 Installation Steps

### Step 1: Extract/Clone the Project

If you received this as a ZIP file:
```bash
# Extract the ZIP file to your desired location
# Navigate to the extracted folder
cd <project-folder>
```

If using Git:
```bash
git clone <repository-url>
cd <project-folder>
```

### Step 2: Install Dependencies

Open terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React and React DOM
- React Router DOM
- Vite
- Other dependencies

**Expected time**: 1-3 minutes depending on internet speed

**What happens:**
- Downloads all packages from npm registry
- Creates `node_modules/` folder
- Generates `package-lock.json`

---

## ▶️ Running the Application

### Development Mode (Recommended for Development)

Start the development server:

```bash
npm run dev
```

**What happens:**
- Vite starts a local development server
- Application opens automatically at `http://localhost:3000`
- Hot Module Replacement (HMR) enabled - changes reflect instantly
- Developer tools available

**Console Output:**
```
  VITE v5.0.8  ready in 543 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**To stop the server:**
- Press `Ctrl + C` in the terminal

### Production Build

Build the application for production:

```bash
npm run build
```

**What happens:**
- Creates optimized production build
- Generates `dist/` folder with compiled files
- Minifies JavaScript and CSS
- Optimizes images and assets

**Preview production build:**
```bash
npm run preview
```

---

## 🌐 Accessing the Application

Once the dev server is running:

1. **Automatic**: Browser should open automatically
2. **Manual**: Open browser and go to `http://localhost:3000`

### Application Pages:

| Page | URL | Description |
|------|-----|-------------|
| Home | `http://localhost:3000/` | Public feed of all issues |
| Login | `http://localhost:3000/login` | User login |
| Register | `http://localhost:3000/register` | New user registration |
| Submit Issue | `http://localhost:3000/submit` | Report new issue (requires login) |
| Issue Details | `http://localhost:3000/complaints/:id` | View specific issue |
| Profile | `http://localhost:3000/profile` | User profile (requires login) |
| Admin Dashboard | `http://localhost:3000/admin` | Admin panel (admin only) |

---

## 👤 Demo Accounts

These credentials are for testing/demonstration only. CivilEye uses frontend-only mock authentication.

Important: Select the correct role on the Login screen (Citizen vs Municipal Authority) before signing in.

### Citizen Accounts
```
Email: citizen@civileye.com
Password: password123
Role: Citizen

Visible name: John Doe
```

```
Email: sonalcitizen@civic.com
Password: Sonal123
Role: Citizen
Visible name: Sonal Sher (Thikedar)
```

```
Email: ankitcitizen@civic.com
Password: Raj123
Role: Citizen
Visible name: Ankit (Majdoor)
```
**Can do:**
- Report issues
- View public feed
- Upvote and comment
- View profile

### Admin Accounts
```
Email: admin@civileye.com
Password: admin123
Role: Admin

Visible name: Admin User
```

```
Email: sonaladmin@civic.com
Password: Sonal123
Role: Admin
Visible name: Sonal Sher (Thikedar)
```

```
Email: ankitadmin@civic.com
Password: Raj123
Role: Admin
Visible name: Ankit (Majdoor)
```
**Can do:**
- Everything citizens can do
- Access admin dashboard
- Assign issues to departments
- Update issue status
- View analytics

### Test Account:
```
Email: user@test.com
Password: test123
Role: Citizen
```

---

## 🧪 Testing Features

### Test Citizen Features:

1. **Login**
   - Go to `/login`
   - Use citizen credentials
   - Should redirect to home page

2. **View Public Feed**
   - Browse all reported issues
   - Use filters (status, type, priority)
   - Try different sorting options

3. **Report New Issue**
   - Click "Report New Issue" or go to `/submit`
   - Upload an image (or take photo if on mobile)
   - Select issue type
   - Add title and description
   - Allow location access when prompted
   - Submit

4. **View Issue Details**
   - Click on any issue card
   - View full details, image, location
   - Upvote the issue
   - Add a comment

5. **Check Profile**
   - Click on "Profile" in navbar
   - View your information

### Test Admin Features:

1. **Login as Admin**
   - Logout if logged in as citizen
   - Login with admin credentials
   - Should see "Admin Dashboard" link

2. **View Admin Dashboard**
   - Click "Admin Dashboard"
   - View statistics (total, pending, in-progress, resolved)
   - See all complaints in table format

3. **Manage Issues**
   - **Assign Issue**: Select department from dropdown for pending issues
   - **Start Work**: Click "Start Work" for assigned issues
   - **Mark Resolved**: Click "Mark Resolved" for in-progress issues

4. **Filter Issues**
   - Use status filter dropdown
   - See filtered results

---

## 📂 Project Structure

```
CivilEye/
├── node_modules/          # Dependencies (auto-generated)
├── public/                # Static assets
│   └── favicon.svg
├── src/                   # Source code
│   ├── components/        # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.jsx            # Root component
│   └── index.jsx          # Entry point
├── index.html             # HTML template
├── package.json           # Project metadata & dependencies
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

---

## 🔧 Available Scripts

### `npm run dev`
Starts development server at `http://localhost:3000`

### `npm run build`
Creates production build in `dist/` folder

### `npm run preview`
Preview production build locally

### `npm run lint`
Run ESLint to check code quality

---

## ⚠️ Common Issues & Solutions

### Issue 1: Port 3000 Already in Use

**Error:**
```
Port 3000 is in use, trying another one...
```

**Solution:**
- Vite will automatically use port 3001 or next available port
- OR manually specify port in `vite.config.js`
- OR stop the process using port 3000

### Issue 2: npm install Fails

**Error:**
```
npm ERR! code ENOENT
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### Issue 3: Module Not Found

**Error:**
```
Module not found: Can't resolve 'react'
```

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 4: Location Not Working

**Problem:** GPS location not detected

**Solution:**
- Ensure browser has location permission
- On Chrome: Click padlock icon → Site settings → Allow location
- On Firefox: Click shield icon → Permissions → Allow location
- If on HTTP (not HTTPS), location API may not work in some browsers

### Issue 5: Images Not Uploading

**Problem:** Image upload fails or no preview

**Solution:**
- Check file size (must be < 5MB)
- Use supported formats: JPG, PNG, GIF, WebP
- Check browser console for errors (F12)

### Issue 6: Login Not Working

**Problem:** Can't login with demo credentials

**Solution:**
- Clear browser cache and localStorage
- Make sure you're using exact credentials (case-sensitive)
- Check console for errors
- Try different demo account

---

## 🌐 Browser Compatibility

### Fully Supported:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Features by Browser:

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Camera Capture | ✅ | ✅ | ✅ | ✅ |
| Geolocation | ✅ | ✅ | ✅ | ✅ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| File Upload | ✅ | ✅ | ✅ | ✅ |

---

## 📱 Mobile Testing

### On Physical Device:

1. **Find Your Local IP:**
   ```bash
   # On Windows
   ipconfig
   
   # On Mac/Linux
   ifconfig
   ```

2. **Start Dev Server with Host:**
   ```bash
   npm run dev -- --host
   ```

3. **Access from Mobile:**
   - Connect mobile to same WiFi network
   - Open `http://YOUR_IP:3000` on mobile browser
   - Example: `http://192.168.1.100:3000`

### On Browser DevTools:

1. **Chrome DevTools:**
   - Press F12
   - Click device toolbar icon (Ctrl+Shift+M)
   - Select device (iPhone, Pixel, etc.)
   - Test responsive layout

---

## 🔒 Data Persistence

### Current Implementation:
- Data stored in **browser localStorage**
- Persists across page refreshes
- Specific to each browser/device
- Can be cleared via browser settings

### Clear All Data:
```javascript
// Open browser console (F12) and run:
localStorage.clear()
// Refresh page
```

### Reset to Default Data:
```javascript
// Open console and run:
localStorage.removeItem('civileye_complaints')
localStorage.removeItem('civileye_comments')
// Refresh page to load default mock data
```

---

## 📊 Performance

### Expected Performance:
- **Initial Load**: < 2 seconds
- **Page Navigation**: Instant
- **Form Submission**: < 1 second
- **Data Loading**: < 500ms

### Optimization Tips:
- Use production build for deployment
- Enable browser caching
- Compress images before upload
- Use modern browser

---

## 🔄 Updating the Application

If you receive updates:

```bash
# Pull latest changes (if using Git)
git pull

# Reinstall dependencies (if package.json changed)
npm install

# Restart dev server
npm run dev
```

---

## 📞 Support & Troubleshooting

### Getting Help:

1. **Check Console Errors:**
   - Press F12 in browser
   - Look at Console tab for errors

2. **Check Network Tab:**
   - F12 → Network tab
   - See failed requests

3. **Common Fixes:**
   - Restart dev server
   - Clear browser cache
   - Clear localStorage
   - Reinstall node_modules

---

## ✅ Quick Start Checklist

- [ ] Node.js installed (v16+)
- [ ] Project files extracted/cloned
- [ ] Terminal opened in project directory
- [ ] `npm install` completed successfully
- [ ] `npm run dev` running
- [ ] Browser opened at `http://localhost:3000`
- [ ] Tested login with demo accounts
- [ ] Location permission granted
- [ ] Submitted test issue successfully

---

## 🎉 You're All Set!

CivilEye should now be running successfully on your local machine.

**Next Steps:**
1. Explore the application
2. Test all features
3. Read `FRONTEND_ARCHITECTURE.md` to understand the codebase
4. Start customizing for your needs

---

**Happy Civic Engagement! 🏛️**
