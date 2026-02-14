# 🍽️ Canteen Management System — MongoDB Setup Guide
### Complete Step-by-Step (From Scratch)

---

## 📦 What Changed from Original
| Original (MySQL) | New (MongoDB) |
|---|---|
| `mysql2` package | `mongoose` package |
| `db.js` → mysql connection | `db.js` → mongoose connection |
| Raw SQL queries | Mongoose model methods |
| `admin_login_credentials` table | `admins` collection (MongoDB) |
| `users` table | `users` collection |
| `caterers` table | `caterers` collection |
| `food_items` table | `fooditems` collection |
| No seed data script | `seed.js` to create admin |

---

## 🛠️ STEP 1 — Install Node.js

1. Go to: **https://nodejs.org**
2. Download the **LTS version** (e.g., 20.x or 22.x)
3. Install it (keep all defaults → click Next → Finish)
4. Verify installation — open **Command Prompt** and type:
   ```
   node -v
   npm -v
   ```
   You should see version numbers like `v20.x.x` and `10.x.x`

---

## 🍃 STEP 2 — Install MongoDB Community Server

1. Go to: **https://www.mongodb.com/try/download/community**
2. Select:
   - Version: **7.0 (current)**
   - Platform: **Windows**
   - Package: **MSI**
3. Click **Download**
4. Run the installer:
   - Choose **Complete** installation
   - ✅ Check **"Install MongoDB as a Service"** (very important!)
   - ✅ Check **"Install MongoDB Compass"** (this is the visual database tool)
5. Click **Install** → **Finish**

MongoDB will now run automatically in the background on your PC.

---

## 🧭 STEP 3 — Install MongoDB Compass & Connect

MongoDB Compass was installed in Step 2. If not:
1. Go to: **https://www.mongodb.com/try/download/compass**
2. Download and install it.

### Connect Compass to Your Database:
1. Open **MongoDB Compass**
2. You'll see a connection screen
3. In the **URI field**, type:
   ```
   mongodb://localhost:27017
   ```
4. Click **Connect**
5. You'll see your local MongoDB server — this is where your data will live!

---

## 📁 STEP 4 — Get the Project Files

Place the project folder somewhere easy, like:
```
C:\Projects\Canteen-management-main\
```

Your folder structure should look like:
```
Canteen-management-main/
├── backend/
│   ├── controllers/
│   │   ├── Admin/
│   │   │   ├── login.js
│   │   │   ├── caterer.js
│   │   │   └── addFoodItems.js
│   │   └── User/
│   │       ├── login.js
│   │       ├── signUp.js
│   │       └── homePage.js
│   ├── models/           ← NEW (MongoDB models)
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Caterer.js
│   │   └── FoodItem.js
│   ├── routes/
│   ├── uploads/
│   ├── public/
│   ├── db.js             ← CHANGED (MongoDB connection)
│   ├── server.js         ← CHANGED
│   ├── package.json      ← CHANGED (mongoose instead of mysql2)
│   └── seed.js           ← NEW (creates admin account)
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ STEP 5 — Set Your MongoDB Connection String

Open the file: `backend/db.js`

You'll see this line:
```js
const MONGO_URI = "mongodb://localhost:27017/sac_snacks_wallet";
```

### For Local MongoDB (default — use this if you installed MongoDB on your PC):
```js
const MONGO_URI = "mongodb://localhost:27017/sac_snacks_wallet";
```
✅ This is the **MongoDB Compass string**. You're done — no changes needed!

### For MongoDB Atlas (Cloud — optional):
1. Go to **https://cloud.mongodb.com**
2. Create a free cluster
3. Click **Connect → Drivers**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://yourUsername:yourPassword@cluster0.abc12.mongodb.net/sac_snacks_wallet
   ```
5. Paste it into `db.js`:
   ```js
   const MONGO_URI = "mongodb+srv://yourUsername:yourPassword@cluster0.abc12.mongodb.net/sac_snacks_wallet";
   ```

---

## 📥 STEP 6 — Install Backend Dependencies

Open **Command Prompt** or **VS Code Terminal**.

