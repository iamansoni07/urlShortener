# URL Shortener - Affordmed Campus Hiring Evaluation

A full-stack URL shortener application built with React, Express.js, and TypeScript for the Affordmed campus hiring evaluation.

## Project Structure

\`\`\`
├── logging-middleware/     # Reusable logging package
├── backend/               # Express.js API server
├── app/                   # Next.js React frontend
├── scripts/               # Setup and testing scripts
└── screenshots/           # API testing screenshots
\`\`\`

## Features

- **URL Shortening**: Create short URLs with optional custom codes and expiry times
- **Analytics**: Track clicks with timestamp, referrer, and location data
- **Material UI Frontend**: Clean, responsive interface for URL management
- **Comprehensive Logging**: Integrated logging middleware for all operations
- **RESTful API**: Well-documented backend with proper error handling

## Quick Start

### 1. Setup Authentication

First, update the configuration in `scripts/auth-setup.js` with your details:

\`\`\`javascript
const CONFIG = {
  email: 'your-email@example.com',
  name: 'Your Name',
  mobileNo: 'your-mobile-number',
  githubUsername: 'your-github-username',
  rollNo: 'your-roll-number',
  accessCode: 'provided-access-code'
};
\`\`\`

Then run the setup:

\`\`\`bash
node scripts/auth-setup.js
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm run setup
\`\`\`

### 3. Start the Application

Option A - Start both services together:
\`\`\`bash
npm run dev:all
\`\`\`

Option B - Start services separately:
\`\`\`bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend  
npm run dev
\`\`\`

### 4. Test Integration

\`\`\`bash
npm run test:integration
\`\`\`

## API Endpoints

### Backend (http://localhost:4000)

- `POST /shorturls` - Create short URL
- `GET /shorturls` - List all short URLs
- `GET /:shortcode` - Redirect to original URL
- `GET /shorturls/:shortcode/stats` - Get URL statistics

### Frontend (http://localhost:3000)

- **URL Shortener Tab**: Create up to 5 short URLs with validation
- **Statistics Tab**: View analytics for all created URLs

## Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

\`\`\`env
ACCESS_TOKEN=your_jwt_token
NEXT_PUBLIC_ACCESS_TOKEN=your_jwt_token
PORT=4000
\`\`\`

## Development Scripts

- `npm run dev` - Start frontend development server
- `npm run backend:dev` - Start backend development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build frontend for production
- `npm run backend:build` - Build backend for production
- `npm run logging:build` - Build logging middleware
- `npm run test:integration` - Run integration tests

## Architecture

### Logging Middleware
- TypeScript package for structured logging
- Validates inputs against allowed packages and levels
- Integrates with evaluation service logging API
- Used by both frontend and backend

### Backend API
- Express.js server with TypeScript
- In-memory database for URL storage
- Comprehensive error handling
- Click analytics tracking
- CORS enabled for frontend integration

### Frontend App
- Next.js with React and TypeScript
- Material UI components (as required)
- Client-side validation
- Real-time statistics display
- Responsive design

## Testing

The integration test suite verifies:
- Backend and frontend health checks
- URL shortening functionality
- Redirect behavior
- Statistics tracking
- End-to-end API integration

## Submission Guidelines

This project follows the Affordmed evaluation requirements:
- Repository structure matches specification
- Logging middleware integration throughout
- Material UI for frontend (no ShadCN)
- Proper error handling and validation
- Screenshots included for API testing
- No company name or personal details in repo
