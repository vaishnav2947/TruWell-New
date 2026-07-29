# TruWell Pharmacy Architecture

## Overview
TruWell Pharmacy is a cloud-native Pharmacy Management SaaS built with modern technologies.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, TanStack Query, Zustand, Framer Motion
- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL, Redis, BullMQ, Socket.IO
- **Authentication**: JWT, Refresh Tokens, RBAC, Email OTP, TOTP MFA
- **Storage**: AWS S3
- **Email**: AWS SES
- **PDF**: React PDF
- **Deployment**: Docker, Docker Compose, GitHub Actions

## Architecture Overview
- **Microfrontend**: Not implemented in MVP; single frontend application
- **Backend**: Modular NestJS architecture with feature modules
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for caching and session storage
- **Message Queue**: BullMQ for background jobs (email sending, PDF generation, virus scanning)
- **Real-time**: Socket.IO for real-time notifications (optional in MVP)
- **File Storage**: AWS S3 for prescription PDFs, document uploads, signatures
- **Search**: Full-text search via PostgreSQL or dedicated search service (Elasticsearch/Meilisearch) for global search
- **Workflow Engine**: State machine for prescription workflow transitions

## Enhancements Overview
### 1. Auto Save System
- Prevents data loss in Consultation Wizard
- Auto-saves every 20 seconds, on step change, on blur, before unload
- Consultation Draft table stores incomplete sessions
- Recovery mechanism on login/app load
- UI indicators: Last Saved, Saving..., Saved Successfully, Connection Lost

### 2. Prescription Workflow
- Replaced simple status with defined workflow:
  Draft → Clinical Review → Ready For Signature → Digitally Signed → Ready To Send → MFA Verified → Email Sent → Delivered → Completed → Archived
- Each transition creates audit entry
- State persistence and validation

### 3. Reference Numbering System
- Separate generators for each entity type:
  - Patient: PAT-2026-000001
  - Consultation: CONS-2026-000001
  - Prescription: RX-2026-000001
  - Invoice: INV-2026-000001
  - Email: MAIL-2026-000001
  - Audit: AUD-2026-000001
- Year-based, unique, human-readable, collision-safe, multi-tenant aware

### 4. Document Management
- Reusable module for patient-uploaded documents
- Supported types: Passport, Driving Licence, Insurance, NHS Documents, Lab Reports, Referral Letters, Images, Scanned Prescriptions, Medical Certificates
- Stores: original filename, storage path, mime type, uploaded by, uploaded date, related entities (patient/consultation/prescription), thumbnail, file size, virus scan status, version, permissions

### 5. Patient Timeline
- Replaced simple history with interactive timeline
- Events: Patient Created, Consultation Started, Vitals Recorded, Consent Given, Prescription Created, Prescription Signed, Prescription Sent, Email Delivered, Prescription Downloaded, Follow Up, Cancelled, Archived
- Features: Icons, color coding, filtering, search, date grouping

### 6. Global Search
- Universal search across patients, consultations, prescriptions, medicines, reference numbers, phone, email, NHS number, GP practice, postcode
- Features: Autocomplete, recent searches, search suggestions, advanced filters, fast pagination, search history

### 7. Notification Centre
- Unified notification system for in-app, email, push notifications
- Types: Information, Warning, Critical, Success, Reminder, Support
- Features: Unread count, read status, categories, preferences

### 8. Database Improvements
- Standard columns for all major tables:
  - UUID primary key
  - created_at, updated_at, deleted_at (soft delete)
  - created_by, updated_by, deleted_by (audit)
  - version (optimistic locking)
  - tenant_id, branch_id (multi-tenancy)
  - status (workflow/status field)
- Comprehensive indexing strategy
- Soft delete implementation

### 9. API Standardisation
- Consistent REST endpoint patterns:
  - Pagination (limit, offset/page)
  - Filtering (range, equality, search)
  - Sorting (multiple fields, direction)
  - Searching (full-text)
  - Validation (input sanitization, business rules)
- Standard responses:
  - Success: { success: true, data, message?, pagination? }
  - Error: { success: false, error: { code, message, details?, traceId? } }
- Problem Details (RFC 9457) or consistent custom format
- HTTP status code consistency
- Rate limiting (per IP, per user, per endpoint)
- Request IDs for tracing
- Idempotency keys for POST/PUT/PATCH where appropriate
- Updated Swagger/OpenAPI examples

### 10. Dashboard Enhancements
- Widgets for:
  - Today's Consultations
  - Today's Prescriptions
  - Pending Signature
  - Awaiting MFA
  - Emails Sent
  - Draft Prescriptions
  - Recent Patients
  - Recent Activity
  - Notifications
  - Quick Actions (New Patient, Consultation, Prescription, Pharmacy Finder)
  - Upcoming Follow Ups

