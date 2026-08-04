# Alert Correlation Dashboard

A modern React-based dashboard for viewing alerts and analyzing their root causes using correlation analysis.

## Features

- **Alert List**: Browse and filter alerts by severity (critical, warning, info)
- **Root Cause Analysis**: Identify root causes with confidence scoring and timeline visualization
- **Widget Dashboard**: Quick overview with root causes, total alerts, severity breakdown, and top sources
- **Interactive Filtering**: Click root cause widget to filter alerts by affected devices
- **Impact Metrics**: View affected devices, critical alerts count, duration, and related alerts
- **Recommended Actions**: Get suggested remediation steps for each root cause

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
```

### Running Locally

```bash
npm start
```

The app will open at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file for local development:

```
REACT_APP_API_URL=http://localhost:3000
```

Adjust the URL to point to your Alert Correlation Engine API server.

### Building for Production

```bash
npm run build
```

## Deployment to Railway

### Quick Deploy with Railway CLI

```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

### Deploy via Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Railway will auto-detect and use the Dockerfile
5. Add environment variables:
   - `REACT_APP_API_URL`: URL to your Alert Correlation Engine API
6. Deploy!

### Environment Variables on Railway

Set these in the Railway dashboard:

- **REACT_APP_API_URL**: Your API server URL
  - Local: `http://localhost:3000`
  - Railway: `https://your-api.railway.app`
  - External: `http://api.yourcompany.com`

### Docker Build

Build and run locally with Docker:

```bash
docker build -t alert-dashboard .
docker run -p 3000:3000 -e REACT_APP_API_URL=http://localhost:3000 alert-dashboard
```

## Architecture

- **Frontend**: React 19 with TypeScript
- **HTTP Client**: Axios with configurable API URL
- **Icons**: Lucide React
- **Styling**: CSS with dark theme
- **Deployment**: Docker multi-stage build optimized for production

## Project Structure

```
src/
├── components/
│   ├── AlertsList.tsx      # Alert list with severity filtering
│   └── RootCauseCard.tsx   # Root cause analysis display
├── services/
│   └── api.ts              # API client
├── styles/
│   ├── alerts.css
│   └── rootcause.css
├── types.ts                # TypeScript interfaces
├── App.tsx                 # Main dashboard
└── index.tsx               # Entry point
```

## API Requirements

The dashboard requires the Alert Correlation Engine API with these endpoints:

- `GET /api/alerts` - List all alerts
- `POST /api/demo-data/load` - Load demo data
- `POST /api/demo-data/clear` - Clear all data

See the Alert Correlation Engine docs for full API specification.

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
