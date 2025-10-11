# Greenhouse Monitoring and Climate Control System

A comprehensive web application for precision agriculture, enabling real-time monitoring and control of greenhouse environmental conditions.

## Features

### 1. Dashboard Overview
- Multi-zone display with real-time status indicators
- Key performance metrics and statistics
- Quick actions for system control
- Recent alerts and notifications

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

- **GreenhouseZone**: Complete zone configuration with environmental parameters and control systems
- **WeatherData**: External weather conditions
- **TimeSeriesData**: Historical data points for charts
- **ControlSystem**: Individual system configurations
- **SimulationMode**: Simulation state and scenarios

## Future Integration

The mock data is designed to be easily replaced with Firebase real-time data:

1. Replace mock data imports with Firebase queries
2. Update the data fetching logic in components
3. Implement real-time listeners for live updates
4. Add authentication and user management

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
├── lib/
│   ├── types.ts           # TypeScript type definitions
│   ├── mock-data.ts       # Mock data generators
│   ├── simulation-store.ts # Zustand state management
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

## SDLC Approach

This project follows standard Software Development Life Cycle concepts:

1. **Requirements Analysis**: Based on reference images and precision agriculture needs
2. **Design**: Professional dashboard aesthetic with data visualization
3. **Implementation**: Modular component architecture with TypeScript
4. **Testing**: Ready for integration testing with real data
5. **Deployment**: Production-ready Next.js application

## License

MIT
