# WhichCraft Next - Planning

## Overview

This document outlines the architecture and development plans for WhichCraft Next, a Next.js web application for tracking and rating beverages.

## Current Architecture

### Web App

- **Technology**: Next.js 15 with App Router
  - React 19
  - TypeScript
  - TailwindCSS with Shadcn UI components
  - Supabase authentication
  - Server and client components

### Local Libraries

- **api-client** (`lib/api-client`): API client for consuming the backend API
  - Type-safe API methods
  - Authentication handling
  - Request/response management
  
- **beverage-context** (`lib/beverage-context`): React context for beverage state management
  - Client-side state for beverages
  - Optimistic updates
  - Statistics calculation

### Backend API

The backend API is maintained in a separate repository: [whichcraft-api](https://github.com/ericcecchi/whichcraft-api)

- FastAPI backend
- Python with Pydantic models
- SQLAlchemy ORM
- PostgreSQL database (via Supabase)
- JWT authentication
- Alembic migrations

## Development Guidelines

- Use TypeScript for all new frontend code
- Follow React 19 best practices
- Use server components wherever possible to minimize client bundle
- Write tests for new features
- Keep files under 500 lines of code
- Document complex logic with inline comments
- Use existing Shadcn UI components before creating new ones
- Follow the existing code style and patterns

## Project Structure

```
whichcraft-next/
├── app/                    # Next.js app directory (App Router)
├── components/             # Reusable React components
├── lib/                    # Local library code
│   ├── api-client/        # API client library
│   └── beverage-context/  # State management
├── utils/                  # Utility functions
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── supabase/              # Supabase configuration
```

## Future Considerations

- Enhanced filtering and search capabilities
- Additional statistics and insights
- Performance optimizations
- Enhanced user profiles and social features
- Improved mobile experience
- Offline support
