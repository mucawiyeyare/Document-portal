# Flood Alert System - IoT Project

A comprehensive real-time flood monitoring and alert system built with MERN stack, Arduino sensors, and SIM900 GSM module for SMS alerts.

![System Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌊 Features

- **Real-time Monitoring**: Live water level tracking from Arduino sensors via USB
- **SMS Alerts**: Automatic SMS notifications via SIM900 GSM module when thresholds are exceeded
- **Beautiful Dashboard**: Modern, responsive UI built with React and TailwindCSS
- **Multi-Station Support**: Monitor multiple locations simultaneously
- **Historical Data**: View water level trends with interactive charts
- **User Management**: Role-based access (Admin/Viewer) with authentication
- **Alert Management**: Track, acknowledge, and resolve flood alerts
- **WebSocket Integration**: Real-time updates without page refresh

## 🏗️ System Architecture

```
┌─────────────────┐
│  Arduino + HC-SR04  │  (Water Level Sensor)
│  Ultrasonic Sensor  │
└────────┬────────┘
         │ USB Serial
         ↓
┌─────────────────┐
│  Node.js Backend    │  (Express + Socket.io)
│  - Serial Port      │
│  - MongoDB          │
│  - REST API         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ↓         ↓
┌────────┐  ┌────────────┐
│ SIM900 │  │  React      │
│  GSM   │  │  Frontend   │
│ (SMS)  │  │ (Dashboard) │
└────────┘  └────────────┘
```

## 📋 Prerequisites

### Hardware
- Arduino Uno/Mega/Nano
- HC-SR04 Ultrasonic Sensor
- SIM900/SIM900A GSM Module
- SIM card with active plan
- USB cables and jumper wires

### Software
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Arduino IDE
- Modern web browser

## 🚀 Installation

### 1. Clone Repository

```bash
cd "C:\Users\hp\Desktop\flood alert system"
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Edit .env and configure:
# - MongoDB URI
# - Arduino COM port (e.g., COM3)
# - SMS port for SIM900 (e.g., COM4)
# - JWT secret
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Hardware Setup

1. **Upload Arduino Code:**
   - Open `hardware/arduino_flood_sensor/arduino_flood_sensor.ino` in Arduino IDE
   - Update `SENSOR_HEIGHT` with your sensor's height from ground
   - Upload to Arduino board

2. **Connect SIM900:**
   - Connect SIM900 to computer via USB-to-Serial
   - Insert SIM card with active plan
   - Note the COM port

3. **Wire Sensors:**
   - See [HARDWARE_SETUP.md](./HARDWARE_SETUP.md) for detailed wiring

### 5. Database Setup

```bash
# Start MongoDB
# Windows: MongoDB should be running as a service
# Or manually: mongod

# The application will create collections automatically
```

## 🎮 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

1. Open browser and go to `http://localhost:5173`
2. Register a new account or login
3. View real-time dashboard with sensor data

## 📱 Default Accounts

For testing purposes:

**Admin Account:**
- Email: `admin@flood.com`
- Password: `admin123`

**Viewer Account:**
- Email: `viewer@flood.com`
- Password: `viewer123`

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flood_alert_system
JWT_SECRET=your_secret_key

# Arduino Configuration
ARDUINO_PORT=COM3
ARDUINO_BAUD_RATE=9600

# SIM900 Configuration (optional)
SMS_PORT=COM4

# Thresholds
WARNING_THRESHOLD=50
CRITICAL_THRESHOLD=80
```

### Arduino (arduino_flood_sensor.ino)

```cpp
const int SENSOR_HEIGHT = 100;  // Height from ground (cm)
const long READING_INTERVAL = 30000; // 30 seconds
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Stations
- `GET /api/stations` - Get all stations
- `POST /api/stations` - Create station (admin)
- `PUT /api/stations/:id` - Update station (admin)
- `DELETE /api/stations/:id` - Delete station (admin)

### Sensors
- `GET /api/sensors` - Get sensor data
- `GET /api/sensors/latest` - Get latest readings
- `GET /api/sensors/historical` - Get historical data

### Alerts
- `GET /api/alerts` - Get all alerts
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert
- `PUT /api/alerts/:id/resolve` - Resolve alert (admin)

## 🎨 Tech Stack

### Frontend
- **React** - UI library
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **React Router** - Routing
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket
- **SerialPort** - Arduino communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Hardware
- **Arduino** - Microcontroller
- **HC-SR04** - Ultrasonic sensor
- **SIM900** - GSM module

## 📁 Project Structure

```
flood alert system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── stationController.js
│   │   ├── sensorController.js
│   │   └── alertController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Station.js
│   │   ├── SensorData.js
│   │   └── Alert.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── stations.js
│   │   ├── sensors.js
│   │   └── alerts.js
│   ├── services/
│   │   ├── arduinoService.js
│   │   ├── smsService.js
│   │   └── alertService.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── hardware/
│   └── arduino_flood_sensor/
│       └── arduino_flood_sensor.ino
├── HARDWARE_SETUP.md
└── README.md
```

## 🔍 How It Works

1. **Sensor Reading**: Arduino reads water level every 30 seconds using HC-SR04
2. **Data Transmission**: Arduino sends data to computer via USB Serial
3. **Backend Processing**: Node.js receives data, stores in MongoDB, checks thresholds
4. **Alert Triggering**: If threshold exceeded, creates alert and sends SMS via SIM900
5. **Real-time Update**: Socket.io broadcasts data to connected clients
6. **Dashboard Display**: React frontend updates in real-time without refresh

## 🛠️ Troubleshooting

### Arduino Not Connecting
- Check COM port in Device Manager
- Update `ARDUINO_PORT` in `.env`
- Close Serial Monitor before starting backend
- Install CH340 drivers if needed

### No SMS Alerts
- Verify SIM card has credit
- Check SIM900 power supply (needs 2A)
- Ensure antenna is connected
- Test with AT commands

### Backend Errors
- Verify MongoDB is running
- Check all environment variables
- Ensure ports 5000 and 5173 are available
- Check Node.js version (v16+)

### Frontend Issues
- Clear browser cache
- Check console for errors
- Verify backend is running
- Check network tab for API calls

## 📈 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Weather API integration
- [ ] Rainfall prediction
- [ ] Email notifications
- [ ] Map view with multiple stations
- [ ] Data export (CSV/PDF)
- [ ] Advanced analytics
- [ ] Cloud deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created for IoT Flood Alert System Project

## 📞 Support

For issues and questions:
- Check [HARDWARE_SETUP.md](./HARDWARE_SETUP.md) for hardware help
- Review troubleshooting section above
- Check backend logs for errors

---

**⚠️ Important Notes:**
- Always test the system before deploying in production
- Regular maintenance of sensors is required
- Keep SIM card credit topped up for SMS alerts
- Backup your database regularly
- Use waterproof enclosures for outdoor installations

**Made with ❤️ for flood safety and community protection**
