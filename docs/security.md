# TruWell Pharmacy Security Review

## Overview
This document outlines the security architecture, controls, and compliance considerations for TruWell Pharmacy, a healthcare SaaS platform managing sensitive patient health information (PHI) and prescription data.

## Compliance Framework
TruWell Pharmacy adheres to:
- **UK NHS Data Security and Protection Toolkit (DSPT)**
- **General Data Protection Regulation (GDPR)**
- **Data Protection Act 2018 (UK)**
- **Cyber Essentials Plus**
- **ISO 27001** (target)

## Authentication & Authorization

### JWT Lifecycle
- **Access Token**: Short-lived (15 minutes), signed with RS256, stored in memory (not localStorage)
- **Refresh Token**: Long-lived (7 days), HTTP-only, Secure, SameSite cookie, rotated on use
- **Token Issuance**: 
  - Password grant: validated against bcrypt hash (salt factor 12+)
  - MFA grant: validated TOTP (Time-based One-Time Password) or Email OTP
- **Revocation**: 
  - Refresh tokens stored in database with JTI (JWT ID) claims
  - On logout/password change: all refresh tokens for user invalidated
  - Suspicious activity: selective token revocation

### Multi-Factor Authentication (MFA)
- **Primary**: TOTP (Google Authenticator, Authy) - RFC 6238
- **Backup**: Email OTP (6-digit, expires 10 minutes)
- **Recovery**: Single-use recovery codes (generated during setup, regenerate after use)
- **Remember Device**: Optional, encrypted cookie with device fingerprint, expires 30 days
- **MFA Enforcement**: 
  - Required for: prescription signing, sending, PHI access, admin actions
  - Adaptive: triggered by risk signals (new device, unusual location)

### Role-Based Access Control (RBAC)
- **Roles**: 
  - Super Admin (system configuration)
  - Pharmacy Owner (billing, settings)
  - Pharmacy Staff (daily operations)
  - Prescriber (prescription creation, signing)
- **Permissions**: Fine-grained matrix (Resource → Action → Conditions)
  - Example: `Prescription:sign` requires `role=PRESCRIBER` AND `status=READY_FOR_SIGNATURE`
- **Implementation**: Custom NestJS guard (`RolesGuard`) and decorator (`@Roles`)
- **Condition Checking**: Resource ownership, workflow state, tenant isolation

### Session Management
- **Session Store**: Redis with TTL matching access token lifetime
- **Concurrent Sessions**: Configurable limit (default: 3), oldest session invalidated on exceed
- **Session Hijacking Prevention**: 
  - IP address binding (optional, configurable)
  - User-Agent hash validation
  - Regular rotation of session encryption keys

### Password Policy
- **Length**: Minimum 12 characters
- **Complexity**: At least one uppercase, lowercase, number, special character
- **Breach Protection**: 
  - Integration with HaveIBeenPwned API (k-anonymity model)
  - Blocked passwords: common passwords, dictionary attacks, previous breaches
- **History**: Prevent reuse of last 5 passwords
- **Rate Limiting**: 5 attempts per 15 minutes per IP/account
- **Reset**: Secure token (cryptographically random, 32 bytes), expires 1 hour

## Data Protection

### Encryption Strategy
- **At Rest**:
  - **Database**: 
    - PHI fields (NHS number, full name, DOB, address) encrypted with AES-256-GCM
    - Encryption keys managed via AWS KMS (or HashiCorp Vault)
    - Key rotation: annual, manual trigger available
  - **File Storage (S3)**: 
    - Server-side encryption with S3-Managed Keys (SSE-S3) or SSE-KMS for highly sensitive
    - Bucket policies enforce encryption
  - **Backups**: 
    - Encrypted with same keys as source
    - Stored in separate region/account
- **In Transit**:
  - TLS 1.3 enforced (minimum)
  - HSTS header with max-age=31536000, includeSubDomains
  - Perfect Forward Secrecy (ECDHE cipher suites)
  - Certificate pinning for mobile clients (if applicable)

### Secrets Management
- **Sources**: 
  - Environment variables (non-secrets only)
  - AWS Secrets Manager (production)
  - HashiCorp Vault (alternative)
  - Local encrypted file (development, gitignored)
- **Secrets Include**: 
  - Database passwords
  - JWT signing keys
  - Encryption keys
  - Third-party API keys (AWS SES, S3, etc.)
  - Email credentials
- **Rotation**: Automated via CI/CD pipeline or scheduled Lambda functions

