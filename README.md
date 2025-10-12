# Greenhouse Monitoring and Climate Control System

A comprehensive web application for precision agriculture, enabling real-time monitoring and control of greenhouse environmental conditions.

## Features

### 1. Dashboard Overview
- Multi-zone display with real-time status indicators
- Key performance metrics and statistics
- Quick actions for system control
- Recent alerts and notifications
- Crop type identification for each zone
- Quick access to climate simulation from zone cards

### 2. Zone Detail Pages
- Circular environmental gauges for temperature, humidity, heating, and light
- Interactive control cards with toggles and sliders
- AI-optimized climate strategy display
- Real-time analytics with time-series charts
- Individual control systems for:
  - Ventilation
  - Air Circulation
  - Irrigation
  - Heating
  - Lighting
  - Curtain System
  - CO₂ Dosing

### 3. Weather Monitoring
- Current weather conditions display
- Custom weather scenario selection
- Historical weather data visualization
- Multi-metric time-series charts

### 4. Analytics Dashboard
- Comparative zone analysis
- Performance metrics and trends
- Key insights and efficiency tracking
- Zone performance summaries

### 5. Manual Override & Simulation
- Simulation control panel with preset scenarios
- Parameter editor for manual adjustments
- Real-time system status monitoring
- Safety warnings and override controls

### 6. Climate Simulation Workflow (NEW)
A complete simulation system that mimics real-world greenhouse operations:

#### Workflow Steps:
1. **Normal Operation** - House sensors read normally
2. **Select Greenhouse** - Choose a zone from the dashboard
3. **Select Simulation** - Click "Climate Simulation" button
4. **Choose Scenario** - Select from predefined climate scenarios:
   - **Heatwave**: Extreme high temperature (38°C) with low humidity (35%)
   - **Drought**: Very low soil moisture (15%) with high temperature (32°C)
   - **Dry Soil**: Low soil moisture (20%) requiring irrigation
   - **Cold Snap**: Sudden temperature drop (12°C) requiring heating
   - **High Humidity**: Excessive moisture (90%) in the air
   - **Low Light**: Insufficient light (50 μmol) for photosynthesis
   - **CO₂ Deficiency**: Low CO₂ levels (300 ppm) affecting growth
5. **View Scenario Details** - See expected conditions and actuator responses
6. **Initiate Simulation** - Start the 10-second simulation
7. **Real-time Monitoring**:
   - Simulation details sent to Firebase (ready for ESP32 consumption)
   - Notifications sent and received on app
   - Actuators respond to simulated conditions:
     - Vent fans activate if heat is too high
     - Irrigation begins if heat is high AND soil moisture is very low
     - Heating activates if temperature drops
     - Misting system for humidity control
     - Lighting adjusts for optimal photosynthesis
     - CO₂ dosing for growth optimization
8. **Countdown Timer** - 10-second timer displayed on app
9. **Return to Normal** - Normal readings and control system continue

#### Smart Actuator Logic:
The system intelligently determines actuator responses based on multiple conditions:
- **Temperature + Soil Moisture**: If temp > 5°C above optimal AND soil moisture < 30%, both ventilation and irrigation activate
- **Humidity Control**: Ventilation for dehumidification, misting for humidification
- **Light Management**: Artificial lighting and curtain control
- **CO₂ Optimization**: Dosing system activates when levels drop below optimal

