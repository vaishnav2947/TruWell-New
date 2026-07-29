model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String?  // For password auth, null if only OAuth
  firstName     String
  lastName      String
  role          UserRole @default(PHARMACY_STAFF)
  phone         String?
  isActive      Boolean  @default(true)
  isVerified    Boolean  @default(false)
  mfaSecret     String?  // For TOTP
  mfaEnabled    Boolean  @default(false)
  resetToken    String?  // Password reset token
  resetTokenExpires DateTime? // Expiry for reset token
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  refreshTokens RefreshToken[]
  sessions      Session[]
  auditLogs     AuditLog[] @relation("actor")
  // Relations
  patients      Patient[] @relation("createdBy")
  consultations Consultation[] @relation("createdBy")
  prescriptions Prescription[] @relation("createdBy")
  documents     Document[] @relation("uploadedBy")
  timelineEvents TimelineEvent[] @relation("createdBy")
  notifications Notification[] @relation("recipient")
}