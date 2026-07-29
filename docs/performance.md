# TruWell Pharmacy Performance Review

## Overview
This document outlines the performance architecture, optimization strategies, and scalability considerations for TruWell Pharmacy, ensuring the system meets responsiveness, throughput, and availability requirements under expected and peak loads.

## Performance Goals

<tool_call>
<function=Write>
<parameter=content>
# TruWell Pharmacy Performance Review

## Overview
This document outlines the performance architecture, optimization strategies, and scalability considerations for Truwell Pharmacy, ensuring the system meets responsiveness, throughput, and availability requirements under expected and peak loads.

## Performance Objectives
- **Page Load Time**: < 2s for 95% of page loads (mobile on 3G, desktop on broadband)
- **API Response Time**: < 200ms for 95% of requests (p95)
- **Throughput**: 
  - 1000 concurrent users
  - 100 prescriptions/minute peak
  - 500 patient searches/hour
- **Availability**: 99.9% monthly uptime (excluding maintenance windows)
- **Scalability**: Horizontal scaling to handle 2x peak load within 5 minutes

## Performance Monitoring & Observability

### Metrics Collection
- **Infrastructure**: 
  - CPU, memory, disk I/O, network (Prometheus node_exporter)
  - Container stats (cAdvisor)
  - Host-level metrics (EC2 CloudTrail, ECS/EKS)
- **Application**: 
  - Custom business metrics (prescriptions created, active consultations)
  - RED metrics (Rate, Errors, Duration) per endpoint
  - Queue depths (BullMQ)
  - Cache hit ratios (Redis)
  - Database performance (pg_stat_statements, connection pool)
- **User Experience**: 
  - Core Web Vitals (LCP, FID, CLS) via web-vitals library
  - Custom timers for critical journeys (consultation wizard, prescription flow)
  - Error tracking (Sentry)
  - Real-user monitoring (RUM) via separate endpoint

### Logging & Tracing
- **Distributed Tracing**: 
  - OpenTelemetry instrumentation across all services
  - Trace ID propagated through request lifecycle
  - Export to Jaeger/Tempo for visualization
- **Structured Logging**: 
  - JSON format with correlation IDs
  - Log levels: error, warn, info, debug, trace
  - Sampling in production (100% errors, 10% requests)
- **Alerting**: 
  - Threshold-based (CPU > 80% for 5min)
  - Anomaly detection (sudden latency spikes)
  - Business metric deviations (e.g., zero prescriptions in 10min)
  - Escalation paths: Slack → PagerDuty → on-call engineer

### Benchmarking & Load Testing
- **Tools**: 
  - k6 for API load testing
  - Lighthouse for frontend performance
  - Gatling for complex scenarios
  - Locust for distributed testing
- **Frequency**: 
  - Weekly performance regression tests in staging
  - Pre-release load testing for major features
  - Quarterly capacity planning exercises
- **Scenarios**: 
  - Steady-state (baseline)
  - Ramp-up (to identify breaking points)
  - Spike (sudden traffic increase)
  - Soak (long-running for memory leaks)
  - Checkout (prescription creation + signing + sending)

## Database Performance Optimization

### PostgreSQL Tuning
- **Connection Pooling**: 
  - PgBouncer in transaction mode
  - Pool size: 20-50 connections per instance (based on RAM)
  - Application pool: HikariCP (Spring) or node-postgres pool (NodeJS)
- **Memory Configuration**: 
  - shared_buffers: 25% of RAM (max 32GB)
  - effective_cache_size: 70% of RAM
  - work_mem: 64MB (adjust based on complex queries)
  - maintenance_work_mem: 256MB
  - wal_buffers: 16MB
- **Query Optimization**: 
  - pg_stat_statements for slow query identification
  - EXPLAIN ANALYZE for query plans
  - Index optimization: 
    - Composite indexes for common filter combinations
    - Partial indexes for filtered tables (e.g., active prescriptions)
    - Covering indexes to avoid heap fetches
  - Avoid SELECT *, use only needed columns
  - Use LIMIT/OFFSET pagination only for small offsets; keyset pagination for large
- **Maintenance**: 
  - VACUUM ANALYZE schedule (autovacuum tuned)
  - Index rebuild schedule (monthly for high-write tables)
  - Statistics update: default_target = 100
- **Connection Limits**: 
  - max_connections = 300 (leave headroom for maintenance)
  - superuser_reserved_connections = 10

### Indexing Strategy
- **Primary Keys**: UUID v4 (random) - consider ulid or ordered UUID for better index locality
- **Foreign Keys**: Indexed automatically in PostgreSQL
- **Common Query Patterns**: 
  - `WHERE tenant_id = X AND status = Y` → composite index
  - `WHERE created_at >= $1` → index on timestamp
  - `WHERE name ILIKE '%term%'` → trigram index (gin)
  - `WHERE jsonb_field @> '{"key":"value"}'` → gin index
