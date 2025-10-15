# 🚀 Quick Start Guide - Greenhouse Simulation

Get your greenhouse simulation up and running in 15 minutes!

## ⚡ Quick Setup (Web App Only)

If you just want to test the web interface without hardware:

### 1. Install Dependencies

\`\`\`bash
npm install firebase
\`\`\`

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "greenhouse-sim"
3. Enable Realtime Database (test mode)
4. Copy your config from Project Settings

### 3. Configure Environment

\`\`\`bash
# Create .env.local file
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 4. Initialize Database

Copy this to Firebase Console → Realtime Database → Data:

\`\`\`json
{
  "greenhouses": {
    "zone1": {
      "sensors": {
        "temperature": 25,
        "humidity": 65,
        "soilMoisture": 50,
        "gasLevel": 400,
        "lastUpdate": 1759705570158
      },
      "simulation": {
        "active": false,
        "type": "none",
        "startTime": 0,
        "duration": 10000,
        "status": "idle"
      },
      "actuators": {
        "fan": false,
        "pump": false,
        "heater": false,
        "misting": false,
        "lighting": false,
        "co2dosing": false
      },
      "logs": {
        "simulationLogs": []
      }
    }
  }
}
\`\`\`

### 5. Add Required Files

Copy these files from the artifacts:

- `lib/firebase-config.ts`
- `lib/simulation-scenarios.ts`
- `lib/notification-service.ts`
- `components/simulation/scenario-selector.tsx`
- `components/simulation/simulation-runner.tsx`
- `components/notifications/notification-panel.tsx`
- `app/zone/[id]/simulate/page.tsx`

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

### 7. Test Simulation

\`\`\`
Navigate to: http://localhost:3000/zone/zone1/simulate
\`\`\`

## 🔥 Full Setup (Web App + ESP32)

### Hardware Required

- ESP32 DevKit (any variant)
- DHT22 sensor
- Soil moisture sensor
- MQ-135 gas sensor
- 6x Relay modules (5V)
- Jumper wires
- Breadboard
- Power supply (5V/2A minimum)

### Wiring Diagram

\`\`\`
ESP32 Pinout:
┌─────────────────────────────────────┐
│                                     │
│  [GPIO 4]  ────► DHT22 Data         │
│  [GPIO 34] ────► Soil Moisture      │
│  [GPIO 35] ────► Gas Sensor         │
│                                     │
│  [GPIO 25] ────► Fan Relay          │
│  [GPIO 26] ────► Pump Relay         │
│  [GPIO 27] ────► Heater Relay       │
│  [GPIO 14] ────► Misting Relay      │
│  [GPIO 12] ────► Lighting Relay     │
│  [GPIO 13] ────► CO2 Dosing Relay   │
│                                     │
│  [3.3V]    ────► Sensor VCC         │
│  [GND]     ────► Sensor/Relay GND   │
│                                     │
└─────────────────────────────────────┘

Sensor Connections:
DHT22:       VCC → 3.3V, DATA → GPIO4, GND → GND
Soil:        VCC → 3.3V, SIG → GPIO34, GND → GND
Gas(MQ135):  VCC → 5V, A0 → GPIO35, GND → GND

Relay Module: Each relay IN connected to respective GPIO
\`\`\`

### Flash ESP32 Firmware

#### Option A: Using PlatformIO (Recommended)

\`\`\`bash
# Install PlatformIO
pip install platformio

# Create project
mkdir greenhouse-firmware
cd greenhouse-firmware
pio init --board esp32dev

# Copy files
# - platformio.ini to root
# - main.cpp to src/

# Configure WiFi & Firebase in main.cpp
# Edit these lines:
#define WIFI_SSID "Your_Network"
#define WIFI_PASSWORD "Your_Password"
#define FIREBASE_HOST "your-project.firebaseio.com"
#define FIREBASE_AUTH "your_database_secret"

# Upload
pio run --target upload

# Monitor
pio device monitor
\`\`\`

#### Option B: Using Arduino IDE

\`\`\`bash
1. Install Arduino IDE
2. Add ESP32 board manager URL:
   https://dl.espressif.com/dl/package_esp32_index.json
3. Install ESP32 boards
4. Install libraries:
   - Firebase ESP32 Client
   - DHT sensor library
   - Adafruit Unified Sensor
5. Copy main.cpp content to Arduino sketch
6. Select board: ESP32 Dev Module
7. Upload
\`\`\`

## 🎯 Testing Workflow

### Step 1: Verify ESP32 Connection

\`\`\`bash
# Open serial monitor (115200 baud)
# You should see:
Connecting to WiFi....
WiFi connected
IP address: 192.168.1.xxx
Firebase connected
System initialized successfully
--- Sensor Readings ---
Temperature: 25.3 °C
Humidity: 62.1 %
Soil Moisture: 48 %
Gas Level: 395 ppm
\`\`\`

### Step 2: Test Web Interface

1. Open browser: `http://localhost:3000`
2. Navigate to Zone 1
3. Click "Climate Simulation"
4. Should see scenario cards