#### Firebase Integration (Ready):
All simulation data is structured for Firebase real-time database:
\`\`\`typescript
{
  zoneId: string
  scenarioId: string
  timestamp: number
  duration: 10 // seconds
  conditions: { temperature, humidity, co2, light, soilMoisture }
  actuators: [{ name, action, intensity, activateAt }]
}
\`\`\`

### 7. Efficiency Simulation
- **Crop-specific optimal conditions** for pepper, tomato, cucumber, and lettuce
- **Interactive climate control** - manually set temperature, humidity, CO₂, and light levels
- **Control system response analysis** - see which systems activate and their intensity
- **Recovery time estimation** - calculate time to return to optimal conditions
- **Efficiency scoring** - 0-100% score based on deviation from optimal conditions
- **Real-time feedback** - instant visualization of control system actions and impacts

#### How to Use Efficiency Simulation
1. Navigate to any zone detail page (e.g., Greenhouse 1 - Pepper cultivation)
2. Click the "Efficiency Test" button in the zone header
3. Adjust climate parameters using the sliders to simulate different conditions
4. Click "Run Efficiency Simulation" to see:
   - Overall efficiency score
   - Estimated recovery time
   - Required control system actions
   - Impact of each system adjustment

This feature is particularly useful for:
- Testing control system responsiveness
- Training operators on optimal recovery procedures
- Validating climate control strategies
- Planning for extreme weather scenarios

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Radix UI
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React

## Mock Data

The application currently uses mock data for demonstration purposes. All data structures are defined in `lib/types.ts` and mock data generators are in `lib/mock-data.ts`.

### Data Structure

- **GreenhouseZone**: Complete zone configuration with environmental parameters, control systems, and soil moisture
- **WeatherData**: External weather conditions
- **TimeSeriesData**: Historical data points for charts
- **ControlSystem**: Individual system configurations
- **SimulationMode**: Simulation state and scenarios
- **SimulationScenario**: Predefined climate scenarios with expected actuator responses
- **SimulationRun**: Complete simulation execution data with actuator responses and notifications
- **ActuatorResponse**: Individual actuator activation details
- **SimulationNotification**: Real-time notifications during simulation
- **CropOptimalConditions**: Optimal environmental ranges for different crop types
- **EfficiencySimulation**: Simulation results with control system responses

### Crop Types by Zone
- **Greenhouse 1**: Pepper
- **Greenhouse 2**: Tomato
- **Greenhouse 3**: Cucumber
- **Greenhouse 4**: Lettuce
- **Greenhouse 5**: Pepper

## Future Integration

The mock data is designed to be easily replaced with Firebase real-time data:

1. Replace mock data imports with Firebase queries
2. Update the data fetching logic in components
3. Implement real-time listeners for live updates
4. Add authentication and user management
5. Store simulation results and efficiency metrics in Firebase
6. Connect ESP32 devices to consume simulation data
7. Implement real sensor data streaming
8. Add historical simulation logs and analytics

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

\`\`\`
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Dashboard overview
│   ├── zone/[id]/         # Zone detail pages
│   │   ├── page.tsx       # Zone details
│   │   ├── efficiency/    # Efficiency simulation
│   │   └── simulate/      # Climate simulation workflow
│   ├── weather/           # Weather monitoring
│   ├── analytics/         # Analytics dashboard
│   └── manual/            # Manual override & simulation
├── components/
│   ├── layout/            # Sidebar, header
│   ├── dashboard/         # Dashboard components
│   ├── zone/              # Zone detail components
│   ├── weather/           # Weather components
│   ├── charts/            # Chart components
│   └── simulation/        # Simulation controls
│       ├── scenario-selector.tsx    # Climate scenario selection
│       ├── simulation-runner.tsx    # 10-second simulation with timer
│       ├── efficiency-simulator.tsx # Efficiency testing
│       └── parameter-editor.tsx     # Manual parameter adjustment
├── lib/
│   ├── types.ts           # TypeScript type definitions
│   ├── mock-data.ts       # Mock data generators
│   ├── simulation-store.ts # Zustand state management
│   ├── simulation-scenarios.ts # Predefined climate scenarios
│   ├── simulation-runner.ts # Simulation execution logic
│   ├── crop-conditions.ts # Optimal conditions for crops
│   ├── efficiency-calculator.ts # Efficiency simulation logic
│   └── utils.ts           # Utility functions
└── public/                # Static assets
\`\`\`

## Design System

The application uses a professional dark theme optimized for agricultural monitoring:

- **Primary Color**: Emerald green (#10b981) - represents growth and agriculture
- **Accent Color**: Sky blue (#0ea5e9) - for data visualization
- **Warning Color**: Amber (#f59e0b) - for alerts and warnings
- **Background**: Deep black (#0a0a0a) - reduces eye strain
- **Cards**: Dark gray (#141414) - for content separation

## Responsive Design

The application is fully responsive and works seamlessly across all device sizes:
- **Mobile**: Collapsible sidebar, stacked layouts, touch-optimized controls
- **Tablet**: Adaptive grid layouts, optimized spacing
- **Desktop**: Full multi-column layouts, enhanced data visualization

## SDLC Approach

This project follows standard Software Development Life Cycle concepts:

1. **Requirements Analysis**: Based on reference images and precision agriculture needs
2. **Design**: Professional dashboard aesthetic with data visualization
3. **Implementation**: Modular component architecture with TypeScript
4. **Testing**: Ready for integration testing with real data
5. **Deployment**: Production-ready Next.js application

## License

MIT