### Data Minimization & Retention
- **PHI Storage**: Only store necessary data for prescription fulfillment
- **Retention Policies** (configurable per tenant):
  - Prescriptions: 10 years (legal requirement)
  - Patient records: 8 years after last activity
  - Audit logs: 6 years
  - Transaction logs: 3 years
- **Anonymization**: 
  - Pseudonymization for analytics (reports
  - Aggregate data for dashboards
  - Right to erasure implemented via soft delete + background purge

## Application Security

### Input Validation & Sanitization
- **Server-side**: 
  - Class-validator with custom decorators
  - Whitelist validation where possible
  - Sanitization for HTML output (DOMPurify equivalent)
- **Client-side**: 
  - React Hook Form with Yup/Zod validation
  - Output escaping in JSX (automatic in React)
- **SQL Injection**: 
  - Prisma ORM prevents injection via parameterized queries
  - Raw queries prohibited; if unavoidable, use parameterized raw
- **NoSQL Injection**: N/A (using PostgreSQL)
- **Command Injection**: Avoid shell commands; use child_process with argument array if necessary
- **XXE**: XML parsing disabled; if required, use secure processors (defusedxml)

### Cross-Site Scripting (XSS)
- **Defense**: 
  - React auto-escapes text content
  - dangerouslySetInnerHTML prohibited; if used, sanitized with DOMPurify
  - CSP header: `default-src 'self'; script-src 'self' 'unsafe-inline' (only if required); style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';`
  - X-XSS-Protection: 1; mode=block
  - Content-Type options nosniff

### Cross-Site Request Forgery (CSRF)
- **Protection**: 
  - SameSite cookies (Strict) for session/auth cookies
  - Double-submit cookie for API endpoints (if needed)
  - Custom header verification (`X-XSRF-TOKEN`) for state-changing operations
  - CORS policies: restrict to trusted origins

### Security Headers (Helmet.js equivalent)
```
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
X-Powered-By: 
```

### API Security
- **Rate Limiting**: 
  - Global: 100req/15min/IP
  - Auth: 5req/15min/IP
  - Sensitive endpoints (prescription signing): 10req/15min/user
  - Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Request Validation**: 
  - Content-Type enforcement
  - Body size limits (2MB JSON, 10MB multipart)
  - Schema validation (JSON Schema or class-validator)
- **Response Security**: 
  - No sensitive data in error messages
  - Stack traces hidden in production
  - JSON vulnerability protection: prefix `while(1);` for GET (if needed)
- **HTTP Methods**: 
  - Strict adherence to REST semantics
  - OPTIONS returns CORS preflight
  - TRACE blocked

## Infrastructure & Network Security

### Network Segmentation
- **VPC**: Isolated virtual network with public/private subnets
- **Web Tier**: Public subnet (ALB, EC2/Fargate)
- **App Tier**: Private subnet (ECS/EKS, no direct internet)
- **Data Tier**: Private subnet (RDS, ElastiCache) with security groups
- **Security Groups**: 
  - Allow only necessary ports/protocols between tiers
  - SSH/RDS access only from bastion host or specific CIDR
- **NACLs**: Stateless rules as additional layer

### Monitoring & Logging
- **Centralized Logging**: 
  - All services send logs to CloudWatch Logs / ELK stack
  - Structured JSON format with correlation IDs
  - Retention: 30 days (hot), archive to S3 Glacier (long-term)
- **Log Contents**: 
  - Access logs (timestamp, IP, user, endpoint, status)
  - Error logs (stack traces, context)
  - Audit logs (see below)
  - Never log PHI, passwords, tokens
- **Metrics & Alerting**: 
  - CloudWatch Prometheus / Grafana
  - Key metrics: error rates, latency, throughput, auth failures
  - Alerts: 
    - Auth failure spike (>5/min)
    - Unusual data export volume
    - Privilege escalation attempts
    - WAF blocked requests
- **WAF (Web Application Firewall)**: 
  - AWS WAF / Cloudflare
  - OWASP Core Rule Set
  - Custom rules: 
    - SQLi patterns
    - XSS payloads
    - Path traversal
    - Bot management (rate-based rules)

### Vulnerability Management
- **Dependency Scanning**: 
  - Snyk / Dependabot in CI/CD
  - Daily scans, automated PRs for updates
  - CVE severity thresholds: block on critical/high
- **Container Scanning**: 
  - Trivy / Amazon ECR image scanning
  - Base images updated weekly
- **Static Analysis**: 
  - SonarQube / ESLint security plugins
  - Security hotspots reviewed in PRs
- **Penetration Testing**: 
  - Annual external pentest
  - Quarterly internal red team exercises
  - Bug bounty program (HackerOne/Intigriti)

## Audit Logging & Monitoring

### Audit Log Design
- **Immutability**: 
  - Write-once storage (S3 Object Lock in governance mode)
  - Append-only database table with triggers preventing updates/deletes
- **Coverage**: 
  - All PHI access (read/write)
  - Authentication events (login, logout, MFA, password change)
  - Authorization changes (role/permission modifications)
  - Data exports and downloads
  - System configuration changes
  - Privileged operations (su, sudo equivalent)
- **Fields**: 
  - `event_id` (UUID)
  - `timestamp` (UTC)
  - `user_id` (with tenant)
  - `session_id`
  - `event_type` (enum)
  - `entity_type` and `entity_id`
  - `action` (CREATE, READ, UPDATE, DELETE, EXPORT, PRINT, SIGN, SEND)
  - `outcome` (SUCCESS, FAILURE)
  - `ip_address` (with geolocation lookup)
  - `user_agent`
  - `request_id` (for tracing)
  - `changes` (JSON diff for updates)
  - `risk_score` (calculated based on context)
- **Retention**: 6 years (encrypted, tamper-evident)
- **Analysis**: 
  - SIEM integration (Splunk, Azure Sentinel)
  - UEBA (User and Entity Behavior Analytics)
  - Real-time alerting on suspicious patterns:
    - Bulk PHI access
    - Access outside business hours
    - Privilege escalation attempts
    - Failed MFA attempts

### Session & Activity Monitoring
- **Real-time Dashboard**: 
  - Active sessions per user
  - Geographic access map
  - Device fingerprint list
- **Idle Timeout**: 15 minutes of inactivity (extendable with activity)
- **Absolute Timeout**: 8 hours (requires re-auth)
- **Device Management**: 
  - Trusted devices list (max 5)
  - New device notification via email
  - Device revocation from account settings

## Incident Response & Recovery

### Breach Response Plan
- **Detection**: 
  - Automated alerts from monitoring
  - Manual reports via security@truwell.pharmacy
- **Containment**: 
  - Isolate affected systems
  - Revoke compromised tokens/sessions
  - Block malicious IPs
- **Eradication**: 
  - Remove malware/backdoors
  - Patch vulnerabilities
  - Reset credentials
- **Recovery**: 
  - Restore from clean backups
  - Verify system integrity
  - Gradual traffic resumption
- **Notification**: 
  - Regulatory (ICO) within 72 hours
  - Affected individuals (if high risk)
  - Internal stakeholders
- **Post-Incident**: 
  - Root cause analysis report
  - Lessons learned update to controls
  - External communication (if required)

### Disaster Recovery
- **RPO**: 4 hours (transaction log shipping)
- **RTO**: 2 hours (failover to secondary region)
- **Backup Strategy**: 
  - Daily full + hourly incremental
  - Cross-region replication
  - Regular restore testing (quarterly)
- **Alternate Processing**: 
  - Manual prescription processing procedure
  - Communication plan for pharmacies (phone, email)

## Secure Development Lifecycle (SDL)

### Security Training
- **Mandatory**: 
  - Secure coding practices (OWASP Top 10)
  - Privacy and data handling
  - Incident reporting procedures
- **Role-based**: 
  - Developers: threat modeling, code review
  - QA: security test cases
  - DevOps: infrastructure hardening

### Threat Modeling
- **Performed**: 
  - During design phase for new features
  - Annual review of existing architecture
  - Methodology: STRIDE or PASTA
- **Output**: 
  - Security requirements
  - Control mitigations
  - Residual risk acceptance

### Code Review
- **Checklist**: 
  - Input validation
  - Authentication/authorization checks
  - Secure error handling
  - No secrets in code
  - Dependency validation
- **Tools**: 
  - Pull request checks (GitHub Actions)
  - Manual review by security champion

### Testing
- **Static Application Security Testing (SAST)**: 
  - Integrated in CI (Semgrep, SonarQube)
- **Dynamic Application Security Testing (DAST)**: 
  - Quarterly scans (OWASP ZAP, Burp Suite)
- **Interactive Application Security Testing (IAST)**: 
  - During QA/staging (Contrast Security)
- **Penetration Testing**: 
  - As described above
- **Dependency Checks**: 
  - npm audit, cargo audit, etc.

### Deployment Security
- **Immutable Infrastructure**: 
  - Infrastructure as Code (Terraform/CDK)
  - Golden AMIs/images
  - No SSH to production instances
- **Secrets Injection**: 
  - At runtime via secret manager (no baking into images)
- **Blue/Green Deployments**: 
  - Traffic shifting with verification
  - Automated rollback on health check failure
- **Feature Flags**: 
  - LaunchDarkly or similar for controlled rollout
  - Kill switch for critical features

## Third-Party & Supply Chain Security

### Vendor Management
- **Due Diligence**: 
  - Security questionnaires (SIG Lite)
  - SOC 2 Type II reports required for critical vendors
  - Data Processing Agreements (DPA) with GDPR clauses
- **Monitoring**: 
  - Annual reassessment
  - Continuous monitoring via security ratings (BitSight, SecurityScore)

### API Security (Third-Party)
- **Outbound Calls**: 
  - API key rotation (90 days)
  - IP allowlisting where possible
  - Response validation (schema, size)
  - Timeout and retry limits
- **Inbound APIs**: 
  - Same protections as internal APIs
  - Rate limiting per partner
  - Mutual TLS (mTLS) for high-risk integrations

### Open Source Software
- **Inventory**: 
  - SBOM (Software Bill of Materials) generated with each build
  - Tools: Syft, CycloneDX
- **License Compliance**: 
  - FOSSology or ScanCode
  - Copyleft obligations tracked
- **Vulnerability Response**: 
  - Subscribe to security mailing lists
  - Automatic updates for critical patches

## Privacy Considerations

### Consent Management
- **Explicit Consent**: 
  - For marketing communications
  - For data sharing with third parties (non-treatment)
  - Granular opt-in/opt-out
- **Implied Consent**: 
  - For treatment, payment, healthcare operations
  - Documented in terms of service
- **Withdrawal**: 
  - Single-click unsubscribe in emails
  - Account settings for data sharing preferences

### Data Subject Rights (GDPR)
- **Right to Access**: 
  - `/privacy/export/:userId` endpoint
  - Provides structured JSON of all personal data
- **Right to Rectification**: 
  - Profile editing endpoints
  - Audit trail of changes
- **Right to Erasure**: 
  - `/privacy/delete/:userId` (admin only, with verification)
  - Soft delete followed by background purge
- **Right to Restrict Processing**: 
  - Flag in user profile honoring in all operations
- **Right to Data Portability**: 
  - Export in standard format (FHIR, CSV, JSON)
- **Right to Object**: 
  - For direct marketing: immediate effect
  - For profiling: case-by-case assessment

### Privacy by Design
- **Data Mapping**: 
  - Automated discovery of PHI stores
  - Regular updates to data flow diagrams
- **Privacy Impact Assessments (PIA)**: 
  - Required for new features processing PHI
  - Conducted before development begins
- **Privacy Testing**: 
  - Automated tests for data minimization
  - Manual review of data exports

## Security Metrics & Reporting

### Key Security Indicators (KSIs)
- **Mean Time to Detect (MTTD)**: Target < 1 hour
- **Mean Time to Respond (MTTR)**: Target < 4 hours
- **Vulnerability Remediation Time**: 
  - Critical: 48 hours
  - High: 2 weeks
  - Medium: 30 days
- **Phishing Click Rate**: Target < 1% (quarterly simulation)
- **Security Training Completion**: Target 100% quarterly
- **Third-Party Assessment Score**: Target > 80/100
- **Audit Log Completeness**: Target 99.9% (no gaps)

### Reporting
- **Internal**: 
  - Monthly security steering committee
  - Quarterly board report
  - Real-time dashboard (SOC)
- **External**: 
  - Annual SOC 2 Type II report (available under NDA)
  - Penetration test summary (redacted)
  - Compliance certificates (DSPT, Cyber Essentials)
  - Transparency link: security.truwell.pharmacy

## Continuous Improvement

### Feedback Loops
- **Bug Bounty**: 
  - Public program with tiered rewards
  - Responsible disclosure policy
- **Security Champions**: 
  - Embedded in each development team
  - Monthly knowledge sharing sessions
- **Learning from Incidents**: 
  - Blameless post-mortems
  - Update to runbooks and training

### Emerging Threats
- **AI/ML Security**: 
  - Adversarial input validation
  - Model poisoning prevention
  - Data drift monitoring
- **Zero Trust**: 
  - Microsegmentation
  - Continuous authentication
  - Just-in-time access
- **Quantum Ready**: 
  - Algorithm agility in crypto libraries
  - Preparation for post-quantum cryptography

## Conclusion
TruWell Pharmacy implements a defense-in-depth strategy tailored to healthcare data sensitivity. Security is treated as a continuous process, integrated into every layer of the organization and technology stack. Regular assessments, testing, and adaptation ensure resilience against evolving threats while maintaining regulatory compliance and patient trust.