### Step 3: Run Your First Simulation

1. Select "Heatwave" scenario
2. Review details:
   - Temperature: 38°C
   - Humidity: 35%
   - Expected: Fan + Misting ON
3. Click "Start Simulation"
4. Watch 10-second countdown
5. Check serial monitor for actuator activation

### Step 4: Verify Database Updates

1. Open Firebase Console
2. Navigate to Realtime Database
3. Expand `greenhouses/zone1`
4. Watch real-time updates:
   - `simulation/active` → true
   - `actuators/fan` → true
   - `sensors` updating every 3 seconds

## 🐛 Common Issues & Fixes

### ESP32 Won't Connect to WiFi

\`\`\`cpp
// Try different WiFi settings
WiFi.mode(WIFI_STA);
WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

// Add timeout
int attempts = 0;
while (WiFi.status() != WL_CONNECTED && attempts < 20) {
  delay(500);
  Serial.print(".");
  attempts++;
}
\`\`\`

### Firebase Authentication Fails

\`\`\`
Error: "Permission Denied"
Solution: Update Firebase Rules to allow read/write:
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
\`\`\`

### Sensors Reading Zero/NaN

\`\`\`
1. Check wiring connections
2. Verify power supply (3.3V for DHT22)
3. Test sensor individually:
   float temp = dht.readTemperature();
   Serial.println(temp);
4. Try different GPIO pins if needed
\`\`\`

### Actuators Not Responding

\`\`\`
1. Check relay trigger level (some need LOW to activate)
2. Test with simple code:
   digitalWrite(FAN_PIN, HIGH);
   delay(2000);
   digitalWrite(FAN_PIN, LOW);
3. Verify relay power supply (usually 5V)
4. Check relay module LED indicators
\`\`\`

### Web App Can't Start Simulation

\`\`\`
1. Check browser console for errors
2. Verify Firebase config in .env.local
3. Check database structure matches schema
4. Try clearing browser cache
5. Check Network tab for failed requests
\`\`\`

## 📊 Verify Everything Works

### Checklist

- [ ] ESP32 connects to WiFi
- [ ] Firebase connection successful
- [ ] Sensors reading real values
- [ ] Web app loads without errors
- [ ] Can navigate to simulation page
- [ ] Scenarios display correctly
- [ ] Can start simulation
- [ ] Countdown timer works
- [ ] Actuators activate (check serial)
- [ ] Database updates in real-time
- [ ] Notifications appear
- [ ] Simulation completes after 10s
- [ ] System returns to normal

### Expected Serial Output During Simulation

\`\`\`
--- Sensor Readings ---
Temperature: 25.3 °C
Humidity: 62.1 %
Soil Moisture: 48 %
Gas Level: 395 ppm
Sensors updated to Firebase

Simulation active: heatwave
--- Active Actuators ---
Fan: ON
Misting: ON
Simulation time remaining: 8 seconds
Simulation time remaining: 6 seconds
Simulation time remaining: 4 seconds
Simulation time remaining: 2 seconds
Simulation completed

--- Sensor Readings ---
Temperature: 25.4 °C
Humidity: 61.8 %
Soil Moisture: 48 %
Gas Level: 398 ppm
\`\`\`

## 🎉 Next Steps

Once everything works:

1. **Add More Zones**

   \`\`\`json
   "greenhouses": {
     "zone1": { ... },
     "zone2": { ... },
     "zone3": { ... }
   }
   \`\`\`

2. **Customize Scenarios**
   Edit `lib/simulation-scenarios.ts` to add your own

3. **Add Authentication**

   \`\`\`bash
   npm install firebase-auth
   \`\`\`

4. **Deploy to Production**

   \`\`\`bash
   npm run build
   vercel deploy
   \`\`\`

5. **Mobile App**
   Consider React Native or Flutter for mobile access

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [ESP32 Reference](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Next.js Docs](https://nextjs.org/docs)
- [PlatformIO Docs](https://docs.platformio.org/)

## 💡 Tips

1. **Save Credentials Securely**: Never commit `.env.local` to Git
2. **Test Incrementally**: Get one part working before moving to next
3. **Use Serial Monitor**: Best debugging tool for ESP32
4. **Check Firebase Usage**: Monitor database reads/writes in console
5. **Update Regularly**: Keep firmware and web app dependencies updated

## 🆘 Need Help?

1. Check serial monitor output
2. Review Firebase Console logs
3. Check browser DevTools console
4. Verify all connections and wiring
5. Create GitHub issue with details

## ✅ Success!

If you see the countdown timer and actuators responding, congratulations! Your greenhouse simulation system is working. You can now:

- Test different climate scenarios
- Monitor real-time responses
- Review simulation logs
- Expand with more zones
- Customize for your specific needs

Happy simulating! 🌱
