// Screenshot generation script for API testing documentation
const fs = require("fs")
const path = require("path")

const SCREENSHOTS_DIR = path.join(__dirname, "../screenshots")

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

const screenshotInstructions = {
  auth: {
    title: "Authentication API Call",
    description: "POST request to /auth endpoint with response showing access_token",
    endpoint: "POST http://20.244.56.144/evaluation-service/auth",
    requestBody: {
      email: "candidate@example.com",
      name: "Candidate Name",
      rollNo: "ROLL123",
      accessCode: "PROVIDED_ACCESS_CODE",
      clientID: "saved_clientID",
      clientSecret: "saved_clientSecret",
    },
    expectedResponse: {
      token_type: "Bearer",
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      expires_in: 1735689600,
    },
    filename: "01-auth-api-call.png",
  },

  createShortUrl: {
    title: "Create Short URL API Call",
    description: "POST request to /shorturls with 201 response",
    endpoint: "POST http://localhost:4000/shorturls",
    requestBody: {
      url: "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
      validity: 30,
      shortcode: "abcd1",
    },
    expectedResponse: {
      shortLink: "http://localhost:4000/abcd1",
      expiry: "2025-01-01T00:30:00Z",
    },
    filename: "02-create-short-url.png",
  },

  getStats: {
    title: "Get URL Statistics API Call",
    description: "GET request to /shorturls/:shortcode/stats with analytics data",
    endpoint: "GET http://localhost:4000/shorturls/abcd1/stats",
    requestBody: null,
    expectedResponse: {
      shortLink: "http://localhost:4000/abcd1",
      createdAt: "2025-01-01T00:00:00Z",
      expiry: "2025-01-01T00:30:00Z",
      clickCount: 3,
      clicks: [
        {
          timestamp: "2025-01-01T00:05:00Z",
          referrer: "direct",
          location: "IN",
        },
        {
          timestamp: "2025-01-01T00:10:00Z",
          referrer: "http://example.com",
          location: "IN",
        },
        {
          timestamp: "2025-01-01T00:15:00Z",
          referrer: "direct",
          location: "IN",
        },
      ],
    },
    filename: "03-get-url-stats.png",
  },

  redirect: {
    title: "URL Redirect Request",
    description: "GET request showing 302 redirect response",
    endpoint: "GET http://localhost:4000/abcd1",
    requestBody: null,
    expectedResponse:
      "302 Found - Location: https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
    filename: "04-url-redirect.png",
  },

  frontendShortener: {
    title: "Frontend - URL Shortener Page",
    description: "Screenshot of shortener page with form filled and results displayed",
    endpoint: "http://localhost:3000",
    details: "Show multiple URL forms with validation, success results, and error states",
    filename: "05-frontend-shortener-page.png",
  },

  frontendStats: {
    title: "Frontend - Statistics Page",
    description: "Screenshot of statistics page with URL list and analytics data",
    endpoint: "http://localhost:3000",
    details: "Show expanded accordion with click analytics table and URL details",
    filename: "06-frontend-stats-page.png",
  },
}

// Generate screenshot instructions file
const instructionsContent = `# Screenshot Instructions

This document provides detailed instructions for capturing the required screenshots for the Affordmed evaluation project.

## Required Screenshots

${Object.entries(screenshotInstructions)
  .map(
    ([key, screenshot]) => `
### ${screenshot.title}

**File:** \`${screenshot.filename}\`
**Description:** ${screenshot.description}
**Endpoint:** \`${screenshot.endpoint}\`

${
  screenshot.requestBody
    ? `**Request Body:**
\`\`\`json
${JSON.stringify(screenshot.requestBody, null, 2)}
\`\`\`
`
    : ""
}

**Expected Response:**
${
  typeof screenshot.expectedResponse === "string"
    ? `\`${screenshot.expectedResponse}\``
    : `\`\`\`json
${JSON.stringify(screenshot.expectedResponse, null, 2)}
\`\`\``
}

**Requirements:**
- Must show request body (if applicable)
- Must show response body with status code
- Must show response time in Postman/Insomnia
- Clear, readable text
- Proper formatting

${screenshot.details ? `**Additional Details:** ${screenshot.details}` : ""}

---
`,
  )
  .join("")}

## Tools Recommended

- **Postman** - For API testing with built-in response time display
- **Insomnia** - Alternative API client with good screenshot capabilities
- **Browser DevTools** - For frontend screenshots and network inspection

## Screenshot Guidelines

1. **API Screenshots:**
   - Use Postman or Insomnia for consistent formatting
   - Ensure response time is visible
   - Include full request/response bodies
   - Use proper JSON formatting

2. **Frontend Screenshots:**
   - Use browser at standard resolution (1920x1080 recommended)
   - Show complete page functionality
   - Include both success and error states where applicable
   - Ensure all text is readable

3. **File Naming:**
   - Use provided filenames exactly as specified
   - Save in PNG format for best quality
   - Place all screenshots in \`screenshots/\` directory

## Verification Checklist

Before submitting, verify each screenshot includes:

- [ ] Clear, readable text and UI elements
- [ ] Complete request/response data
- [ ] Response time visible (for API calls)
- [ ] Proper HTTP status codes
- [ ] No sensitive information (tokens should be partially obscured)
- [ ] Correct filename and location

## Example Response Times

Target response times for evaluation:
- Authentication API: < 500ms
- Create Short URL: < 200ms  
- Get Statistics: < 150ms
- URL Redirect: < 100ms
- Frontend Pages: < 2s initial load
`

fs.writeFileSync(path.join(SCREENSHOTS_DIR, "README.md"), instructionsContent)

// Generate placeholder screenshot files with instructions
Object.entries(screenshotInstructions).forEach(([key, screenshot]) => {
  const placeholderContent = `# ${screenshot.title}

This is a placeholder for the required screenshot: ${screenshot.filename}

## Instructions:
${screenshot.description}

## Endpoint: 
${screenshot.endpoint}

${
  screenshot.requestBody
    ? `## Request Body:
\`\`\`json
${JSON.stringify(screenshot.requestBody, null, 2)}
\`\`\`
`
    : ""
}

## Expected Response:
${
  typeof screenshot.expectedResponse === "string"
    ? screenshot.expectedResponse
    : `\`\`\`json
${JSON.stringify(screenshot.expectedResponse, null, 2)}
\`\`\``
}

## Requirements:
- Show request body, response body, and response time
- Use Postman or Insomnia for API calls
- Ensure all text is clearly readable
- Save as PNG format

Replace this file with the actual screenshot.
`

  fs.writeFileSync(path.join(SCREENSHOTS_DIR, screenshot.filename.replace(".png", ".md")), placeholderContent)
})

console.log("📸 Screenshot instructions and placeholders generated!")
console.log(`📁 Location: ${SCREENSHOTS_DIR}`)
console.log("📋 Next steps:")
console.log("   1. Review instructions in screenshots/README.md")
console.log("   2. Take screenshots using Postman/Insomnia")
console.log("   3. Replace .md files with actual .png screenshots")
console.log("   4. Verify all requirements are met")
