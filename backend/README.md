# URL Shortener Backend

A robust HTTP URL Shortener Microservice built with Express.js and TypeScript that provides core URL shortening functionality along with analytics capabilities.

## Features

- Create shortened URLs with optional custom shortcodes
- Configurable expiry times (default 30 minutes)
- Click tracking with analytics
- RESTful API endpoints
- Comprehensive logging integration
- Error handling with proper HTTP status codes

## API Endpoints

### Create Short URL
- **POST** \`/shorturls\`
- **Body**: \`{ "url": "string", "validity": number, "shortcode": "string" }\`
- **Response**: \`{ "shortLink": "string", "expiry": "string" }\`

**Example Request:**
\`\`\`json
{
  "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
  "validity": 30,
  "shortcode": "abcd1"
}
\`\`\`

**Example Response (201):**
\`\`\`json
{
  "shortLink": "http://localhost:4000/abcd1",
  "expiry": "2025-01-01T00:30:00Z"
}
\`\`\`

### Redirect to Original URL
- **GET** \`/:shortcode\`
- Redirects to original URL or returns error if expired/not found

**Behavior:**
- Valid URL: 302 redirect to original URL
- Expired URL: 410 Gone with JSON error
- Not found: 404 with JSON error

### List All Short URLs
- **GET** \`/shorturls\`
- Returns array of all created short URLs with metadata

**Example Response:**
\`\`\`json
[
  {
    "shortLink": "http://localhost:4000/abcd1",
    "originalUrl": "https://example.com/long-url",
    "createdAt": "2025-01-01T00:00:00Z",
    "expiry": "2025-01-01T00:30:00Z",
    "clickCount": 5
  }
]
\`\`\`

### Get URL Statistics
- **GET** \`/shorturls/:shortcode/stats\`
- Returns detailed analytics including click count and click data

**Example Response:**
\`\`\`json
{
  "shortLink": "http://localhost:4000/abcd1",
  "createdAt": "2025-01-01T00:00:00Z",
  "expiry": "2025-01-01T00:30:00Z",
  "clickCount": 5,
  "clicks": [
    {
      "timestamp": "2025-01-01T00:05:00Z",
      "referrer": "http://example.com",
      "location": "IN"
    }
  ]
}
\`\`\`

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Update \`.env\` with your access token from the evaluation service

4. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

5. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

   For development:
   \`\`\`bash
   npm run dev
   \`\`\`

## Environment Variables

- \`PORT\`: Server port (default: 4000)
- \`ACCESS_TOKEN\`: JWT token for logging API authentication

## Architecture

- **Express.js** server with TypeScript
- **In-memory database** for URL storage
- **Logging middleware** integration for all operations
- **CORS** enabled for frontend integration
- **UUID** for unique URL identification
- **Crypto** for shortcode generation

## Error Handling

The API returns appropriate HTTP status codes:
- \`200\`: Success
- \`201\`: Created
- \`400\`: Bad Request (invalid input)
- \`404\`: Not Found
- \`409\`: Conflict (shortcode exists)
- \`410\`: Gone (expired URL)
- \`500\`: Internal Server Error

## Logging Integration

All operations are logged using the custom logging middleware:
- Request/response logging
- Error tracking
- Performance monitoring
- User action tracking

## Data Storage

Uses in-memory storage for simplicity. In production, this would be replaced with:
- PostgreSQL/MySQL for relational data
- Redis for caching and session management
- MongoDB for document-based storage

## Security Considerations

- Input validation on all endpoints
- URL format validation
- Shortcode collision prevention
- Rate limiting (recommended for production)
- HTTPS enforcement (recommended for production)
