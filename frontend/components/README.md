# UI Component Library

This directory contains all reusable UI components for the TruWell Pharmacy application.

## Structure

- `buttons/` - Button variants and sizes
- `inputs/` - Text inputs, textareas, etc.
- `selects/` - Dropdown selects
- `checkboxes/` - Checkbox and toggle components
- `radios/` - Radio button groups
- `file-upload/` - File upload components
- `cards/` - Card containers
- `tables/` - Table components
- `dialogs/` - Dialog and modal components
- `modals/` - Modal wrappers
- `badges/` - Badge components
- `alerts/` - Inline alert messages
- `toasts/` - Toast notification system
- `loading/` - Spinners, skeletons, and loading indicators
- `sidebar/` - Navigation sidebar
- `navbar/` - Top navigation bar
- `breadcrumbs/` - Breadcrumb navigation
- `tabs/` - Tabbed interface
- `stepper/` - Horizontal and vertical stepper
- `avatars/` - User avatar components
- `banners/` - Full-width banners
- `dividers/` - Divider lines
- `tooltips/` - Tooltips and popovers
- `sliders/` - Slider and range inputs

## Usage

Each component should follow the design system guidelines found in `/docs/design-system.md`.

Components are exported from their respective index files and can be imported as:

```tsx
import { Button } from '@/components/buttons';
```

## Development Guidelines

- All components must be functional components with TypeScript interfaces for props.
- Use Tailwind CSS for styling, adhering to the design tokens.
- Ensure accessibility (WCAG 2.1 AA) compliance.
- Include JSDoc comments for all props and functions.
- Write unit tests for each component using React Testing Library.
- Stories should be created for Storybook (if applicable).