### 11. Feature-Based Architecture
- reorganized folder structure:
  ```
  apps/
    web/          # Next.js frontend
    api/          # NestJS backend
  packages/
    ui/           # Shared UI components
    config/       # Shared configuration
    types/        # Shared TypeScript types
  features/
    auth/         # Authentication
    dashboard/    # Dashboard
    patients/     # Patient management
    consultations/ # Consultation wizard
    prescriptions/ # Prescription management
    pharmacy/     # Pharmacy finder
    email/        # Email services
    documents/    # Document management
    notifications/# Notification centre
    audit/        # Audit logging
  shared/
    hooks/        # Custom React hooks
    utils/        # Utility functions
    services/     # Service layers
    constants/    # Constants
  ```

### 12. Design System Improvements
- Expanded component specifications:
  - Cards: Prescription Card, Patient Card, Document Card
  - Buttons: All variants and states
  - Inputs: Text, TextArea, Number, Date, Time
  - Dropdowns & Comboboxes: Standard and searchable
  - Autocomplete: Medicine search, pharmacy search
  - Wizard Stepper: With validation and auto-save integration
  - Timeline: Interactive with filtering and grouping
  - Data Tables: With sorting, filtering, pagination, row actions
  - Pagination: Compact and descriptive variants
  - Toast: Position variants, action buttons
  - Notification Centre: Dropdown, page, badge
  - Status Badges: For workflow steps, prescription statuses
  - Prescription Cards: Compact and detailed views
  - Patient Cards: Summary and detailed views
  - Upload Components: With virus scan integration, progress, preview
  - Empty States: Illustrative and actionable
  - Error States: User-friendly with recovery actions
  - Loading States: Spinners, skeletons, skeleton loaders
  - Charts: For dashboard metrics (recharts/chart.js)

### 13. Clickable Prototype
- Purpose: Validate UI/UX flows before development
- Deliverables:
  - Desktop prototype (1920x1080)
  - Tablet prototype (768x1024)
  - Mobile prototype (375x667)
  - Navigation flow demonstration
  - Wizard flow (Consultation and Prescription)
  - Patient journey (search to prescription)
  - Prescription lifecycle (creation to archival)
  - Dark mode and light mode previews
  - Interactive states (hover, focus, active, disabled)

### 14. Security Review
- Healthcare compliance (UK NHS standards, GDPR, DTAC)
- JWT lifecycle: short-lived access tokens, refresh token rotation
- MFA flow: TOTP and Email OTP with backup codes
- Role Based Access Control (RBAC) with fine-grained permissions
- Permission matrix: Role → Resource → Action
- Audit logging: Comprehensive, immutable, tamper-evident
- Session timeout: Idle and absolute timeout
- Device management: Trusted devices, concurrent session limits
- Password policy: Length, complexity, breach detection, history
- Encryption strategy:
  - At rest: AES-256 for sensitive fields (PHC, NHS numbers)
  - In transit: TLS 1.3
  - Backups: Encrypted
- Secrets management: Environment variables, secret managers (AWS Secrets Manager/HashiCorp Vault)
- OWASP Top 10 mitigation:
  - Injection: Parameterized queries, ORM
  - Broken Authentication: MFA, secure session handling
  - Sensitive Data Exposure: Encryption, minimal data exposure
  - XML External Entities (XXE): Disabled external entity parsing
  - Broken Access Control: RBAC, resource ownership checks
  - Security Misconfiguration: Hardened configs, least privilege
  - Cross-Site Scripting (XSS): Output escaping, CSP headers
  - Insecure Deserialization: Input validation, safe deserialization
  - Using Components with Known Vulnerabilities: Regular dependency scanning
  - Insufficient Logging & Monitoring: Centralized logging, alerting

### 15. Performance Review
- Database indexing: Composite indexes for common query patterns
- Redis caching: Session storage, frequent lookups (patients, medicines), query caching
- Lazy loading: Route-based code splitting, component lazy loading
- Infinite scrolling: For large lists (patients, prescriptions, audit logs)
- Image optimisation: Automatic resizing, compression, WebP format, CDN
- Queue system: BullMQ for background jobs (PDF gen, email, virus scan, notifications)
- Background jobs: Prioritized, retry mechanisms, dead letter queues
- File uploads: Multipart streaming, virus scanning, thumbnail generation
- WebSocket optimisation: Room-based broadcasting, heartbeat, reconnection handling
- CDN: Static assets served via CDN
- Database connection pooling: Optimized pool sizes
- Query optimization: Explain plans, index usage monitoring

