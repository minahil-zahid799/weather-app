# Weather App

A modern, responsive Weather Application built with React, Vite, and Tailwind CSS. The application fetches real-time weather information using the WeatherAPI and dynamically updates the background interface based on current weather conditions.

## Features

- **Real-time Search:** Search weather conditions for any city or country globally.
- **Geolocation Support:** Automatically fetch current weather data using the device's location.
- **Dynamic Backgrounds:** UI background changes fluidly based on the fetched weather condition (e.g., rain, snow, sunny, cloudy).
- **Detailed Metrics:** Displays temperature, feels-like temperature, humidity, wind speed, and visibility.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewports using Tailwind CSS glassmorphism.

## Tech Stack

- **Frontend:** React (Hooks: `useState`, `useEffect`)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with Glassmorphism overlays)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

Ensure you have **Node.js** installed on your system.

### Installation

1. Clone the repository:
   ```bash
  gh repo clone minahil-zahid799/Weather-App
   ```

2. Navigate into the project directory:
   ```bash
   cd Weather-App
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory.
2. Get a free API Key from [WeatherAPI](https://weatherapi.com).
3. Add your key to the `.env` file:
   ```env
   VITE_WEATHER_API_KEY=your_actual_api_key_here
   ```

### Running the Project

To start the development server locally:
```bash
npm run dev
```

## Deployment

The application is configured for deployment on Vercel. Ensure you add the `VITE_WEATHER_API_KEY` to the Environment Variables settings in your Vercel project dashboard before deploying.
