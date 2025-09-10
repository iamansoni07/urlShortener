# URL Shortener Frontend

A responsive React frontend application built with Next.js, TypeScript, and Material UI that provides an intuitive interface for URL shortening and analytics.

## Features

- **URL Shortening Interface**: Create up to 5 URLs concurrently with validation
- **Analytics Dashboard**: View detailed statistics for all shortened URLs
- **Material UI Components**: Clean, professional interface design
- **Real-time Validation**: Client-side input validation with error feedback
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Integrated Logging**: All user actions logged via custom middleware

## Pages

### URL Shortener Page

**Functionality:**
- Shorten up to 5 URLs simultaneously
- Optional validity period configuration (minutes)
- Optional custom shortcode specification
- Real-time client-side validation
- Success/error feedback with detailed information

**Input Fields per URL:**
- **Original URL** (required): The long URL to be shortened
- **Validity Period** (optional): Duration in minutes (default: 30)
- **Custom Shortcode** (optional): 3-10 alphanumeric characters

**Validation Rules:**
- URL must be valid format (checked with URL constructor)
- Validity must be positive integer if provided
- Shortcode must be 3-10 alphanumeric characters if provided
- All fields validated before API submission

### URL Statistics Page

**Functionality:**
- Display all created shortened URLs
- Expandable cards showing detailed analytics
- Click tracking with timestamp, referrer, and location
- Real-time data fetching
- Status indicators (Active/Expired)

**Analytics Data:**
- Creation and expiry timestamps
- Total click count
- Detailed click history with:
  - Timestamp of each click
  - Referrer source
  - Coarse-grained geographical location

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Copy environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Update \`.env.local\` with your access token

4. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

- \`NEXT_PUBLIC_ACCESS_TOKEN\`: JWT token for logging API (must be prefixed with NEXT_PUBLIC_ for client-side access)

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Material UI**: Component library for consistent design
- **React Hooks**: State management and side effects
- **Fetch API**: HTTP client for backend communication

## Component Architecture

\`\`\`
app/
├── layout.tsx              # Root layout with Material UI providers
├── page.tsx                # Main page with tab navigation
├── theme.ts                # Material UI theme configuration
└── components/
    ├── UrlShortenerPage.tsx # URL creation interface
    └── UrlStatsPage.tsx     # Analytics dashboard
\`\`\`

## Material UI Integration

**Theme Configuration:**
- Custom theme with primary/secondary colors
- Typography using Geist Sans font family
- Consistent spacing and elevation
- Light mode optimized (dark mode ready)

**Key Components Used:**
- \`Container\`, \`Paper\`, \`Card\` for layout
- \`TextField\`, \`Button\` for forms
- \`Tabs\`, \`Tab\` for navigation
- \`Table\`, \`Accordion\` for data display
- \`Alert\`, \`Chip\` for status indicators
- \`CircularProgress\` for loading states

## API Integration

**Backend Communication:**
- Base URL: \`http://localhost:4000\`
- Content-Type: \`application/json\`
- Error handling with user-friendly messages
- Loading states during API calls

**Endpoints Used:**
- \`POST /shorturls\` - Create short URLs
- \`GET /shorturls\` - Fetch all URLs
- \`GET /shorturls/:shortcode/stats\` - Get analytics

## Logging Integration

All user interactions are logged:
- Form submissions and validation errors
- API calls (success and failure)
- Component lifecycle events
- User navigation actions

**Log Categories:**
- \`frontend\` stack
- \`component\` package for UI interactions
- \`api\` package for backend communication

## Error Handling

**Client-Side Validation:**
- Real-time input validation
- Clear error messages
- Form state management
- Prevention of invalid submissions

**API Error Handling:**
- Network error detection
- HTTP status code interpretation
- User-friendly error messages
- Retry mechanisms where appropriate

## Performance Optimizations

- Component-level state management
- Efficient re-rendering with React keys
- Lazy loading of statistics data
- Debounced input validation
- Optimized bundle size with Next.js

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color scheme
- Focus management