- **Index Types**: 
  - B-tree: equality, range, sorting
  - GIN: jsonb, array, full-text search
  - GiST: geometric, network types
  - BRIN: large tables with naturally ordered columns (time-series)
- **Index Maintenance**: 
  - Monitor index bloat (pg_bloat_check)
  - Remove unused indexes (pg_stat_user_indexes)

### Caching Strategy
- **Redis Implementation**: 
  - Version: 7.x
  - Deployment: Redis Elasticache (cluster mode) or self-managed
  - Persistence: AOF with fsync every second (for session store)
- **Cache Layers**: 
  - **L1 (Application)**: 
    - LRU cache (lru-cache) for frequently accessed, small datasets
    - TTL: 5-30 minutes
    - Examples: user permissions, pharmacy lookup
  - **L2 (Distributed)**: 
    - Redis for shared state across instances
    - TTL: 15-60 minutes
    - Examples: 
      - Session store (with rotation)
      - Medical codes (ICD-10, SNOMED)
      - Drug interaction cache
      - Recently viewed patients
      - Aggregated dashboard data (pre-computed)
- **Cache Invalidation**: 
  - Idempotent keys: `resource:id:version`
  - Write-through/update on mutation
  - Publish/subscribe for complex invalidation patterns
  - Fallback to DB on cache miss (with stampede protection)
- **Cache Warming**: 
  - Pre-load known hot data on deployment
  - Background refresh of expiring caches
- **Monitoring**: 
  - Hit ratio target > 90%
  - Memory usage < 80%
  - Eviction rate alerts
  - Latency monitoring (P95 < 1ms for get/set)

### Read Replicas
- **Use Case**: 
  - Reporting queries
  - Non-critical lookups (drug catalog, pharmacy search)
  - Background jobs (analytics, exports)
- **Configuration**: 
  - Asynchronous replication
  - Load balancer (pgbouncer or application-level routing)
  - Lag monitoring (< 5s replica lag acceptable)
  - Automatic failover (Patroni or cloud provider managed)

## Application Performance Optimization

### Frontend (Next.js/React)
- **Bundle Optimization**: 
  - Code splitting: dynamic imports for route-based chunks
  - Prefetching: link prefetch for navigation
  - Tree shaking: eliminate dead code
  - Commons chunk: shared vendors (React, lodash)
  - Budgets: warn > 150KB JS gzipped
- **Image Optimization**: 
  - Next.js Image component with automatic resizing
  - Formats: WebP with fallback
  - Priority: above-the-fold images
  - Lazy loading: below-the-fold
  - Placeholder: blur-up or dominant color
- **Rendering Strategy**: 
  - Server-side rendering (SSR) for SEO and initial load
  - Static generation (SSG) for infrequently changing data
  - Client-side rendering (CSR) for interactive dashboards
  - Incremental Static Regeneration (ISR) for semi-static data
- **State Management**: 
  - Zustand for global state (minimal boilerplate)
  - React Query for server state (caching, deduplication, updates)
  - Local state: useState/useReducer
  - Avoid prop lifting; use context sparingly
- **Rendering Performance**: 
  - React.memo for pure components
  - useCallback/useMemo for expensive computations
  - Virtualized lists (react-window) for >100 items
  - CSS-in-JS (styled-components) with server-side rendering
- **Network Optimization**: 
  - HTTP/2 (or HTTP/3 if supported)
  - DNS prefetch, preconnect for third-party domains
  - Resource hints: rel=preload for critical assets
  - Compression: Brotli (fallback gzip)
  - Caching headers: 
    - immutable for hashed assets
    - max-age=31536000 for static
    - stale-while-revalidate for API responses
- **Critical Rendering Path**: 
  - Inline critical CSS
  - Defer non-critical JS
  - Optimize font loading (font-display: swap)
  - Minimize main-thread work

### Backend (NestJS/Node.js)
- **Process Model**: 
  - Cluster mode: utilize all CPU cores
  - Process manager: PM2 or Kubernetes
  - Graceful shutdown: SIGTERM handling
- **Event Loop Health**: 
  - Avoid synchronous operations in request handlers
  - Offload heavy work to worker threads (worker_threads) or jobs
  - Monitor event loop delay (should < 10ms)
- **Memory Management**: 
  - Heap snapshot analysis for leaks
  - Limit max old space size (--max-old-space-size)
  - Streaming large responses (PDFs, exports)
  - Object pooling for frequent allocations
- **Code Optimization**: 
  - Avoid regex denial of service (ReDoS) - use safe alternatives
  - Prefer map/filter over for loops where applicable
  - Cache expensive computations (lru-cache)
  - Batch database operations
- **Serialization**: 
  - Class-transformer for DTO conversion
  - Avoid deep cloning where possible
  - Stream JSON for large responses
