# TruWell Pharmacy Design System

## Table of Contents
1. [Brand Guidelines](#1-brand-guidelines)
2. [Color Tokens](#2-color-tokens)
3. [Typography Scale](#3-typography-scale)
4. [Component Library Guidelines](#4-component-library-guidelines)
   - [Buttons](#button-library)
   - [Inputs](#input-components)
   - [Selects & Dropdowns](#select--dropdown)
   - [Comboboxes & Autocomplete](#comboboxes--autocomplete)
   - [Checkboxes & Radios](#checkboxes--radios)
   - [File Upload](#file-upload)
   - [Cards](#cards)
   - [Tables](#tables)
   - [Dialogs & Modals](#dialogs--modals)
   - [Badges](#badges)
   - [Alerts](#alerts)
   - [Toasts](#toast-notifications)
   - [Loading States](#loading-states)
   - [Sidebar](#sidebar)
   - [Navbar](#navbar)
   - [Breadcrumbs](#breadcrumbs)
   - [Tabs](#tabs)
   - [Stepper](#progress-stepper)
   - [Wizard Stepper](#wizard-stepper)
   - [Timeline](#timeline)
   - [Data Tables](#data-tables)
   - [Pagination](#pagination)
   - [Notification Centre](#notification-centre)
   - [Status Badges](#status-badges)
   - [Prescription Cards](#prescription-cards)
   - [Patient Cards](#patient-cards)
   - [Upload Components](#upload-components)
   - [Empty States](#empty-states)
   - [Error States](#error-states)
   - [Charts](#charts)
5. [Usage Guidelines](#5-usage-guidelines)

## 1. Brand Guidelines

### Name
TruWell Pharmacy

### Tagline
Modern Pharmacy Management Platform

### Voice & Tone
- Professional yet approachable
- Clear and concise
- Empathetic and patient-focused
- Authoritative but not intimidating

### Logo Usage
- Primary logo: Wordmark in Bottle Green (#1F5E4A)
- Secondary logo: White version for dark backgrounds
- Clear space: Equal to height of "W" in TruWell
- Minimum size: 40px height for digital, 12mm for print

### Imagery Style
- Healthcare-focused, diverse representation
- Natural lighting, warm tones
- Avoid clinical sterility
- Show pharmacists interacting with patients
- Use authentic, candid shots over stock poses

## 2. Color Tokens

### Primary Palette (Bottle Green)
- `primary-50`: #EFF6F4
- `primary-100`: #DCEFE8
- `primary-200`: #B8DED8
- `primary-300`: #95CDC2
- `primary-400`: #72BCAC
- `primary-500`: #1F5E4A (Base Bottle Green)
- `primary-600`: #174737
- `primary-700`: #103025
- `primary-800`: #0A1A13
- `primary-900`: #050D0A

### Secondary Palette (Orange)
- `secondary-50`: #FFF4ED
- `secondary-100`: #FFE8DC
- `secondary-200`: #FFD7B8
- `secondary-300`: #FFC18F
- `secondary-400`: #FFA861
- `secondary-500`: #F28C28 (Base Orange)
- `secondary-600`: #C26F20
- `secondary-700`: #915318
- `secondary-800`: #613710
- `secondary-900`: #3E240A

### Accent Orange
- `accent-orange`: #FFB347

### Semantic Colors
- `success`: #22C55E
- `success-dark`: #16A34A
- `danger`: #DC2626
- `danger-dark`: #B91C1C
- `warning`: #F59E0B
- `warning-dark`: #D46B16
- `info`: #2563EB
- `info-dark`: #1D4ED8

### Neutrals
- `gray-50`: #F8FAF8
- `gray-100`: #F1F5F1
- `gray-200`: #E2E9E2
- `gray-300`: #C2C9C2
- `gray-400`: #A1A9A1
- `gray-500`: #808980
- `gray-600`: #5F665F
- `gray-700`: #424842
- `gray-800`: #2C2F2C
- `gray-900`: #1F211F

### Backgrounds
- `background`: #F8FAF8
- `background-paper`: #FFFFFF
- `background-dark`: #0F1E19
- `background-paper-dark`: #1A2E25

### Text
- `text-primary`: #1F211F
- `text-secondary`: #5F665F
- `text-disabled`: #A1A9A1
- `text-inverse`: #FFFFFF
- `text-primary-dark`: #F8FAF8
- `text-secondary-dark`: #C2C9C2

### Borders & Dividers
- `border`: #E2E9E2
- `border-light`: #F1F5F1
- `border-dark`: #1A2E25

### Shadows
- `shadow-sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `shadow`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- `shadow-md`: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- `shadow-lg`: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -3px rgba(0, 0, 0, 0.08)
- `shadow-xl`: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

### Transitions
- `transition-fast`: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- `transition`: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- `transition-slow`: 300ms cubic-bezier(0.4, 0, 0.2, 1)

### Radius
- `radius-xs`: 4px
- `radius-sm`: 6px
- `radius`: 8px
- `radius-md`: 10px
- `radius-lg`: 12px
- `radius-full`: 9999px

## 3. Typography Scale

### Font Family
- Primary: `Inter` (sans-serif)
- Fallback: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Font Weights
- `font-light`: 300
- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700
- `font-extrabold`: 800

### Type Scale (Base: 16px)
- `text-2xs`: 0.65rem (10.4px)
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875.25rem = 20px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)
- `text-5xl`: 3rem (48px)
- `text-6xl`: 3.75rem (60px)

### Line Heights
- `leading-none`: 1
- `leading-tight`: 1.25
- `leading-snug`: 1.375
- `leading-normal`: 1.5
- `leading-relaxed`: 1.625
- `leading-loose`: 2

### Letter Spacing
- `tracking-tighter`: -0.05em
- `tracking-tight`: -0.025em
- `tracking-normal`: 0
- `tracking-wide`: 0.025em
- `tracking-wider`: 0.05em
- `tracking-widest`: 0.1em

## 4. Component Library Guidelines

### Button Library
#### Variants
- **Primary**: Background `primary-500`, text `white`, hover `primary-600`
- **Secondary**: Background `white`, border `primary-500`, text `primary-500`, hover `background: primary-50`
- **Ghost**: Background `transparent`, text `primary-500`, hover `background: primary-50`
- **Danger**: Background `danger`, text `white`, hover `danger-dark`
- **Success**: Background `success`, text `white`, hover `success-dark`
- **Info**: Background `info`, text `white`, hover `info-dark`
- **Warning**: Background `warning`, text `white`, hover `warning-dark`
- **Link**: Text `primary-500`, underline `none`, hover `text-decoration: underline`

#### Sizes
- **Icon Only**: `h-8 w-8` (24px x 24px)
- **Small**: `h-9 px-3 text-sm` (36px height)
- **Base**: `h-10 px-4 text-base` (40px height)
- **Large**: `h-12 px-6 text-lg` (48px height)

#### Properties
- Border radius: `radius`
- Font weight: `font-semibold`
- Transition: `transition`
- Disabled opacity: 0.5
- Loading state: shows spinner inside button, disabled during load

### Input Components
#### Text Input
- Background: `background-paper`
- Border: `1px solid border`
- Border radius: `radius`
- Padding: `text-sm: px-3 py-2, text-base: px-4 py-3`
- Font size: `text-sm` or `text-base`
- Focus ring: `2px solid primary-300`
- Error border: `2px solid danger`
- Disabled background: `gray-50`
- Disabled text: `gray-400`
- Placeholder color: `text-disabled`

#### Text Area
- Same as text input
- Resizable: vertical only
- Min height: `6rem` (96px)

#### Select / Dropdown
- Same styling as text input
- Dropdown menu:
  - Background: `background-paper`
  - Border: `1px solid border`
  - Border radius: `radius`
  - Box shadow: `shadow-md`
  - Padding: `text-sm: px-2 py-1, text-base: px-3 py-2`
  - Z-index: 50
- Selected item highlight: `background: primary-50`
- Arrow icon: `h-4 w-4`, color `text-secondary`

#### Combobox & Autocomplete
- Combines input with dropdown
- Input shows placeholder or selected value
- Dropdown shows suggestions with highlighting of match
- Loading state: spinner inside input
- Empty state: message "No results found"
- Recent items section: shows recent selections
- Keyboard navigation: arrow keys, enter to select, esc to close

#### Checkbox
- Size: `h-4 w-4` (16px)
- Border: `2px solid border`
- Border radius: `radius-xs`
- Checked background: `primary-500`
- Checked border: `primary-500`
- Check icon: `white` (✓)
- Transition: `transition`
- Label cursor: `pointer`
- Label margin-left: `0.5rem`
- Indeterminate state: dash instead of check

#### Radio Button
- Size: `h-4 w-4` (16px)
- Border: `2px solid border`
- Border radius: `radius-full`
- Checked background: `primary-500`
- Checked border: `primary-500`
- Inner dot: `white`, size `h-2 w-2`
- Transition: `transition`

#### File Upload
- Container: dashed border `2px dashed border`, rounded `radius`, background `gray-50`
- Hover: background `primary-50`, border `2px dashed primary-300`
- Text: `text-sm`
- Icon: upload icon, size `h-5 w-5`
- File list:
  - File name: `text-sm font-medium`
  - Size: `text-xs text-secondary`
  - Thumbnail: for images, max 64x64
  - Progress bar: height `0.5rem`, background `gray-200`, foreground `primary-500`, rounded `radius`
  - Status indicators:
    - Uploading: blue spinner
    - Success: green check
    - Error: red exclamation
    - Virus scan pending: yellow clock
    - Virus scan scanning: blue rotate
    - Virus scan clean: green check
    - Virus scan infected: red exclamation inside shield
- Remove button: `h-8 w-8`, hover `background: red-50`, icon `trash-2` size `h-4 w-4`
- Upload all button: primary button, disabled when no files or uploading

### Cards
- Background: `background-paper`
- Border radius: `radius`
- Box shadow: `shadow`
- Padding: `text-base: p-6, text-lg: p-8`
- Transition: `transition`
- Hover lift: `transform -translate-y-1 shadow-md` (optional for interactive cards)
- Header: border bottom `1px solid border`, padding bottom `pb-4`
- Footer: border top `1px solid border`, padding top `pt-4`
- **Specialized Cards**:
  - **Prescription Card**:
    - Left: Rx number badge (background `primary-100`, text `primary-800`)
    - Middle: Patient name, date, status badge (workflow color)
    - Right: Medicine count, actions (more_vert)
    - Bottom: medicine list (name, strength, dose)
  - **Patient Card**:
    - Left: avatar (size `h-10 w-10`)
    - Middle: Name, MRN, last visit date
    - Right: phone icon, quick actions (more_vert)
    - Bottom: tags for allergies, conditions
  - **Document Card**:
    - Top: thumbnail (if image) or file icon
    - Middle: filename, type, size
    - Bottom: upload date, version, virus status badge, actions (download, delete, new version)

### Tables
- Width: 100%
- Border collapse: separate
- Border spacing: 0
- Header:
  - Background: `gray-50`
  - Text: `text-xs font-semibold text-uppercase tracking-wider`
  - Padding: `px-4 py-3`
  - Border bottom: `1px solid border`
- Body:
  - Background: `background-paper`
  - Text: `text-sm`
  - Padding: `px-4 py-4`
  - Border bottom: `1px solid border`
  - Hover: background `gray-50`
- Striped: even rows background `gray-50`
- Empty state: text center `text-gray-500 py-8`
- **Data Tables (enhanced)**:
  - Toolbar above: search, filters, column selector, export
  - Column headers: sortable with indicators
  - Row selection: checkbox column (optional)
  - Expandable rows: for details
  - Actions column: icon buttons with tooltip
  - Loading state: skeleton rows
  - Pagination: bottom left (info), bottom right (controls)

### Dialogs & Modals
#### Overlay
- Background: `rgba(31, 33, 31, 0.5)`
- Backdrop filter: `blur(4px)` (optional)

#### Modal Container
- Background: `background-paper`
- Border radius: `radius-lg`
- Box shadow: `shadow-xl`
- Max width: `5xl` (64rem)
- Width: `90%` (mobile), `max-w-xl` (desktop)
- Padding: `p-6`
- Transition: `transition-slow`
- Animation: scale from 0.95 to 1, fade in

#### Header
- Display: flex
- Justify: space-between
- Align: center
- Margin bottom: `mb-4`
- Title: `text-xl font-semibold`
- Close button: `h-8 w-8`, rounded, hover `background: gray-50`

#### Body
- Space y: `space-y-5`
- Text: `text-base`

#### Footer
- Display: flex
- Justify: flex-end
- Space x: `gap-4`
- Buttons: secondary variant for cancel, primary for confirm

### Badges
- Inline-flex, items-center
- Font size: `text-xs`
- Font weight: `font-semibold`
- Padding: `px-2.5 py-0.5` (xs), `px-3 py-1` (sm), `px-4 py-1.5` (md)
- Border radius: `radius-full`
- Variants:
  - Primary: background `primary-100`, text `primary-800`
  - Secondary: background `secondary-100`, text `secondary-800`
  - Success: background `success/10`, text `success-800`
  - Danger: background `danger/10`, text `danger-800`
  - Warning: background `warning/10`, text `warning-800`
  - Info: background `info/10`, text `info-800`
  - Dark: background `gray-200`, text `gray-800`
  - Light: background `gray-50`, text `gray-700`
  - **Workflow Status** (special):
    - DRAFT: background `gray-100`, text `gray-800`
    - CLINICAL_REVIEW: background `blue-50`, text `blue-800`
    - READY_FOR_SIGNATURE: background `purple-50`, text `purple-800`
    - DIGITALLY_SIGNED: background `green-10`, text `green-800`
    - READY_TO_SEND: background `orange-10`, text `orange-800`
    - MFA_VERIFIED: background `indigo-10`, text `indigo-800`
    - EMAIL_SENT: background `teal-10`, text `teal-800`
    - DELIVERED: background `lime-10`, text `lime-800`
    - COMPLETED: background `emerald-10`, text `emerald-800`
    - ARCHIVED: background `slate-10`, text `slate-800`
    - CANCELLED: background `red-10`, text `red-800`

### Alerts
- Display: flex
- Items: center
- Space x: `space-x-3`
- Padding: `p-4`
- Border radius: `radius`
- Border: `1px solid`
- Variants:
  - Success: background `success/5`, border `success/20`, text `success-800`, icon color `success-500`
  - Danger: background `danger/5`, border `danger/20`, text `danger-800`, icon color `danger-500`
  - Warning: background `warning/5`, border `warning/20`, text `warning-800`, icon color `warning-500`
  - Info: background `info/5`, border `info/20`, text `info-800`, icon color `info-500`
- Icon size: `h-5 w-5`
- Title: `text-sm font-medium`
- Description (optional): `text-xs text-gray-600 mt-1`

### Toast Notifications
- Container: fixed, bottom-4, right-4, z-index: 50
- Toast item:
  - Background: `background-paper`
  - Border left: `4px solid`
  - Border radius: `radius`
  - Box shadow: `shadow-lg`
  - Padding: `p-4`
  - Space x: `space-x-3`
  - Transform: `translate-y-[20px] opacity-0`
  - Enter: `translate-y-0 opacity-100 transition-all duration-300`
  - Leave: `translate-y-[20px] opacity-0 transition-all duration-200`
- Variants same as alerts (border left color)
- Icon: `h-5 w-5`
- Title: `text-sm font-medium`
- Description: `text-xs text-gray-600`
- Progress bar (optional): height `0.5rem`, background `gray-200`, foreground same as border left, rounded `radius`
- Action button (optional): text-sm, same color as title, hover underline

### Loading States
#### Spinner
- Size: `h-5 w-5` (sm), `h-8 w-8` (md), `h-12 w-12` (lg)
- Border: `2px solid`
- Border top color: `transparent`
- Animation: `spin duration-1500 linear infinite`
- Color: `primary-500` (primary), or `gray-500` (neutral)

#### Skeletons
##### Text
- Height: `0.875rem` (text-sm), `1rem` (text-base)
- Background: `gray-200`
- Border radius: `radius`
- Animation: `pulse duration-1500 ease-in-out infinite`

##### Card
- Background: `gray-100`
- Border radius: `radius`
- Height: `h-96` (384px) or custom
- Animation: `pulse duration-1500 ease-in-out infinite`

##### Table Row
- Height: `h-12` (48px)
- Background: `gray-100`
- Border radius: `radius`
- Animation: `pulse duration-1500 ease-in-out infinite`

##### Avatar
- Size: `h-10 w-10` (sm), `h-12 w-12` (md), `h-16 w-16` (lg)
- Background: `gray-200`
- Border radius: `radius-full`
- Animation: `pulse duration-1500 ease-in-out infinite`

##### Input
- Height: `h-10` (40px)
- Background: `gray-100`
- Border radius: `radius`
- Animation: `pulse duration-1500 ease-in-out infinite`

#### Button
- Same dimensions as button
- Background: `gray-100`
- Border radius: `radius`
- Animation: `pulse duration-1500 ease-in-out infinite`

### Sidebar
- Width: `64px` (collapsed), `240px` (expanded)
- Background: `primary-900` (dark bottle green)
- Color: `text-inverse`
- Transition: `transition width`
- Z-index: 40
- Breakpoint: collapsed on `< lg` (1024px) by default, can be set to always expanded on desktop
- Logo: height `8rem`, margin bottom `mb-6`
- Nav items:
  - Height: `h-10`
  - Margin: `mx-3 my-2`
  - Border radius: `radius`
  - Display: flex
  - Align: center
  - Justify: collapsed: center, expanded: start
  - Padding: collapsed: `px-2`, expanded: `px-4`
  - Text: collapsed: hidden, expanded: `text-sm font-medium`
  - Icon: size `h-5 w-5`
  - Hover: background `primary-800`
  - Active: background `primary-800`, text `accent-orange`

### Navbar
- Height: `h-14` (56px)
- Background: `background-paper`
- Border bottom: `1px solid border`
- Display: flex
- Justify: space-between
- Align: center
- Padding: `px-4`
- Z-index: 30
- Left section:
  - Logo: height `h-8`
  - Title: `hidden md:block text-xl font-semibold`
- Right section:
  - Space x: `space-x-3`
  - Notification badge: relative position
  - Avatar: size `h-8 w-8`, border radius `radius-full`
  - Dropdown menu: same as select dropdown

### Breadcrumbs
- Display: flex
- Align: center
- Space x: `space-x-1`
- Text: `text-xs text-gray-500`
- Separator: `/` (margin x `mx-1`)
- Last item: `text-gray-700 font-medium`
- Link hover: `text-decoration: underline`

### Tabs
- List: flex, border bottom `1px solid border`
- Tab item:
  - Padding: `px-4 py-3`
  - Font: `text-sm font-medium`
  - Color: `text-gray-500`
  - Hover: `text-gray-700`
  - Active: color `primary-600`, border bottom `2px solid primary-500`
  - Transition: `transition-colors`
- Content: `mt-4`

### Progress Stepper (Horizontal)
- Container: `space-x-4`
- Step:
  - Display: flex
  - Flex direction: column
  - Align: center
  - Space y: `space-y-2`
  - Circle:
    - Size: `h-10 w-10`
    - Border: `2px solid`
    - Border radius: `radius-full`
    - Background: `gray-200`
    - Text: `text-xs font-semibold`
  - Line:
    - Flex: 1
    - Height: `0.5rem`
    - Background: `gray-200`
    - Border radius: `radius-full`
  - Active step:
    - Circle: border `primary-500`, background `primary-50`, text `primary-800`
    - Line: background `primary-200`
  - Completed step:
    - Circle: border `success-500`, background `success/10`, text `success-800`
    - Line: background `success-200`
  - Disabled step:
    - Circle: border `gray-300`, text `gray-400`
    - Line: background `gray-300`
  - Transition: `transition`

### Wizard Stepper (Enhanced Horizontal Stepper)
- Container: `space-x-4 mb-6`
- Step:
  - Position: relative
  - Display: flex
  - Flex direction: column
  - Align: center
  - Space y: `space-y-2`
  - Circle:
    - Size: `h-10 w-10`
    - Border: `2px solid`
    - Border radius: `radius-full`
    - Background: `gray-200`
    - Text: `text-xs font-semibold`
    - Number: `text-xs font-medium`
  - Line:
    - Flex: 1
    - Height: `0.5rem`
    - Background: `gray-200`
    - Border radius: `radius-full`
  - Label:
    - Margin top: `mt-2`
    - Text: `text-sm font-medium text-center`
    - Max width: `6rem`
    - Overflow: hidden
    - Text overflow: ellipsis
  - Active step:
    - Circle: border `primary-500`, background `primary-50`, text `primary-800`
    - Label: text `primary-800`
    - Line: background `primary-200`
  - Completed step:
    - Circle: border `success-500`, background `success/10`, text `success-800`
    - Label: text `success-800`
    - Line: background `success-200`
  - Error step:
    - Circle: border `danger-500`, background `danger/10`, text `danger-800`
    - Label: text `danger-800`
    - Line: background `danger-200`
  - Disabled step:
    - Circle: border `gray-300`, text `gray-400`
    - Line: background `gray-300`
  - Transition: `transition`
  - Tooltip (on hover/focus): shows step title, status, optional description
  - Validation indicator: small dot below circle:
    - Valid: green dot
    - Invalid: red dot
    - Warning: orange dot
  - Current step highlight: subtle ring `ring-2 ring-primary-500`

### Timeline
- Container: `space-y-4`
- Event:
  - Position: relative
  - Padding left: `pl-4`
  - Border left: `2px solid`
  - Border left color: `gray-200`
  - Margin bottom: `mb-4`
  - Last child: margin-bottom 0
  - Indicates line continues: pseudo-element after
- Marker:
  - Position: absolute
  - Left: `-8px`
  - Top: `0`
  - Width: `16px`
  - Height: `16px`
  - Border radius: `full`
  - Background: `gray-200`
  - Border: `2px solid background-paper`
  - Box shadow: `shadow`
  - Icon: size `h-4 w-4`, centered
- Content:
  - Margin left: `ml-4`
  - Space y: `space-y-2`
  - Header: flex, items-baseline, space-between
    - Icon: `h-4 w-4`, flex-shrink 0
    - Title: `text-sm font-medium`
    - Timestamp: `text-xs text-gray-500`
  - Description: `text-sm text-gray-600`
  - Metadata (optional): `text-xs text-gray-500 flex-wrap gap-2`
    - Each item: `rounded bg-gray-100 px-2 py-0.5 text-xs`
- Active event (if applicable):
  - Border left color: `primary-500`
  - Marker background: `primary-500`
  - Marker icon color: `white`
- Completed event:
  - Border left color: `success-500`
  - Marker background: `success-10`
  - Marker icon color: `success-800`
- Upcoming event:
  - Border left color: `gray-300`
  - Marker background: `gray-100`
  - Marker icon color: `gray-600`
- Grouping:
  - Date header: `text-base font-semibold mb-2`
    - Background: `gray-50`
    - Padding: `px-3 py-1`
    - Rounded: `radius`
- Empty state:
  - Text center: `py-8`
  - Illustration: optional
  - Message: `text-lg text-gray-600`
  - Action button: primary `mt-4`

### Data Tables (Enhanced)
- Wrapper: `relative overflow-x-auto`
- Table: as base table
- Toolbar:
  - Flex wrap, items-center, justify-between
  - Left: search input (rounded, border, padding)
  - Middle: optionally hidden on small screens
  - Right: actions (export, column selector, etc.)
- Pagination:
  - Flex, items-center, justify-between, pt-4
  - Left: info text `text-sm text-gray-500`
  - Right: controls (flex, space-x-2)
    - Previous/next buttons: icon button style
    - Page selector: select or input
    - Page size select: select
- Loading state:
  - Overlay: absolute inset-0, background `background-paper/50`
  - Loader: spinner `h-8 w-8 text-primary-500` center
- Empty state:
  - Text center: `py-12`
  - Illustration: optional
  - Message: `text-lg text-gray-600`
  - Action: primary button `mt-4`
- Selection:
  - Column: first column width `h-10`, center
  - Checkbox: `h-4 w-4`, border `border`, rounded `radius`, checked `bg-primary-500`
- Expandable rows:
  - Expand icon: `chevron-down` rotates 180deg when expanded
  - Expanded row: background `gray-50`, padding `p-4`
- Actions column:
  - Each button: `h-8 w-8 p-1`, rounded `radius`, hover `bg-gray-50`
  - Tooltip: `delay-100`, `bg-gray-900/90`, `text-xs`, `px-2 py-1`, `rounded`, `z-index-10`

### Pagination
- Container: `flex items-center justify-between pt-4`
- Info: `text-sm text-gray-500`
- Controls: `flex space-x-2`
  - Button: `h-9 w-9 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50`
    - Disabled: `opacity-50`, `cursor-not-allowed`
  - Current page: `flex-1 w-10 flex items-center justify-center font-medium`
  - Page selector: `h-9 w-20 rounded border border-gray-300 px-2 py-1 text-sm`
  - Page size: `h-9 w-20 rounded border border-gray-300 px-2 py-1 text-sm`

### Notification Centre
#### Badge
- Position: absolute, top `-2`, right `-2`
- Width: `h-6 w-6`
- Background: `red-500`
- Border radius: `full`
- Text: `text-xs text-white font-medium leading-none`
- Mini badge (dot): `w-2 h-2 bg-red-500 rounded-full`

#### Dropdown Menu
- Origin: bottom-left of bell icon
- Margin-top: `mt-2`
- Background: `background-paper`
- Border: `1px solid border`
- Border radius: `radius`
- Box shadow: `shadow-lg`
- Width: `w-64`
- Padding: `p-2`
- Space y: `space-y-1`
- Item:
  - Flex, items-center, space-x-3, p-2, rounded `radius`, hover:bg-gray-50
  - Left: icon `h-4 w-4 flex-shrink-0`
  - Middle: title `text-sm`, message `text-xs text-gray-500 block mt-1`
  - Right: time `text-xs text-gray-400`
  - Unread indicator: `w-2 h-2 bg-blue-500 rounded-full ml-2`
- Divider: `border-t border-gray-200 my-1`
- Footer: `pt-2 text-center`
  - Link: `text-sm text-blue-600 hover:underline`

#### Full Page
- Header: `flex items-center justify-between pb-4 border-b border-gray-200`
  - Title: `text-xl font-semibold`
  - Actions: `flex space-x-2`
    - Button: `px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm`
- Filters: `space-y-4`
  - Filter group: `space-y-2`
    - Label: `text-sm font-medium mb-1`
    - Input: `w-full rounded border border-gray-300 px-3 py-2 text-sm`
    - Select: same as input
    - Date range: two inputs with separator
- Table: as Data Table (above)
- Empty state: as standard empty state
- Preferences section: `mt-6`
  - Toggle group: `space-y-3`
    - Label: `flex items-center justify-between`
      - Left: `text-sm font-medium`
      - Right: `flex items-center space-x-2`
        - Toggle: `h-4 w-6 rounded bg-gray-200`
          - Checked: `bg-primary-500`
          - Transition: `transform duration-200`
          - Thumb: `h-3 w-3 rounded bg-white transform translate-x-1`
        - Label: `text-sm text-gray-600`
- Actions: `mt-6 flex justify-end space-x-3`
  - Button: secondary for cancel, primary for save

### Upload Component
#### Container
- Border: `2px dashed border`
- Border radius: `radius`
- Background: `gray-50`
- Padding: `p-6`
- Text: `text-center text-gray-500`
- Icon: `upload` size `h-6 w-6 mb-3`
- Hover: `border-primary-300 background-primary-50`
- Disabled: `opacity-50 pointer-events-none`
- Drag over: `border-primary-500 background-primary-100`

#### File List
- Space y: `space-y-3`
- File item:
  - Flex, items-start, space-x-3, p-3, rounded `border`, hover:bg-gray-50
  - Left: thumbnail or file icon `h-10 w-10 flex-shrink-0 rounded `border` overflow-hidden`
    - Image: object-cover
    - File type icon: `description` size `h-5 w-5`
  - Middle: flex-1 space-y-2
    - Top: flex justify-between
      - File name: `text-sm font-medium truncate max-w-xs`
      - File size: `text-xs text-gray-500`
    - Bottom: flex space-x-2 text-xs
      - Status: `px-2 py-0.5 rounded text-xs`
        - Uploading: `bg-blue-50 text-blue-800`
        - Success: `bg-green-50 text-green-800`
        - Error: `bg-red-50 text-red-800`
        - Virus scan pending: `bg-yellow-50 text-yellow-800`
        - Virus scan scanning: `bg-blue-50 text-blue-800 animate-pulse`
        - Virus scan clean: `bg-green-50 text-green-800`
        - Virus scan infected: `bg-red-50 text-red-800`
      - Progress: `w-1/2` (if uploading/showing progress)
        - Container: `h-1 w-full bg-gray-200 rounded-full overflow-hidden`
          - Bar: `h-full bg-primary-500 transition-width duration-300`
      - Actions: `flex space-x-1`
        - Button: `h-8 w-8 p-1 rounded hover:bg-gray-50`
          - Cancel: `icon x` (when uploading)
          - Retry: `icon rotate-cw` (when error)
          - Remove: `icon trash-2`
- Upload all button: `mt-4 w-full flex justify-center`
  - Disabled: `opacity-50 cursor-not-allowed`
  - Loading: spinner inside button

### Empty States
- Container: `text-center py-12`
- Illustration: optional `mb-6` (max-w-xs mx-auto)
- Title: `text-xl font-medium mb-2`
- Description: `text-lg text-gray-500 mb-6`
- Action button: primary `mt-4` (optional secondary link `mt-2 text-sm text-blue-600`)

### Error States
#### Inline
- Input: border `2px solid danger`, background `danger/5`
- Helper text: `text-xs text-danger-500 mt-1`
- Icon: `exclamation-triangle` size `h-4 w-4 text-danger-400` absolute right-2 top-1/2 -mt-2

#### Form-level
- Banner: `flex items-start space-x-3 p-4 rounded border border-danger-200 bg-danger-5`
  - Icon: `exclamation-triangle` size `h-5 w-5 flex-shrink-0 text-danger-500`
  - Message: `space-y-1`
    - Title: `text-sm font-medium text-danger-800`
    - Description: `text-sm text-gray-600`

#### Page-level
- Container: `flex min-h-[200px] items-center justify-center px-4 py-12`
- Content: `text-center`
  - Illustration: optional `mb-6` (max-w-md mx-auto)
  - Title: `text-2xl font-bold mb-2`
  - Description: `text-lg text-gray-500 mb-6`
  - Action button: primary `mt-4`
  - Secondary link: `mt-2 text-sm text-blue-600`

### Charts
- Container: `relative`
- Canvas: `w-full h-[300px]`
- Responsive: maintains aspect ratio
- Loading: skeleton bars/lines/pieces (height `h-4`, bg `gray-200`, rounded `radius`, animate pulse)
- Empty: as empty state
- Tooltip:
  - Background: `bg-gray-900/80`
  - Border: `none`
  - Radius: `radius`
  - Padding: `px-3 py-2`
  - Text: `text-sm text-white`
  - Arrow: `size 4`
- Legend:
  - Flex, items-center, space-x-4, text-sm text-gray-600
  - Color indicator: `h-3 w-3 rounded mr-1`
- Grid lines:
  - Color: `gray-200`
  - Width: `1px`
- Axes:
  - Line: `gray-300`
  - Tick: `gray-400`
- Colors: use semantic palette for meaning, otherwise use primary/secondary accents
- Accessibility:
  - ARIA-label on container
  - Keyboard navigable legend (tab focus)
  - Sufficient contrast (WCAG AA)

## 5. Usage Guidelines

### Installation
- Ensure Tailwind CSS is configured with the design tokens (via `tailwind.config.js`).
- Install `lucide-react` for icons (we use Lucide Icons).

### Component Development
1. Create component in appropriate subdirectory under `frontend/components/`.
2. Export from component's `index.ts` (or `index.tsx`).
3. Update the barrel export in `frontend/components/index.ts` if creating a global import.
4. Write component interface for props.
5. Use Tailwind utility classes following the design token naming.
6. Ensure responsiveness (mobile-first).
7. Add JSDoc comments.
8. Create stories in `__stories__` or `.stories.tsx` if using Storybook.
9. Write unit tests with React Testing Library.
10. Add to Storybook catalog (if applicable).

### Accessibility (a11y)
- All interactive elements must be keyboard navigable.
- Use appropriate ARIA labels and roles.
- Ensure color contrast ratio ≥ 4.5:1 for normal text, 3:1 for large text.
- Provide visible focus outlines (use `focus-visible` or `focus:ring-2 focus:ring-primary-500`).
- Use semantic HTML elements (button, input, label, etc.).
- Include skip-to-content link for screen readers.

### Performance
- Lazy-load images and non-critical components.
- Code-split by route.
- Use `React.memo` for expensive renders.
- Avoid inline functions in render passes; use `useCallback`.
- Optimize re-renders with `useMemo` where necessary.
- Virtual scroll for long lists (use libraries like `react-window` or `react-virtualized`).

### Theming (Dark Mode)
- Dark mode uses `background-dark` and `background-paper-dark`.
- Text colors invert to `text-primary-dark` and `text-secondary-dark`.
- Primary color accent uses `primary-600` for better contrast.
- Orange accent uses `accent-orange` for both light and dark.
- Implement via CSS class `dark` on root element and Tailwind dark mode.

### Internationalization (i18n)
- All UI strings should be externalized using `react-i18next` or similar.
- Dates, numbers, currencies formatted per locale.
- Support for right-to-left (RTL) layouts considered (though UK-specific).

### Testing
- Unit tests: React Testing Library + Jest.
- Visual regression: Storybook + Chromatic (if used).
- End-to-end: Cypress for critical user flows.

### Documentation
- Each component should have a README in its folder explaining usage.
- Examples of common usage patterns.
- Props table with types and descriptions.