## Folder Structure
```
truwell/
├─ apps/
│  ├─ web/          # Next.js 15 frontend (app router)
│  └─ api/          # NestJS backend
├─ packages/
│  ├─ ui/           # Shared React component library
│  ├─ config/       # Shared configuration (typedefs, constants)
│  └─ types/        # Shared TypeScript interfaces and types
├─ features/
│  ├─ auth/         # Authentication features
│  ├─ dashboard/    # Dashboard widgets and data
│  ├─ patients/     # Patient search, profile, management
│  ├─ consultations/# Consultation wizard and management
│  ├─ prescriptions/# Prescription lifecycle and workflow
│  ├─ pharmacy/     # Pharmacy finder and directory
│  ├─ email/        # Email composition, sending, tracking
│  ├─ documents/    # Document upload, management, versioning
│  ├─ notifications/# Notification centre and preferences
│  └─ audit/        # Audit logging and viewing
├─ shared/
│  ├─ hooks/        # Custom React hooks (useForm, useQuery, etc.)
│  ├─ utils/        # Utility functions (date, string, validation)
│  ├─ services/     # Service layers (API clients, business logic)
│  └─ constants/    # Application constants (config, messages)
├─ docs/            # Documentation
├─ docker/          # Docker Compose and Dockerfiles
└─ scripts/         # Utility scripts (migration, seeding)
```

## Navigation Flow
1. **Authentication**
   - Login → Email OTP → TOTP MFA → Remember Device → Dashboard
   - Forgot Password → Email Reset → New Password → Login
   - Email Verification Link → Verify → Login
2. **Dashboard** (Post-login)
   - Overview widgets
   - Quick Actions: New Patient, New Consultation, New Prescription, Find Pharmacy
   - Recent Activity feed
   - Notifications badge
3. **Patient Management**
   - Search Patients (by NHS, name, DOB, phone, postcode)
   - Create New Patient
   - View Patient Profile (tabs: Overview, Demographics, History, Medications, Prescriptions, Timeline, Attachments)
4. **Consultation Wizard** (12 steps with auto-save)
   - Patient Identity → Patient Details → Vitals → Clinical Checks → Consultation → Consent → Outcome → Prescription → Review → Digital Signature → Email Preview → Complete
   - Auto-save indicators: Last Saved, Saving..., Saved Successfully, Connection Lost
   - Draft recovery on return
5. **Prescription Management**
   - Create from Consultation or standalone
   - Medicine search with autocomplete
   - Workflow status progression
   - Digital signature capture
   - MFA verification before sending
   - Email preview and sending
   - PDF generation and download
   - History and versioning
   - Audit trail
6. **Pharmacy Finder**
   - Search by postcode/current location
   - Filter by services, open now
   - Map view and list view
   - Favorite pharmacies
7. **Prescription History**
   - List with filters (status, date range, patient)
   - Actions: View, PDF, Renew, Duplicate, Resend Email, Download Audit
8. **Global Search**
   - Universal search bar in header
   - Results categorized by type
   - Advanced filters sidebar
9. **Notification Centre**
   - Bell icon with badge
   - Dropdown for recent notifications
   - Full page for history and settings
10. **Settings**
    - Profile management
    - Preferences (notifications, theme)
    - API keys (if applicable)
    - Device management

## Data Flow
1. User interacts with frontend (Next.js)
2. Frontend sends REST API requests to backend (NestJS)
3. Backend validates request (auth, RBAC, input validation)
4. Backend processes request:
   - Direct database operations (Prisma/PostgreSQL) for CRUD
   - Offloads long-running tasks to BullMQ (PDF generation, email sending, virus scanning)
   - Uses Redis for caching and session storage
   - Emits Socket.IO events for real-time updates (optional)
5. For file operations:
   - Uploads streamed to AWS S3 via pre-signed URLs
   - Virus scanning via ClamAV/third-party API
   - Thumbnails generated and stored
6. Email sent via AWS SES with tracking
7. PDF generated via React PDF (server-side or client-side)
8. Responses sent back to frontend with standardized format
9. Frontend updates UI optimistically where appropriate
10. Audit trail entries created for all sensitive operations

## Security Considerations
- All APIs protected by JWT middleware with role-based access
- Sensitive fields encrypted at rest (AES-256-GCM)
- Transport encryption via TLS 1.3
- CSRF protection via SameSite cookies and anti-CSRF tokens
- Rate limiting and brute force protection
- Input validation and sanitization (XSS, SQL injection prevention)
- Security headers (Helmet.js equivalent: CSP, X-Frame-Options, etc.)
- Regular dependency scanning and updates
- Audit logging for all PHI access and modifications
- Session management with idle and absolute timeouts
- Device fingerprinting and trusted device management
- Password breach detection via HaveIBeenPwned API
- Secure password hashing (bcrypt with salt factor 12+)
- Environment-specific configuration and secrets management

## Development Workflow
- Local development: Docker Compose for all services (PostgreSQL, Redis, MinIO/S3 mock, SES mock)
- Testing: Jest for unit, React Testing Library for frontend, E2E with Cypress
- Code quality: ESLint, Prettier, TypeScript strict mode
- CI/CD: GitHub Actions for linting, testing, building, and deploying
- Feature flags: For gradual rollouts
- Monitoring: Health checks, logging (Winston/Pino), metrics (Prometheus/Grafana)
- Documentation: Storybook for components, Swagger/OpenAPI for API