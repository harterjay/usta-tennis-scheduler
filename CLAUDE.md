# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

USTA Tennis Schedule Importer is a web application that converts USTA team match schedules into Google Calendar-compatible format (.ics files). The MVP focuses on manual text input and calendar file export - no direct API integration with USTA or Google Calendar.

## Architecture

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Modern CSS framework (TailwindCSS recommended)
- **Build Tool**: Vite or Create React App
- **Deployment**: Static hosting (Vercel, Netlify)

### Backend
- **Architecture**: Serverless functions (Vercel Functions or AWS Lambda)
- **Runtime**: Node.js with TypeScript
- **Data Processing**: Client-side JavaScript for text parsing
- **File Generation**: iCalendar (.ics) format generation

### Core Components
- **Text Parser**: Extracts match data from pasted USTA schedule text
- **Data Validator**: Validates and sanitizes parsed schedule data
- **iCalendar Generator**: Creates RFC 5545 compliant .ics files
- **Download Handler**: Manages file generation and download

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Initial Setup
```bash
npm install
npm run dev
```

### Expected Project Structure
```
src/
├── components/          # React components
│   ├── ScheduleInput/   # Text input interface  
│   ├── DataPreview/     # Parsed data preview
│   └── DownloadButton/  # Calendar file download
├── utils/
│   ├── parser.ts        # USTA schedule text parsing
│   ├── validator.ts     # Data validation logic
│   └── icalGenerator.ts # iCalendar file generation
├── types/
│   └── schedule.ts      # TypeScript interfaces
└── styles/              # CSS/styling files
```

## Data Processing Flow

1. **Input**: User pastes USTA schedule text
2. **Parse**: Extract date, time, opponent, location, match type
3. **Validate**: Check data completeness and format
4. **Generate**: Create iCalendar (.ics) file
5. **Download**: Provide file for Google Calendar import

### Expected Input Format
```
Date: Saturday, March 15, 2025
Time: 10:00 AM
Opponent: Springfield Tennis Club
Location: Westfield Courts, 123 Tennis Ave
Match Type: Men's 4.0 Doubles
```

## Development Commands

### Frontend Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Testing
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run e2e` - Run end-to-end tests (if implemented)

## Key Technical Requirements

### Performance Targets
- Page load: <3 seconds
- Text processing: <5 seconds
- File generation: <2 seconds

### Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile responsive design

### Security & Privacy
- No persistent data storage
- Client-side processing where possible
- Input sanitization for XSS prevention
- HTTPS enforcement

## Testing Strategy

### Unit Tests
- Text parsing functions
- Data validation logic
- iCalendar generation
- Error handling

### Integration Tests  
- End-to-end user flow
- File download functionality
- Error scenarios

### Manual Testing
- Various USTA schedule formats
- Different browsers and devices
- Calendar import verification

## Error Handling

- Graceful parsing failures with user feedback
- Validation errors with specific guidance
- Network issues and recovery
- Malformed input detection