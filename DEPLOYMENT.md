# Deployment Guide

This guide provides instructions for deploying the URL Shortener application to production environments.

## Prerequisites

- Node.js 18+ installed
- Access to evaluation service credentials
- Production environment setup

## Environment Setup

### 1. Authentication Setup

Run the authentication setup script with production credentials:

\`\`\`bash
# Update scripts/auth-setup.js with production values
node scripts/auth-setup.js
\`\`\`

### 2. Environment Variables

Create production environment files:

**Backend (.env):**
\`\`\`env
ACCESS_TOKEN=your_production_jwt_token
PORT=4000
NODE_ENV=production
\`\`\`

**Frontend (.env.production):**
\`\`\`env
NEXT_PUBLIC_ACCESS_TOKEN=your_production_jwt_token
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
\`\`\`

## Build Process

### 1. Build All Components

\`\`\`bash
# Build logging middleware
npm run logging:build

# Build backend
npm run backend:build

# Build frontend
npm run build
\`\`\`

### 2. Install Production Dependencies

\`\`\`bash
# Backend
cd backend && npm ci --production

# Frontend (handled by build process)
npm ci --production
\`\`\`

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Frontend Deployment:**
   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   \`\`\`

2. **Environment Variables:**
   - Add \`NEXT_PUBLIC_ACCESS_TOKEN\` in Vercel dashboard
   - Configure build settings for Next.js

### Option 2: Traditional Server

1. **Backend Deployment:**
   \`\`\`bash
   # Copy built files to server
   scp -r backend/dist/ user@server:/path/to/app/
   scp backend/package.json user@server:/path/to/app/
   
   # On server
   npm ci --production
   pm2 start dist/server.js --name url-shortener-backend
   \`\`\`

2. **Frontend Deployment:**
   \`\`\`bash
   # Build and copy
   npm run build
   scp -r .next/ user@server:/path/to/frontend/
   
   # On server  
   pm2 start npm --name url-shortener-frontend -- start
   \`\`\`

### Option 3: Docker

1. **Backend Dockerfile:**
   \`\`\`dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY backend/package*.json ./
   RUN npm ci --production
   COPY backend/dist ./dist
   EXPOSE 4000
   CMD ["npm", "start"]
   \`\`\`

2. **Frontend Dockerfile:**
   \`\`\`dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production
   COPY .next ./.next
   EXPOSE 3000
   CMD ["npm", "start"]
   \`\`\`

3. **Docker Compose:**
   \`\`\`yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "4000:4000"
       environment:
         - ACCESS_TOKEN=${ACCESS_TOKEN}
     
     frontend:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_ACCESS_TOKEN=${ACCESS_TOKEN}
       depends_on:
         - backend
   \`\`\`

## Production Considerations

### Security

- **HTTPS**: Enable SSL/TLS certificates
- **CORS**: Configure proper CORS origins
- **Rate Limiting**: Implement API rate limiting
- **Input Sanitization**: Validate all inputs
- **Environment Variables**: Never commit secrets

### Performance

- **Caching**: Implement Redis for URL caching
- **CDN**: Use CDN for static assets
- **Load Balancing**: Multiple backend instances
- **Database**: Replace in-memory storage with persistent database

### Monitoring

- **Logging**: Centralized log aggregation
- **Metrics**: Application performance monitoring
- **Health Checks**: Endpoint monitoring
- **Alerts**: Error rate and performance alerts

### Database Migration

For production, replace in-memory storage:

\`\`\`sql
-- PostgreSQL schema
CREATE TABLE short_urls (
  id UUID PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  click_count INTEGER DEFAULT 0
);

CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  short_url_id UUID REFERENCES short_urls(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  referrer TEXT,
  location VARCHAR(10)
);
\`\`\`

## Health Checks

Implement health check endpoints:

\`\`\`javascript
// Backend health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})
\`\`\`

## Backup Strategy

- **Database**: Regular automated backups
- **Configuration**: Version-controlled configs
- **Logs**: Log retention and archival
- **Code**: Git-based deployment with rollback capability

## Rollback Plan

1. **Database Rollback**: Restore from backup
2. **Code Rollback**: Deploy previous Git commit
3. **Configuration Rollback**: Revert environment variables
4. **Verification**: Run integration tests post-rollback