Navigate to the backend folder:
```bash
cd C:\Projects\Canteen-management-main\backend
```

Install all packages:
```bash
npm install
```

This installs: express, mongoose, cors, multer, jsonwebtoken, bcryptjs, nodemon

---

## 🌱 STEP 7 — Seed the Admin Account (Run Once!)

Since we removed MySQL, we need to add the admin login to MongoDB manually.

In the same terminal (inside `backend/` folder), run:
```bash
node seed.js
```

You should see:
```
✅ Connected to MongoDB
✅ Admin created successfully!
   AdminId:       sac2025
   AdminPassword: admin123
```

> ⚠️ Only run this **ONCE**. If you run it again, it will say "Admin already exists" — that's fine!

### Verify in Compass:
1. Open MongoDB Compass
2. You'll now see a database called **sac_snacks_wallet**
3. Click it → click **admins** collection
4. You'll see the admin document!

---

## 🚀 STEP 8 — Start the Backend Server

In the terminal (inside `backend/` folder):
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server listening on port 3000
```

Your backend API is now running at: **http://localhost:3000**

---

## 🎨 STEP 9 — Install & Start the Frontend

Open a **NEW terminal window/tab** (keep backend running!).

Navigate to the frontend folder:
```bash
cd C:\Projects\Canteen-management-main\frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend:
```bash
npm run dev
```

You should see something like:
```
  VITE v5.x  ready in 500ms
  ➜  Local:   http://localhost:5173/
```

Open your browser and go to: **http://localhost:5173**

---

## 🔐 STEP 10 — Log In

### Admin Login:
- **Admin ID:** `sac2025`
- **Password:** `admin123`

### User Login:
- First, sign up a new user through the signup page
- Then log in with the roll number / staff ID you used

---

## 🗄️ STEP 11 — Explore Your Data in MongoDB Compass

After using the app:
1. Open **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`
3. Click on **sac_snacks_wallet** database
4. You'll see these collections:
   - `admins` — admin login credentials
   - `users` — registered students/staff
   - `caterers` — caterer records
   - `fooditems` — food menu items

Each row in MySQL is now a **document** (like a JSON object) in MongoDB!

---

## ❌ Common Errors & Fixes

### Error: "MongoDB connection failed: connect ECONNREFUSED"
**Fix:** MongoDB service is not running. Open **Services** (Windows search) → Find **MongoDB** → Click **Start**.

Or run in Command Prompt:
```bash
net start MongoDB
```

### Error: "Cannot find module 'mongoose'"
**Fix:** You forgot to run `npm install`. Go to the `backend/` folder and run it again.

### Error: "Port 3000 already in use"
**Fix:** Something else is using port 3000. Either stop the other process, or change port in `server.js`:
```js
const port = 3001; // Change to any free port
```

### Error: "Cannot find module './models/Admin'"
**Fix:** Make sure the `models/` folder exists inside `backend/` with all 4 files.

### Frontend shows "Network Error" / can't connect to backend
**Fix:** Make sure the backend is running (`npm run dev` in backend folder). Also check `vite.config.js` has the correct proxy:
```js
proxy: { '/api': 'http://localhost:3000' }
```

---

## 📋 Quick Reference — All Commands

```bash
# === BACKEND ===
cd backend
npm install          # Install packages (first time only)
node seed.js         # Create admin account (first time only)
npm run dev          # Start backend server

# === FRONTEND ===
cd frontend
npm install          # Install packages (first time only)
npm run dev          # Start frontend
```

**Both must be running at the same time!**

---

## 🔄 MongoDB vs MySQL — Key Differences

| MySQL | MongoDB |
|---|---|
| Tables | Collections |
| Rows | Documents |
| Columns | Fields |
| JOIN queries | Mongoose `populate()` |
| `SELECT * FROM users` | `User.find({})` |
| `INSERT INTO users ...` | `new User({...}).save()` |
| `DELETE FROM caterers WHERE id=?` | `Caterer.findOneAndDelete({caterer_id})` |

---

*Made with ❤️ — Canteen Management System (MongoDB Edition)*
