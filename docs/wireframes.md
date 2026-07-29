# TruWell Pharmacy Wireframes

## Design Principles
- Bottle Green (#1F5E4A) as primary color
- Orange (#F28C28) for buttons, notifications, highlights
- Clean, spacious layout with ample white space
- Rounded corners (8px radius) on cards, buttons, inputs
- Subtle shadows (0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06))
- Lucide icons for consistency
- Responsive design: mobile-first approach
- Dark mode available (background: #0F1E19)

## Layout Structure
All pages use consistent layout:
- Fixed left sidebar (collapsible on mobile)
- Top header bar (fixed on scroll)
- Main content area with padding
- Footer (optional, for small print)

### Sidebar
- Width: 240px (collapsed to 64px icon-only)
- Background: #1F5E4A (primary)
- Text color: white
- Active item background: rgba(255,255,255,0.1)
- Logo section at top (TruWell Pharmacy logo)
- Navigation sections:
  - Dashboard
  - Patients
  - Consultations
  - Prescriptions
  - Pharmacy Finder
  - Documents
  - Notifications
  - Reports
  - Settings (user-specific)
  - Admin (only for admins)

### Header
- Height: 64px
- Background: white
- Display: flex, justify-content: space-between, align-items: center
- Padding: 0 1rem
- Z-index: 30
- Left section:
  - Logo: height 32px
  - Title: hidden on md:block, text-xl font-semibold
- Right section:
  - Space x: space-x-3
  - Notification badge: relative position with dot indicator
  - Avatar: size h-8 w-8, border-radius full
  - Dropdown menu: same as select dropdown

## Key Screens

### 1. Login Page
- Centered card on full-screen background (subtle pattern)
- Logo at top
- Form fields: Email, Password
- Forgot password link below
- Login button (orange, full width)
- Remember me checkbox
- Signup link (for admin-only registration)
- Footer with version number

### 2. Dashboard
#### Overview Cards (Grid)
- Today's Consultations (number + trend arrow)
- Today's Prescriptions (number + trend)
- Pending Signature (count requiring pharmacist signature)
- Awaiting MFA (prescriptions waiting for MFA verification)
- Emails Sent (today's sent prescriptions)
- Draft Prescriptions (count of unsaved consultations)
- Recent Patients (list of 5 most recent patient visits)
- Recent Activity (feed of latest system actions)
- Notifications (unread count + bell icon)
- Quick Actions buttons:
  - New Patient
  - New Consultation
  - New Prescription
  - Find Pharmacy
- Upcoming Follow Ups (list of patients needing follow-up)

### 3. Patient Search / List
- Search bar at top (NHS number, name, DOB, phone, postcode) with autocomplete
- New Patient button (top right)
- Table with columns:
  - MRN
  - Name
  - DOB
  - Age
  - Phone
  - Last Visit
  - Actions (view, edit)
- Empty state: inviting illustration + "No patients found. Add your first patient."

### 4. Patient Profile
#### Tabs: Overview | Demographics | Medical History | Medications | Prescriptions | Timeline | Documents | Attachments
**Overview Tab**:
- Patient summary card (photo, name, MRN, DOB, age, NHS number)
- Quick stats: Total consultations, Active prescriptions, Allergies
- Recent activity timeline (last 5 items)
- Quick actions: New Consultation, New Prescription, Upload Document

**Demographics Tab**:
- Form view/edit mode toggle
- Fields: Title, First, Middle, Last, DOB, Gender, Phone, Email, Address lines, City, Postcode, Country, NHS Number, Emergency contact

**Medical History Tab**:
- Sections: Conditions, Allergies, Current Medications, Family History, Lifestyle
- Add/Edit buttons per section

**Prescriptions Tab**:
- List of prescriptions with status badges (using workflow status colors)
- Filter: All, Active, Draft, Clinical Review, Ready For Signature, Digitally Signed, Ready To Send, MFA Verified, Email Sent, Delivered, Completed, Archived, Cancelled
- Columns: Rx #, Date, Status, Total Items, Actions (view, PDF, renew, duplicate)

**Timeline Tab**:
- Vertical timeline view
- Events grouped by date (today, yesterday, last week, older)
- Each event: icon, color bar, timestamp, description
- Filter controls: event type, date range
- Search within timeline
- Expand/collapse events for details

**Documents Tab**:
- Grid view of patient documents
- Each card shows: thumbnail, filename, type, upload date, virus scan status, version
- Actions: view, download, delete, new version
- Upload button: drag & drop or click to select files
- Document types: Passport, Driving Licence, Insurance, NHS Documents, Lab Reports, Referral Letters, Images, Scanned Prescriptions, Medical Certificates, Other

### 5. Consultation Wizard (Stepper)
Horizontal stepper with progress indicator (steps numbered):
1. Patient Identity
2. Patient Details
3. Vitals
4. Clinical Checks
5. Consultation
6. Consent
7. Outcome
8. Prescription
9. Review
10. Digital Signature
11. Email Preview
12. Complete

Each step:
- Header with step number and title
- Form fields grouped in cards
- Navigation: Previous (gray button), Next/Save & Continue (orange button)
- Auto-save banner at bottom: shows "Last saved [time]", "Saving...", "Saved Successfully", or "Connection Lost"
- Auto-save triggers:
  - Every 20 seconds
  - When changing wizard steps
  - When browser loses focus
  - Before closing tab
  - Before refresh

### 6. Prescription Creation (within wizard)
Medicine search:
- Autocomplete input (RxNorm or custom database)
- Medicine name, brand, strength, form
- Quantity, unit
- Dosage frequency dropdown (Once daily, Twice daily, etc.)
- Route dropdown (Oral, Topical, Injection, etc.)
- Duration field + unit (days, weeks, months)
- Directions textarea
- Clinical notes textarea
- Warnings toggle (if applicable)
- Controlled drug checkbox (shows schedule select if checked)
- Add to prescription button

Prescription review:
- List of added medicines
- Edit/delete icons per item
- Total items count
- Prescriber info (auto-filled from user)
- Patient info summary
- Notes section
- Status badge showing current workflow state (DRAFT)

### 7. Digital Signature Screen
- Header: "Digitally Sign Prescription"
- Patient info summary at top
- Prescription preview (compact view)
- Signature canvas (white background, black ink)
- Clear button, Undo button
- Instructions: "Sign using mouse/touchpad or touchscreen"
- Pharmacist info auto-filled: Name, GPhC number, Practice details
- Confirmation checkbox: "I confirm I am authorized to prescribe this medication"
- Sign button (orange, disabled until signed and confirmed)
- Status indicator: shows current workflow step (Ready For Signature)

### 8. Email Preview Screen
- Two-pane view: left HTML preview, right email controls
- Header: "Email Prescription to Pharmacy"
- Pharmacy selection (searchable dropdown, auto-populates address)
- Patient info (non-editable)
- Prescription details (non-editable view)
- Editable fields:
  - Subject (auto-generated: "Prescription for [Patient Name] - RX123456")
  - Message body (rich text editor with template)
  - Pharmacy notes (textarea)
- Preview button (generates HTML preview)
- Send button (requires MFA verification)
- Cancel button
- Status badge: shows workflow step (Ready To Send)

### 9. Pharmacy Finder
- Search bar: Postcode or place name
- Current location button (uses GPS)
- Results: list and map (split view or tabs)
- List view cards:
  - Pharmacy name
  - Ods code
  - Distance
  - Address
  - Phone
  - Favorite star icon
  - Tags: NHSEPS, Flu Vaccine, Travel Clinic
- Map view: pins with clustering
- Filter panel: Distance, Services, Open now, Favorites only
- Recently used section
- Favorites section

### 10. Prescription History
- Search bar: Rx number, patient name, date range, status filter
- Table with columns:
  - Rx #
  - Date Issued
  - Patient
  - Medicines (first 2 + "x more" if >2)
  - Status (badge with workflow color)
  - Actions: View, PDF, Renew, Duplicate, Resend
- Empty state: "No prescriptions found"

### 11. Prescription Detail / View
- Header: Prescription number, date, status badge (with workflow color), status text
- Tabs: Details | Items | Audit | Versions | Timeline | Documents
**Details Tab**:
- Patient section (name, DOB, NHS number, contact)
- Prescriber section
- Clinical section (if any notes)
- Signature section (shows signature image if signed)
- Footer: Generated timestamp, unique identifier, workflow history

**Items Tab**:
- Table: Medicine, Strength, Form, Quantity, Dosage, Instructions
- Print-friendly view

**Audit Tab**:
- Timeline of events: Created, Updated, Submitted for Review, Approved, Signed, Sent, MFA Verified, Delivered, Completed, Archived
- Each entry: timestamp, user, IP address

**Timeline Tab**:
- Same as patient timeline but filtered to this prescription

**Documents Tab**:
- Related documents grid with preview

### 12. Audit Trail Page
- Filters: Date range, User, Action type, Entity type, Status
- Table: Timestamp, User, Action, Entity, Details, IP Address
- Export CSV button
- Pagination

### 13. Global Search Page
- Prominent search bar with autocomplete
- Recent searches dropdown below search bar
- Search suggestions as you type
- Results tabbed by entity type: Patients, Consultations, Prescriptions, Medicines, Pharmacies
- Each result shows relevant snippets and highlight matches
- Advanced filters toggle: date ranges, statuses, etc.
- Pagination at bottom
- Search history sidebar (recent searches with clear option)

### 14. Notification Centre
#### Dropdown (from header bell icon)
- List of recent notifications (most recent first)
- Each item: icon based on type, title, time, unread indicator
- "Mark all as read" link
- "View all notifications" link

#### Full Page
- Filters: Type, Read/unread, Date range
- Table: Timestamp, Icon, Title, Message, Related entity, Actions (mark read/delete)
- Bulk actions: select multiple, mark read/delete
- Preferences panel: toggle notification types and channels (in-app, email, push)
- Empty state: "No notifications"

### 15. Document Upload Modal
- Drag and drop area with click to browse
- File preview thumbnails for images
- File name, size, type for all files
- Virus scan status: pending/scanning/clean/infected
- Upload progress bar per file
- Cancel/remove file option
- Upload all button
- Success/error toast notifications

### 16. Toast Notifications
- Position: bottom-right
- Types: success, error, warning, info
- Auto-dismiss after 5 seconds (unless sticky)
- Action button optional (e.g., "Undo" on delete)

### 17. Loading States
- Skeleton loaders for cards, tables, text
- Full page loader: spinner + text
- Button loading: shows spinner inside button
- Infinite scroll loader: bottom of list

### 18. Empty States
- Illustration + message + call-to-action button
- Consistent styling across all empty states

### 19. Error States
- Inline validation errors: red border, helper text
- Form-level error banner at top
- Page-level error: sad illustration, message, retry button

### 20. Dark Mode
- Background: #0F1E19 (dark bottle green)
- Cards: #1A2E25 (slightly lighter)
- Text: white or gray 200
- Primary color: #2F7A60 (lighter for dark mode)
- Orange: #FFB347 (lighter for contrast)
- Borders: rgba(255,255,255,0.1)
- Shadows: same values (work on dark)

## Component Specifications (Updated)

### Button Variants
- Primary: Orange bg, white text, hover: darker orange
- Secondary: White bg, border orange, text orange, hover: bg orange 5%
- Ghost: Transparent, hover: bg gray 5%
- Danger: Red bg (DC2626), hover: darker red
- Success: Green bg (22C55E), hover: darker green
- Info: Blue bg (2563EB), hover: darker blue
- Warning: Yellow bg (F59E0B), hover: darker yellow
- Sizes: sm, base, lg

### Input Components
- TextInput: labeled, placeholder, error state
- TextArea: resizable vertical
- Select: searchable variant available
- DatePicker: single date, range
- Autocomplete: medicine search with loading state
- Checkbox: toggle switch style
- RadioGroup: horizontal/vertical
- FileUpload: drag & drop or click, shows file name, virus scan status, progress

### Cards
- Basic Card: white bg, shadow, radius 8px
- Header Card: with title and actions
- Stats Card: large number, label, trend icon, mini chart
- Image Card: for patient photo/avatar
- Interactive Card: hover lifts slightly
- Document Card: thumbnail, filename, type, size, status badges
- Prescription Card: Rx#, patient, date, status badge, medicine list
- Patient Card: photo, name, MRN, last visit, quick actions

### Tables
- Header: bg gray 50, text gray 600
- Body: white bg, hover: bg gray 50
- Striped: alternate rows bg gray 50
- Sortable: clickable header with sort icon
- Actions column: icon buttons (edit, delete, view)
- Empty state: text center text-gray-500 py-8

### Badges
- Variants: primary, secondary, success, danger, warning, info, dark, light
- Workflow status badges: each prescription status has specific color:
  - DRAFT: gray-500
  - CLINICAL_REVIEW: blue-500
  - READY_FOR_SIGNATURE: purple-500
  - DIGITALLY_SIGNED: green-500
  - READY_TO_SEND: orange-500
  - MFA_VERIFIED: indigo-500
  - EMAIL_SENT: teal-500
  - DELIVERED: lime-500
  - COMPLETED: emerald-500
  - ARCHIVED: slate-500
  - CANCELLED: red-500
- Sizes: sm, md, lg
- Pill variant: full radius

### Alerts & Toast
- Alert: banner with icon, dismissible
- Toast: toast container bottom-right, auto-dismiss 5s
- Types: success, error, warning, info
- Icon size: h-5 w-5
- Title: text-sm font-medium
- Description (optional): text-xs text-gray-600 mt-1

### Timeline Component
- Vertical timeline
- Events as cards with left indicator line
- Event dot: colored circle based on event type
- Content: icon, timestamp, description, metadata
- Grouping: by date with header
- Filters: dropdown for event type, date range picker
- Search: filters event text
- Loading: skeleton rows
- Empty: illustration + "No timeline events"

### Search Component
- Input with prefix icon (search)
- Dropdown for suggestions: recent, matches
- Debounced input (300ms)
- Keyboard navigation: arrow keys, enter
- Accessible: ARIA labels, live region for results
- Clear button (x) when input not empty

### Notification Centre
- Badge: red dot on bell icon for unread count >0
- Dropdown: list of notifications, most recent first
- Each notification: left icon (based on type), title, time, unread indicator (blue dot)
- "Mark all as read" link at bottom
- Full page: filters, table, bulk actions, preferences

### Upload Component
- Drag & drop area: dashed border, hover effect
- File list: name, size, type, thumbnail (if image), progress bar, status (uploading, done, error), remove button
- Upload all button: disabled while uploading
- Virus scan status: pending (yellow), scanning (blue), clean (green), infected (red)
- Accepted file types: configurable
- Max file size: visible limit

### Status Indicators
- Auto-save status: inline text below form: "Last saved 2m ago" (green), "Saving..." (blue with spinner), "Saved Successfully" (green), "Connection Lost" (red)
- Workflow step indicator: horizontal progress bar with numbered circles, current step highlighted
- Prescription status badge: as defined above