- **Async Patterns**: 
  - Promise.all for parallel independent operations
  - P-limit for concurrency control
  - Avoid async/await in loops (use map + Promise.all)
- **Compression**: 
  - Response compression (gzip/brotli) for text/* 
  - Threshold: 1KB
  - Exclude already compressed assets (images, PDFs)

### Caching Layers
- **HTTP Caching**: 
  - ETag/Last-Modified for static assets
  - Cache-Control: public, max-age=3600 for immutable
  - Stale-while-revalidate for API responses (60s)
- **Application Caching**: 
  - Redis as described above
  - L1 cache for read-heavy, infrequently changing data
- **DNS Caching**: 
  - TTL optimization for service discovery
  - Internal DNS (CoreDNS) with adequate caching

### Asynchronous Processing
- **Job Queues (BullMQ)**: 
  - Redis-backed, reliable, priority queues
  - Queue configuration: 
    - Default: 10 workers
    - High priority (emergency): 5 workers, preemptive
    - Low priority (batch): 2 workers
  - Job scheduling: 
    - Cron for periodic tasks (daily reports)
    - Delayed for retry mechanisms
  - Rate limiting: 
    - Per-job type (e.g., max 10 emails/minute to same domain)
  - Retry strategy: 
    - Exponential backoff (1s, 2s, 4s, max 10m)
    - Dead letter queue after 5 attempts
  - Monitoring: 
    - Dashboard showing wait/processing time
    - Alert on queue depth > 1000
    - Failed job alerts with retry exhaustion
- **Specific Job Types**: 
  - **PDF Generation**: 
    - Resource-intensive (CPU/memory)
    - Timeout: 30 seconds
    - Memory limit: 512MB
    - Concurrent limit
    - Use headless Chrome/Puppeteer with resource limits
  - **Email Sending**: 
    - Rate limited by SES (14 emails/second per account)
    - Template rendering cached
    - Bounce/complaint handling via SNS
  - **Virus Scanning**: 
    - ClamAV daemon or cloud service (AWS GuardDuty/Macro)
    - Timeout: 60 seconds per file
    - Stream file to scanner to avoid memory spikes
    - Quarantine infected files
  - **Data Exports**: 
    - Streaming generation to avoid memory issues
    - Temporary S3 storage with signed URL (15 min expiry)
    - Notification upon completion
  - **Notifications**: 
    - Batch similar notifications (e.g., multiple prescription alerts)
    - Rate limit per recipient (max 5/hour)
    - Priority: critical (immediate), high (5min), normal (30min)

### Frontend-Backend Communication
- **API Design**: 
  - GraphQL consideration: evaluated, REST chosen for simplicity and caching
  - Batch endpoints: `/patients?ids=1,2,3` to reduce round trips
  - Field selection: `_fields=id,name,date` to reduce payload
  - Pagination: cursor-based (keyset) for large datasets
- **Data Transfer Optimization**: 
  - Protobuf evaluation: JSON chosen for debuggability
  - Gzip compression for responses > 1KB
  - Avoid unnecessary nesting
  - Use enums instead of strings where applicable
- **Request Batching**: 
  - Client-side: 
    - React Query automatic batching of identical queries
    - Custom mutators for optimistic updates
  - Server-side: 
    - Middleware to detect and batch identical requests (rare)
- **WebSocket Optimization**: 
  - Message batching: send updates every 100ms if multiple events
  - Heartbeat: every 30 seconds to detect disconnections
  - Room-based broadcasting: 
    - Prescription-specific rooms for status updates
    - User-specific rooms for personal notifications
  - Adaptive scaling: 
    - Increase workers during high notification volume
    - Stateless WebSocket servers behind load balancer

## Infrastructure & Hosting

### Containerization
- **Image Optimization**: 
  - Multi-stage builds (distroless or alpine)
  - Remove debug symbols and unnecessary packages
  - Pin base image versions
  - Scan for vulnerabilities (Trivy)
- **Resource Requests/Limits**: 
  - CPU: request 200m, limit 1000m
  - Memory: request 256Mi, limit 1024Mi
  - Adjust based on profiling
- **Liveness/Readiness Probes**: 
  - Liveness: `/health/live` (simple TCP or HTTP 200)
  - Readiness: `/health/ready` (checks DB, Redis, queue connectivity)
  - Initial delay: 5s, period: 10s
- **Horizontal Pod Autoscaler (HPA)**: 
  - Metrics: CPU utilization (target 60%), custom metrics (queue length)
  - Min replicas: 2, max: 20
  - Stabilization window: 5 minutes to prevent thrashing

### Load Balancing & Traffic Management
- **Load Balancer**: 
  - AWS ALB / NGINX Plus
  - SSL termination at LB
  - Keep-alive connections to backend
  - Health checks: path `/health/ready`, interval 30s, timeout 5s
  - Stickiness: optional for WebSocket (cookie-based)
- **CDN (Content Delivery Network)**: 
  - AWS CloudFront / Cloudflare
  - Caching: 
    - Static assets: max-age=31536000, immutable
    - HTML: max-age=60, stale-while-revalidate=300
    - API: bypass cache (or cache-control: private, no-store)
  - Origin shield: reduce origin load
  - Geographic distribution: edge locations close to users
  - WAF integration: OWASP CRS + custom rules
- **DNS Optimization**: 
  - TTL: 300 seconds for failover flexibility
  - Routing policy: latency-based or geolocation
  - Health checks: primary/secondary endpoint monitoring
  - DNSSEC: enabled for integrity

### Database Hosting
- **Managed Service**: 
  - Amazon RDS Aurora PostgreSQL (recommended)
  - Alternatively: self-managed on EC2 with Patroni
- **Instance Class**: 
  - db.r6g.large (2 vCPU, 16GB RAM) - adjust based on load
  - Storage: gp3 SSD, 500 GB initial, auto-scaling
- **Read Replicas**: 
  - 1-2 replicas for read scaling
  - Separate connection pool for reads
- **Backup**: 
  - Automated daily snapshots
  - Point-in-time recovery (PITR) enabled
  - Cross-region copy for disaster recovery
- **Performance Insights**: 
  - Enable Performance Insights for query analysis
  - Set retention to 7 days
- **Parameter Group**: 
  - Tune based on workload (OLTP)
  - log_min_duration_statement = 500ms (log slow queries)

### Caching Layer Hosting
- **Redis**: 
  - Amazon ElastiCache for Redis (cluster mode enabled)
  - Node type: cache.r6g.large (2 vCPU, 13GB)
  - Replica count: 1 per shard
  - Multi-AZ: enabled
  - Automatic failover: enabled
  - Encryption: in-transit and at-rest
  - Backup: automatic daily snapshots
- **Monitoring**: 
  - CloudWatch metrics: 
    - CPUUtilization, EngineCPUUtilization
    - CacheHitRate (target > 90%)
    - CurrConnections
    - Evictions (should be 0)
  - Redis INFO command for detailed stats

### Storage Optimization
- **Object Storage (S3)**: 
  - Storage Class: 
    - Standard for active files (< 30 days)
    - Intelligent-Tiering for unknown access patterns
    - Glacier Deep Archive for backups (> 365 days)
  - Lifecycle Rules: 
    - Transition to IA after 30 days
    - Archive to Glacier after 365 days
    - Expire incomplete multipart uploads after 7 days
  - Request Optimization: 
    - Use S3 ByteRangeFetcher for partial reads
    - Multipart upload for > 100MB files
    - Enable S3 Transfer Acceleration for geographically dispersed users
  - Access Patterns: 
    - Read-heavy for prescriptions/images
    - Write-heavy for temporary processing
  - Cost Monitoring: 
    - Weekly reports
    - Lambda to delete expired temporary files

### Networking
- **VPC Design**: 
  - CIDR: 10.0.0.0/16
  - Public subnets: 2 AZs for ALB
  - Private subnets: 3 AZs for apps, 2 for DB, 2 for cache
  - NAT Gateways: 2 (one per AZ for AZ isolation)
- **Security Groups**: 
  - Web tier: allow 443 from internet, 80/443 to app tier
  - App tier: allow 5432 from db sg, 6379 from cache sg, 8000 from web sg
  - DB tier: allow 5432 from app sg
  - Cache tier: allow 6379 from app sg
- **Flow Logs**: 
  - Capture rejected traffic for debugging
  - Send to CloudWatch Logs or S3
- **MTU**: 
  - Standard 1500 (check for jumbo frame requirements if using EFA)
  - Path MTU Discovery enabled

## API Rate Limiting & Throttling Strategy

### Global Rate Limits
- **Per IP**: 100 requests/15 minutes (burst 20)
- **Per Authenticated User**: 500 requests/15 minutes (burst 50)
- **Per API Key** (if applicable): 1000 requests/15 minutes (burst 100)

### Endpoint-Specific Limits
- **Authentication Endpoints**: 
  - `/auth/login`: 5 attempts/15 minutes/IP
  - `/auth/mfa/verify`: 10 attempts/15 minutes/IP
  - `/auth/forgot-password`: 3 attempts/15 minutes/IP
- **Resource Intensive Endpoints**: 
  - `/prescriptions/:id/generate-pdf`: 5 requests/minute/user
  - `/documents/upload`: 10 requests/minute/user
  - `/reports/export`: 2 requests/hour/user
- **Webhook Endpoints**: 
  - Rate limit by source IP if applicable
  - Signature verification before processing

### Rate Limiting Implementation
- **Algorithm**: Token bucket (leaky bucket alternative)
- **Storage**: Redis for distributed tracking (Lua scripts for atomicity)
- **Headers**: 
  - `X-RateLimit-Limit`: ceiling
  - `X-RateLimit-Remaining`: remaining tokens
  - `X-RateLimit-Reset`: seconds until reset
  - `Retry-After`: when limit exceeded (seconds)
- **Response**: 
  - 429 Too Many Requests
  - JSON body with error details
  - Retry-After header
- **Exemptions**: 
  - Internal services (via API key or mutual TLS)
  - Health check endpoints
  - Trusted IP ranges (monitoring, CI/CD)

### Adaptive Rate Limiting
- **Baseline**: Normal traffic patterns established
- **Anomaly Detection**: 
  - Sudden spike from single IP/IP range
  - Geographic anomalies (login from unusual country)
  - Behavioral anomalies (rapid-fire requests unlike human)
- **Response**: 
  - Temporary ban (15-60 minutes)
  - Escalating block duration
  - CAPTCHA challenge for suspicious web traffic
  - Notification to security team

## Database Connection Pooling

### Configuration Guidelines
- **Minimum Connections**: 5 (to avoid warm-up delay)
- **Maximum Connections**: 
  - Calculate based on: 
    - DB max_connections 
    - Number of application instances 
    - Desired concurrency per instance
  - Example: 200 max DB connections, 10 instances → 18 per instance (leave 20 for admin)
- **Connection Timeout**: 5 seconds
- **Idle Timeout**: 300 seconds (return to pool after 5 min idle)
- **Max Lifetime**: 30 minutes (prevents memory leaks)
- **Validation**: 
  - On-borrow: simple query (SELECT 1)
  - On-return: optional (if trustworthy)
- **Statement Caching**: 
  - Prepared statement cache size: 100
  - Benefit: reduce parsing overhead

### Pooling Technology
- **Node.js**: 
  - pg-pool (built-in to pg) or generic-pool
  - Idle timeout, max, min configuration
- **Java (if any services)**: 
  - HikariCP (default in Spring Boot)
  - Metrics integration with Micrometer
- **External Proxy**: 
  - PgBouncer for connection multiplexing
  - Modes: 
    - Session: connection per session (default)
    - Transaction: connection per transaction (better utilization)
    - Statement: statement-level pooling (rarely used)
  - Admin console for monitoring

## Load Testing & Capacity Planning

### Load Testing Methodology
- **Tools**: 
  - k6 (primary - scriptable, cloud/remote)
  - JMeter (alternative for complex scenarios)
  - Artillery (for WebSocket testing)
- **Environment**: 
  - Staging mirror of production (same instance types, scaled down 10:1)
  - Isolated from other testing
  - Synthetic data generation matching production distribution
- **Test Data**: 
  - Patient count: 10% of production
  - Prescription volume: scaled accordingly
  - Realistic distribution of demographics, conditions
- **Test Types**: 
  - **Baseline**: Measure current performance
  - **Stress**: Increase load until failure point
  - **Spike**: Sudden increase to 5x normal load
  - **Soak**: Run at expected peak for 8 hours (memory leaks)
  - **Breakdown**: Isolate component performance (API, DB, cache)
- **Metrics Collected**: 
  - Response times (p50, p90, p99)
  - Throughput (requests/second)
  - Error rates (5xx, 4xx)
  - Resource utilization (CPU, memory, disk, network)
  - Business metrics (prescriptions completed, patients seen)
- **Analysis**: 
  - Compare against SLA/SLO
  - Identify bottlenecks (CPU, memory, I/O, network, locks)
  - Recommend scaling or optimization

### Capacity Planning Process
- **Baseline Establishment**: 
  - Measure current peak utilization
  - Document trends (weekly, monthly, seasonal)
- **Growth Modeling**: 
  - Linear regression on historical data
  - Business projections (new clinics, marketing campaigns)
  - Event-based spikes (flu season, public health initiatives)
- **Resource Projection**: 
  - Convert utilization to required resources
  - Add safety margin (30-50%)
  - Consider scaling limitations (e.g., DB vertical limits)
- **Scenarios**: 
  - Baseline (current trend)
  - Growth (10% MoM)
  - Burst (2x peak for 2 hours)
  - Worst-case (combination of growth + burst)
- **Review Cycle**: 
  - Quarterly formal review
  - Ad-hoc for major changes
  - Continuous monitoring for 자동 scaling triggers

### Auto-Scaling Policies
- **Horizontal Pod Autoscaler (HPA)**: 
  - Metrics: 
    - CPU utilization (target 65%)
    - Memory utilization (target 70%)
    - Custom metrics (queue length, request rate)
  - Behavior: 
    - Scale up: 
      - Stabilization window: 0 seconds (fast response)
      - Rate: 100% per minute (can double quickly)
    - Scale down: 
      - Stabilization window: 5 minutes (prevent thrashing)
      - Rate: 10% per minute (gentle decline)
- **Custom Metrics Adapter**: 
  - Exposes application metrics (e.g., prescription queue depth)
  - Enables scaling based on business demand
- **Cluster Autoscaler**: 
  - Adjusts node count based on pod scheduling needs
  - Min/max node groups defined
  - Balances cost vs. responsiveness
- **Database Scaling**: 
  - Vertical: upgrade instance size (during maintenance window)
  - Horizontal: read replicas, sharding (future consideration)
  - Storage: auto-scaling enabled

## Performance Optimization Techniques

### Database-Specific Optimizations
- **Connection Pooling**: as detailed above
- **Query Optimization**: 
  - Use EXISTS instead of COUNT > 0 for existence checks
  - Limit columns in SELECT to only needed fields
  - Use appropriate JOIN types (INNER vs LEFT)
  - Avoid functions on indexed columns in WHERE (use range)
  - Use BETWEEN for date ranges instead of >= AND <=
- **Indexing**: 
  - Covering indexes for frequent queries
  - Include columns to avoid heap fetches
  - Partial indexes for filtered tables (WHERE status = 'active')
  - BRIN indexes for large time-series tables (audit logs)
- **Partitioning**: 
  - Range partitioning by date for high-volume tables
    - Example: audit_logs partitioned by month
    - Benefits: faster drops, improved partition pruning
  - Consider partitioning by tenant for multi-tenancy isolation
- **Materialized Views**: 
  - For expensive aggregations (daily/weekly reports)
  - Refresh strategy: 
    - On-demand for low-frequency reports
    - Concurrent refresh for high-frequency needs
- **Read Replicas**: 
  - Offload reporting and analytics
  - Use synchronous commit for critical read-after-write
  - Monitor replication lag

### Application-Level Optimizations
- **Caching**: 
  - As detailed in caching strategy
  - Cache-aside pattern with fallback
  - Write-through for critical data
  - Refresh-ahead for predictably accessed data
- **Data Fetching**: 
  - Batch requests where possible (GraphQL-like)
  - Prefetch related data to avoid N+1 queries
  - Use DTOs to avoid over-fetching
  - Select only needed columns (avoid SELECT *)
- **Concurrency Control**: 
  - Optimistic locking with version column (as in schema)
  - Pessimistic locking only when necessary (SELECT FOR UPDATE)
  - Avoid long-running transactions
  - Set statement timeout: `SET statement_timeout = '30s'`
- **Resource Management**: 
  - Stream large file processing (PDFs, exports)
  - Use pagination for large result sets
  - Implement circuit breaker for external dependencies
  - Bulkhead pattern: separate thread pools for different services
- **Algorithm Optimization**: 
  - Choose appropriate data structures (Map vs Object for lookups)
  - Precompute expensive values (e.g., risk scores)
  - Use efficient algorithms (O(n log n) vs O(n^2))
  - Cache intermediate results in multi-step processes

### Frontend Optimizations
- **Code Splitting**: 
  - Route-based splitting (built-in Next.js)
  - Component-level splitting for large libraries (charts, maps)
  - Dynamic import() with loading state
- **Asset Optimization**: 
  - Images: 
    - Responsive sizes (srcset)
    - Modern formats (WebP, AVIF)
    - Compression (Squoosh, ImageOptim)
  - Fonts: 
    - Subsetting (only needed glyphs)
    - woff2 format
    - Preload critical fonts
  - CSS: 
    - Critical path CSS inlining
    - Unused CSS removal (PurgeCSS)
    - CSS modules for scoping
- **Rendering Optimization**: 
  - Virtual scroll for long lists (react-window, react-virtual)
  - Windowing for tables (react-virtualized)
  - Memoization of expensive components (React.memo)
  - useMemo for derived data
  - useCallback for event handlers passed down
- **Network Optimization**: 
  - HTTP/2 multiplexing
  - Preload critical resources (fonts, hero images)
  - Prefetch for predicted navigation (next/link)
  - DNS prefetch for third-party domains
  - Preconnect for TLS handshake optimization
  - Prioritize requests (fetch with priority: 'high')
- **State Management**: 
  - Normalize state shape (avoid duplication)
  - Selective subscription (only listen to needed changes)
  - Debounce rapid updates (e.g., search input)
  - Optimistic updates for immediate feedback
  - Garbage collection: remove unused data from store
- **Offline Capability**: 
  - Service workers for static assets (Workbox)
  - Background sync for non-critical updates
  - Queue local actions for when online
  - Clear cache strategy (versioned cache names)

## Specific Component Performance

### Consultation Wizard
- **Optimizations**: 
  - Step-level data persistence (localStorage + auto-save)
  - Lazy load heavy components (e.g., anatomy diagrams)
  - Debounce vitals input (no API call per keystroke)
  - Cache frequent lookups (ICD-10 codes, SNOMED terms)
  - Minimize re-renders: memoize form fields
  - Web Worker for heavy calculations (risk scores, dosage calculations)
- **Loading States**: 
  - Skeleton screens for each step
  - Progressive loading: essential fields first, enhanced later
  - Placeholder content for slow-loading elements

### Prescription Management
- **Optimizations**: 
  - Medicine search: 
    - Debounce (300ms)
    - Cache results (5-minute TTL)
    - Show recent searches
    - Limit results to 10
  - Auto-save draft every 20 seconds
  - Optimistic UI for adding/removing medications
  - Virtual scroll for long medication lists
  - Print-specific CSS for clean PDF generation
- **Performance Budgets**: 
  - Initial load: < 1.5s
  - Interaction response: < 100ms
  - PDF generation: < 5s (95th percentile)

### Patient Search
- **Optimizations**: 
  - Debounce: 300ms
  - Show loading skeleton
  - Highlight matches in results
  - Group results by type (exact match first, then fuzzy)
  - Recent searches sidebar (localStorage)
  - Faceted search: filter by gender, age range, registration date
  - Index optimization: 
    - Trigram index on name, nhs_number, phone
    - Composite index on (created_at DESC) for recent patients
- **Results Pagination**: 
  - Keyset pagination using created_at DESC, id DESC
  - Avoid OFFSET for deep paging

### Dashboard
- **Optimizations**: 
  - Data freshness tiers: 
    - Real-time: active consultations, queue status
    - Near real-time (1min): today's counts
    - Hourly: trend charts
    - Daily: weekly/monthly reports
  - Caching strategy per widget
  - Skeleton loaders while data loads
  - Error boundaries per widget (isolate failures)
  - Lazy load off-screen tabs
  - Chart optimization: 
    - Downsample large datasets (e.g., show max 100 points)
    - Use canvas-based charts (Chart.js, Recharts) over SVG for large data
    - Virtualize legend if many items
- **Refresh Strategy**: 
  - Polling: 30 seconds for critical data
  - WebSocket: real-time updates for active items
  - Manual refresh: pull-to-refresh on mobile
  - Stale-while-revalidate: show cached data while fetching fresh

### Document Management
- **Optimizations**: 
  - Upload: 
    - Chunked upload for large files (>5MB)
    - Parallel chunk upload
    - Progress per chunk
    - Client-side hashing for integrity
    - Virus scan during upload (streaming)
  - Download: 
    - Stream directly from S3 (no intermediate buffering)
    - Range requests for partial downloads
    - Cached URLs (signed, short-lived)
  - Thumbnails: 
    - Generate asynchronously
    - Cache aggressively (long TTL)
    - Lazy load in grid (intersection observer)
  - Search: 
    - Filename, metadata, OCR text (if enabled)
    - Pagination with sorting
  - Versioning: 
    - Diff view for text files
    - Side-by-side for images

## Performance Testing Results (Baseline)
*Note: These are target baselines to be validated during performance testing*

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| Homepage Load (3G) | < 2s | Lighthouse |
| API Response (p95) | < 200ms | k6 |
| Concurrent Users | 1000 | k6 |
| Prescription Creation | < 2s end-to-end | k6 + frontend |
| PDF Generation | < 5s (95%) | k6 |
| Search Response | < 300ms (p95) | k6 |
| Database Query (p95) | < 50ms | pg_stat_statements |
| Cache Hit Ratio | > 90% | Redis INFO |
| Error Rate | < 0.1% | Sentry/CloudWatch |
| Availability | 99.9% | Health checks |

## Optimization Roadmap

### Short-term (0-3 months)
- [ ] Implement query caching layer for frequent lookups
- [ ] Add Redis cluster for improved cache performance
- [ ] Optimize top 10 slowest queries identified in staging
- [ ] Implement image next-gen formats in Next.js
- [ ] Add bundle analyzer to CI/PR process
- [ ] Implement server-side rendering for public pages
- [ ] Add CDN for static assets with appropriate caching
- [ ] Optimize Docker images (multi-stage, distroless)
- [ ] Implement request/response compression middleware
- [ ] Add client-side caching for static data (service workers)

### Medium-term (3-6 months)
- [ ] Implement read replica routing for reporting queries
- [ ] Add materialized views for complex aggregations
- [ ] Optimize frontend bundle with dynamic imports for heavy charts
- [ ] Implement advanced autocomplete with virtual scrolling
- [ ] Add database connection pooling metrics to monitoring
- [ ] Implement circuit breaker for external APIs (SES, S3)
- [ ] Add request ID tracing across services
- [ ] Optimize authentication flow (reduce round trips)
- [ ] Implement batch endpoints for bulk operations
- [ ] Add performance budgets to CI (fail build if exceeded)

### Long-term (6-12 months)
- [ ] Evaluate database sharding for multi-tenancy scaling
- [ ] Implement GraphQL API for flexible data fetching
- [ ] Add predictive autoscaling based on historical patterns
- [ ] Implement edge computing for latency-sensitive features
- [ ] Add real-time analytics pipeline (Kafka + Flink)
- [ ] Optimize for mobile-specific performance (reduced payload)
- [ ] Implement advanced image optimization (client-side resizing)
- [ ] Add synthetic transaction monitoring
- [ ] Implement chaos engineering for resilience testing
- [ ] Add performance regression testing in CI

## Capacity Planning Guidelines

### Resource Allocation Principles
- **CPU**: 
  - Target average utilization: 60%
  - Peak capacity: 80% (allows for bursts)
  - Monitor: context switches, run queue length
- **Memory**: 
  - Target usage: 70%
  - Reserve for buffers/cache: 20%
  - Monitor: swap usage, page faults
- **Storage I/O**: 
  - Target utilization: 50%
  - Monitor: await, iops, throughput
  - Use SSD for predictable performance
- **Network**: 
  - Target utilization: 60%
  - Monitor: packet errors, retransmissions
  - Ensure full duplex operation
- **Database Connections**: 
  - Utilization: 70% of max_connections
  - Monitor: idle in transaction, waiting locks

### Scaling Triggers
- **Scale Up When**: 
  - CPU > 75% for 5 minutes
  - Memory > 80% for 5 minutes
  - Queue depth > 1000 for 2 minutes
  - API error rate > 2% for 5 minutes
  - Response time p95 > 500ms for 5 minutes
- **Scale Down When**: 
  - CPU < 30% for 15 minutes
  - Memory < 40% for 15 minutes
  - Queue depth < 100 for 10 minutes
  - Stable low error rates
- **Cooldown Periods**: 
  - Scale up: 1 minute (rapid response)
  - Scale down: 5 minutes (prevent thrashing)

### Cost Optimization
- **Right-sizing**: 
  - Quarterly review of instance types
  - Use compute-optimized for CPU-heavy, memory-optimized for RAM-heavy
- **Spot Instances**: 
  - Use for fault-tolerant workloads (batch jobs, workers)
  - Mix with on-demand for base capacity
  - Capacity rebalancing automation
- **Reserved Instances**: 
  - 1-year no-upfront for predictable baseline
  - Consider convertible for flexibility
- **Storage Optimization**: 
  - Lifecycle policies as described
  - Delete old logs and temporary files
  - Compress infrequently accessed data
- **License Optimization**: 
  - Use open-source alternatives where feasible
  - Track subscription usage vs. need
- **Architecture Efficiency**: 
  - Improve hit ratios to reduce compute needs
  - Optimize queries to reduce database load
  - Cache aggressively to reduce redundant work

## Emergency Procedures

### Performance Degradation Response
1. **Detection**: 
   - Alert from monitoring (latency, error rate)
   - User reports via support channel
2. **Initial Assessment**: 
   - Check dashboard for systemic vs. isolated issue
   - Review recent deployments/changes
   - Examine error logs for patterns
3. **Immediate Mitigation**: 
   - Scale up if resource constrained
   - Clear problematic caches (if cache corruption suspected)
   - Disable non-essential features (feature flags)
   - Redirect traffic to healthy instances (if applicable)
4. **Diagnosis**: 
   - Enable detailed profiling (slow query log, profiler, CPU profiler)
   - Check resource utilization trends
   - Review recent changes in dependencies or configuration
5. **Resolution**: 
   - Apply fix (rollback, configuration change, scaling)
   - Verify recovery with synthetic transactions
   - Gradually restore normal operations
6. **Post-Incident**: 
   - Document root cause and timeline
   - Update runbooks if needed
   - Consider preventive measures (additional monitoring, alerts)

### Emergency Scaling
- **Pre-approved Scaling**: 
  - Define maximum allowable scale (cost ceiling)
  - Pre-warm images/containers
  - Automated scripts for rapid scaling
- **Communication Plan**: 
  - Status page updates
  - Internal team notification channels
  - Customer notification if SLA impacted
- **Rollback Procedure**: 
  - Database: point-in-time recovery if needed
  - Application: blue/green rollback or previous version deploy
  - Configuration: git rollback or manual restore

## Conclusion
Performance is a continuous journey requiring monitoring, testing, and optimization. By implementing the strategies outlined in this document, TruWell Pharmacy will deliver a responsive, scalable, and reliable experience for healthcare providers and patients while maintaining cost efficiency and operational stability. Regular review and adaptation to changing usage patterns and technological advances will ensure sustained performance excellence.