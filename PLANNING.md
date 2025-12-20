# WhichCraft Next - Planning

## Overview

This document outlines the architecture and development plans for WhichCraft Next, a monorepo containing the web and API applications.

## Current Architecture

### Apps

- **Web App** (`apps/web`): Next.js 14 application with App Router
  - TypeScript
  - TailwindCSS with Shadcn UI components
  - Supabase authentication
  - Server and client components

- **API** (`apps/api`): FastAPI backend
  - Python with Pydantic models
  - SQLAlchemy ORM
  - PostgreSQL database (via Supabase)
  - JWT authentication
  - Alembic migrations

### Packages

- **@whichcraft/api-client**: Shared API client for consuming the backend API

## Development Guidelines

- Use TypeScript for all new frontend code
- Follow PEP8 and use type hints for Python code
- Write tests for new features
- Keep files under 500 lines of code
- Document complex logic with inline comments

## Future Considerations

- Enhanced filtering and search capabilities
- Additional statistics and insights
- Performance optimizations
- Enhanced user profiles and social features
