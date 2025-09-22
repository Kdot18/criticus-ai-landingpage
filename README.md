# Criticus AI - Public Landing Page

## Overview
This is the public-facing landing page for Criticus AI, featuring waitlist signup and demo booking functionality.

## Features
- Clean, modern landing page design
- WebGL background effects
- Waitlist signup modal
- Demo booking modal for educational institutions
- Responsive design with Montserrat font
- Backend API for data collection

## Tech Stack
### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- Three.js for WebGL effects
- Lucide React for icons

### Backend
- Node.js with Express
- SQLite database
- CORS enabled for frontend integration

## Deployment

### Frontend (Vercel)
1. Connect this repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Railway)
1. Create new Railway project
2. Connect this repository
3. Set root directory to `server/`
4. Set start command: `npm start`
5. Deploy

## Environment Variables
No environment variables required for basic functionality.

## Development
```bash
# Install frontend dependencies
npm install

# Start frontend development server
npm run dev

# Install backend dependencies
cd server
npm install

# Start backend server
npm start
```

## API Endpoints
- `POST /api/waitlist` - Submit waitlist signup
- `POST /api/demo` - Submit demo request
- `GET /health` - Health check

## Database Schema
### Waitlist Signups
- id (TEXT PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- university (TEXT)
- role (TEXT) - student/professor/administrator
- how_heard_about_us (TEXT)
- created_at (DATETIME)

### Demo Requests
- id (TEXT PRIMARY KEY)
- name (TEXT)
- email (TEXT)
- institution_type (TEXT) - high-school/community-college/university
- institution_name (TEXT)
- role (TEXT) - varies by institution type
- created_at (DATETIME)

## License
All rights reserved - Criticus AI
