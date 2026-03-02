# Quick Start Guide - Flood Alert System

## ✅ What's Already Done

- ✅ Backend code created (Node.js + Express)
- ✅ Frontend code created (React + TailwindCSS)
- ✅ Arduino firmware ready
- ✅ All npm dependencies installed
- ✅ Frontend running successfully on http://localhost:5174

## ⚠️ MongoDB Setup Required

The backend server needs MongoDB to run. Here's how to set it up:

### Option 1: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download the Windows installer
   - Run the installer

2. **During Installation:**
   - Choose "Complete" installation
   - Select "Run service as Network Service user"
   - Check "Install MongoDB as a Service"
   - Keep default data and log directories

3. **Verify Installation:**
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service:**
   ```powershell
   net start MongoDB
   ```

### Option 2: Use MongoDB Atlas (Cloud - Free Tier)

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster:**
   - Choose "Free" tier (M0)
   - Select your region
   - Create cluster

3. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Update `backend/.env`:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flood_alert_system
     ```

## 🚀 Starting the System

### After MongoDB is Running:

1. **Start Backend:**
   ```powershell
   cd "C:\Users\hp\Desktop\flood alert system\backend"
   npm run dev
   ```

2. **Frontend is Already Running:**
   - URL: http://localhost:5174
   - Login with: `admin@flood.com` / `admin123`

## 📝 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | ✅ Running | Port 5174 |
| Backend | ⏸️ Waiting | Needs MongoDB |
| MongoDB | ❌ Not Running | Install required |
| Arduino | ⏸️ Ready | Upload firmware when backend is ready |

## 🔧 Hardware Setup (After Backend is Running)

1. **Upload Arduino Code:**
   - Open `hardware/arduino_flood_sensor/arduino_flood_sensor.ino`
   - Update `SENSOR_HEIGHT` constant
   - Upload to Arduino board

2. **Connect Sensors:**
   - HC-SR04: TRIG→Pin9, ECHO→Pin10
   - See HARDWARE_SETUP.md for details

3. **Configure COM Ports:**
   - Check Device Manager for Arduino COM port
   - Update `ARDUINO_PORT` in `backend/.env`
   - Restart backend

## 🎯 Next Immediate Step

**Install MongoDB** using one of the options above, then restart the backend server.

## 📚 Documentation

- [README.md](file:///c:/Users/hp/Desktop/flood%20alert%20system/README.md) - Full documentation
- [HARDWARE_SETUP.md](file:///c:/Users/hp/Desktop/flood%20alert%20system/HARDWARE_SETUP.md) - Hardware guide
- [Walkthrough](file:///C:/Users/hp/.gemini/antigravity/brain/22bd03dd-4723-407f-bd21-d1b144ff1dc1/walkthrough.md) - Implementation details

## 💡 Quick Tips

- **Frontend works without backend** - You can see the UI but won't have data
- **Backend needs MongoDB** - This is the only missing piece
- **Arduino is optional for testing** - You can test the web app first
- **Demo accounts work** - Login to see the interface

---

**Once MongoDB is installed, the complete system will be operational!** 🌊
