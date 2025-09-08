# CLAUDE.md

## github push test
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

USTA Tennis Schedule Importer is a web application that converts USTA team match schedules into Google Calendar-compatible format (.ics files). The application uses image upload and AI-powered analysis to extract schedule data from screenshots - no text input required and no direct API integration with USTA or Google Calendar.

## Architecture

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Modern CSS framework (TailwindCSS recommended)
- **Build Tool**: Vite or Create React App
- **Deployment**: Static hosting (Vercel, Netlify)

### Backend
- **Architecture**: Serverless functions (Vercel Functions or AWS Lambda)
- **Runtime**: Node.js with TypeScript
- **Data Processing**: Claude AI API for image analysis and schedule extraction
- **File Generation**: iCalendar (.ics) format generation

### Core Components
- **Image Upload**: Drag-and-drop interface for schedule screenshots
- **AI Image Analyzer**: Claude AI integration for extracting match data from images
- **Data Validator**: Validates and sanitizes extracted schedule data
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
│   ├── ImageUpload/     # Image upload interface  
│   ├── DataPreview/     # Extracted data preview
│   └── DownloadButton/  # Calendar file download
├── utils/
│   ├── imageProcessor.ts # Claude AI image analysis
│   ├── validator.ts     # Data validation logic
│   └── icalGenerator.ts # iCalendar file generation
├── types/
│   └── schedule.ts      # TypeScript interfaces
├── styles/              # CSS/styling files
└── api/
    └── analyze-schedule.ts # Serverless function for Claude AI integration
```

## Data Processing Flow

1. **Input**: User uploads screenshot of USTA schedule table
2. **Analyze**: Claude AI extracts match data from image (dates, times, teams, captains, facilities)
3. **Validate**: Check data completeness and format
4. **Generate**: Create iCalendar (.ics) file
5. **Download**: Provide file for Google Calendar import

### Expected Input Format
Users simply take a screenshot of their USTA schedule table from tennislink.usta.com, including:
- Match ID column
- Schedule Date and Time columns  
- Home Team and Visiting Team columns
- Captain/Phone columns
- Facility/Match Site column

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