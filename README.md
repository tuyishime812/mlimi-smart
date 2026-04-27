# MLIMI Smart - AI Farming Assistant

Smart, sustainable farming assistant for Malawi and beyond. Get expert advice on crops, pest control, weather and markets in multiple languages.

## Features

- 🤖 **AI Chat Assistant** - Get farming advice in local languages
- 🔬 **Disease Detection** - Upload plant photos for instant disease diagnosis
- 🌤️ **Weather Integration** - Real-time weather data for your location
- 📱 **PWA Support** - Install as a mobile app, works offline
- 💻 **Desktop App** - Electron builds for Windows, Mac, and Linux

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (for backend API)
- Backend server running on `localhost:8000`

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Backend Setup

The frontend expects a backend API running on `http://localhost:8000` with these endpoints:

- `POST /chat` - AI chat responses
- `POST /predict` - Disease detection from images
- `POST /predict/async` - Async disease prediction
- `GET /predict/status/:jobId` - Check prediction status
- `GET /weather` - Weather data

## Building for Production

```bash
# Build for web
npm run build

# Build Electron desktop app
npm run electron:build

# Windows specific
npm run electron:build:win
```

## PWA Installation

The app includes a PWA install prompt. On supported browsers (Chrome, Edge), click "Install" when prompted. On iOS Safari, use Share → "Add to Home Screen".

## License

MIT
