# Logging Middleware

A TypeScript logging middleware package for the Affordmed evaluation project that provides structured logging capabilities for both frontend and backend applications.

## Features

- Type-safe logging with TypeScript
- Input validation for stack, level, package, and message
- Support for both frontend and backend stacks
- Automatic API integration with the evaluation logging service
- Bearer token authentication

## Installation

\`\`\`bash
npm install @affordmed/logging-middleware
\`\`\`

## Usage

### Initialize the Logger

\`\`\`typescript
import { initializeLogger, Log } from '@affordmed/logging-middleware';

// Initialize with your configuration
initializeLogger({
  apiUrl: 'http://20.244.56.144/evaluation-service',
  accessToken: 'your-jwt-token-here'
});
\`\`\`

### Logging Messages

\`\`\`typescript
import { Log } from '@affordmed/logging-middleware';

// Backend logging
await Log('backend', 'info', 'controller', 'User registration successful');
await Log('backend', 'error', 'db', 'Database connection failed');

// Frontend logging
await Log('frontend', 'info', 'component', 'User clicked submit button');
await Log('frontend', 'warn', 'api', 'API response took longer than expected');
\`\`\`

### Allowed Values

#### Stacks
- \`backend\`
- \`frontend\`

#### Levels
- \`debug\`
- \`info\`
- \`warn\`
- \`error\`
- \`fatal\`

#### Packages

**Backend Only:**
- \`cache\`, \`controller\`, \`cron_job\`, \`db\`, \`domain\`, \`handler\`, \`repository\`, \`route\`, \`service\`

**Frontend Only:**
- \`api\`, \`component\`, \`hook\`, \`page\`, \`state\`, \`style\`

**Shared (Both):**
- \`auth\`, \`config\`, \`middleware\`, \`utils\`

## Error Handling

The middleware throws \`ValidationError\` for invalid inputs and generic \`Error\` for API failures.

\`\`\`typescript
import { Log, ValidationError } from '@affordmed/logging-middleware';

try {
  await Log('backend', 'info', 'controller', 'Operation completed');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else {
    console.error('API call failed:', error.message);
  }
}
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

This will compile TypeScript to JavaScript in the \`dist\` folder.

## API Integration

The middleware automatically sends logs to the evaluation service at:
- **Endpoint:** \`POST http://20.244.56.144/evaluation-service/logs\`
- **Authentication:** Bearer token in Authorization header
- **Request Format:**
  \`\`\`json
  {
    "stack": "backend" | "frontend",
    "level": "debug" | "info" | "warn" | "error" | "fatal",
    "package": "valid_package_name",
    "message": "log_message"
  }
  \`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes during development
npm run dev
\`\`\`
