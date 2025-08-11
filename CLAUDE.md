# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `npm install` - Install dependencies (required before first build/run)
- `npm run dev` - Start development server with hot reload via nodemon + tsx
- `npm run build` - Build Next.js application for production
- `npm start` - Start production server using tsx
- `npm run lint` - Run ESLint checks

### Database Operations (Prisma)
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations in development
- `npm run db:reset` - Reset database and run migrations

## Architecture Overview

### Core Technologies
- **Next.js 15** with App Router architecture
- **TypeScript 5** for type safety
- **Tailwind CSS 4** for styling with shadcn/ui components
- **Prisma** ORM with SQLite database
- **Socket.IO** for real-time WebSocket communication
- **Zustand** for client-side state management

### Custom Server Setup
The application uses a custom server (`server.ts`) that combines Next.js with Socket.IO:
- Next.js handles HTTP requests and API routes
- Socket.IO server runs on the same port at `/api/socketio` path
- Development uses nodemon + tsx for hot reload
- Production uses tsx directly

### Application Structure

#### Real-time Chat Application
This is a personal development assistant chat application with:
- Real-time messaging via Socket.IO
- Conversation management
- Portuguese-language interface focused on personal development topics

#### Key Components
- `ChatInterface` - Main chat UI with sidebar, message display, and input
- Theme system using CSS variables and Tailwind classes
- Responsive design with mobile-first approach

#### State Management
- **Zustand store** (`chat-store.ts`) manages:
  - Current conversation and messages
  - Conversation history
  - Typing indicators
  - User ID generation

#### API Integration
- **Conversation API** (`/api/conversation`) creates new conversations via external webhook
- **Message API** (`/api/message`) handles message processing
- **Health API** (`/api/health`) for system monitoring
- JWT authentication for external webhook communication

#### Database Schema
Current Prisma models:
- `User` - Basic user information
- `Post` - Content posts (appears to be scaffold remainder)

### Socket.IO Implementation
- Real-time bidirectional communication
- Echo functionality for message testing
- Connection/disconnection logging
- System welcome messages

## Development Notes

### Configuration Specifics
- TypeScript and ESLint errors are ignored during build (`ignoreBuildErrors: true`)
- Development hot reload is disabled in favor of nodemon
- React Strict Mode is disabled
- CORS enabled for Socket.IO with wildcard origin

### File Structure Patterns
- Components in `/src/components/` with `/ui` subfolder for shadcn components
- API routes follow Next.js App Router convention in `/src/app/api/`
- Utility functions in `/src/lib/`
- Database client and JWT utilities in `/src/lib/`
- State stores in `/src/store/`

### External Dependencies
- Uses external webhook at `agencialendaria.ai` for conversation creation
- Requires JWT tokens for webhook authentication
- Socket.IO client connects to `/api/socketio` path

### Styling System
- Custom CSS variables for theming in `globals.css`
- Tailwind configured with shadcn/ui design tokens
- Responsive breakpoints for mobile/desktop layouts
- Dark mode support via class-based theming