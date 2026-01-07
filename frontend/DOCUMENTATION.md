# Frontend Documentation - TimeFirst Journal App

## Overview

This is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS. The application provides a complete journaling experience with authentication, CRUD operations, search, filtering, and a modern UI.

## Project Structure

```
frontend/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── DashboardHeader.tsx
│   │   ├── JournalItem.tsx
│   │   ├── JournalViewModal.tsx
│   │   └── JournalFormModal.tsx
│   ├── context/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── dashboard/          # Dashboard page
│   │   └── page.tsx
│   ├── login/              # Login page
│   │   └── page.tsx
│   ├── lib/                # Utility functions and schemas
│   │   ├── mockData.ts
│   │   └── schemas.ts
│   ├── mockdata/           # Mock data for development
│   │   ├── journalData.json
│   │   └── userData.json
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with AuthProvider
│   └── page.tsx            # Home page (redirects)
├── package.json
└── DOCUMENTATION.md        # This file
```

## Features Implemented

### 1. Authentication System
- **Login Page** (`/app/login/page.tsx`)
  - Email and password fields with validation
  - Uses React Hook Form with Zod validation
  - Mock authentication using user data from `mockdata/userData.json`
  - Redirects to dashboard on successful login
  - Stores user session in localStorage

- **Auth Context** (`/app/context/AuthContext.tsx`)
  - Global authentication state management
  - Login/logout functionality
  - User session persistence
  - Protected route handling

### 2. Dashboard Page (`/app/dashboard/page.tsx`)
- **Header Component** (`DashboardHeader.tsx`)
  - Logo display
  - User avatar with initials
  - User name and email display
  - Logout button

- **Search & Filter Functionality**
  - Real-time search across journal titles, content, and tags
  - Mood-based filtering dropdown
  - Combined search and filter results

- **Journal List Display**
  - Grid layout (responsive: 1 column mobile, 2 tablet, 3 desktop)
  - Each journal item shows:
    - Title
    - Content preview (2 lines, truncated)
    - Mood badge with color coding
    - Tags (up to 3 visible, shows count for more)
    - Date and time posted
    - Edit and delete buttons (visible on hover)

- **Journal Item Component** (`JournalItem.tsx`)
  - Clickable card design
  - Hover effects
  - Edit/Delete buttons in top-right corner
  - Mood-based color coding
  - Date formatting using `date-fns`

### 3. Modals

- **Journal View Modal** (`JournalViewModal.tsx`)
  - Full journal details display
  - Formatted date and time
  - All tags displayed
  - Mood badge
  - Full content with proper formatting
  - Close button

- **Journal Form Modal** (`JournalFormModal.tsx`)
  - Create new journal entry
  - Edit existing journal entry
  - Form fields:
    - **Title** (required, validated)
    - **Content** (required, textarea)
    - **Mood** (required, button selection from predefined moods)
    - **Tags** (optional, predefined tags + custom tag input)
  - Validation using Zod schema
  - React Hook Form integration

### 4. Data Management

- **Types** (`/app/types/index.ts`)
  - `User` interface
  - `Journal` interface
  - `JournalFormData` interface

- **Schemas** (`/app/lib/schemas.ts`)
  - Zod validation schemas:
    - `loginSchema` - Email and password validation
    - `journalSchema` - Journal form validation
  - Type inference from schemas

- **Mock Data** (`/app/lib/mockData.ts`)
  - Functions to load journal data
  - Filter journals by user ID
  - Used for development/demo purposes

## Dependencies

### Core Dependencies
- **next**: ^16.1.1 - React framework
- **react**: ^19.2.3 - UI library
- **react-dom**: ^19.2.3 - React DOM bindings
- **typescript**: ^5 - Type safety

### Form & Validation
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **@hookform/resolvers**: Zod resolver for React Hook Form

### Utilities
- **date-fns**: Date formatting and manipulation

### Styling
- **tailwindcss**: ^4 - Utility-first CSS framework

## Pages & Routes

### `/` (Home)
- Redirects to `/login` if not authenticated
- Redirects to `/dashboard` if authenticated
- Shows loading state during redirect

### `/login`
- Login form with email/password
- Validation and error handling
- Redirects to dashboard on success

### `/dashboard`
- Protected route (requires authentication)
- Main application interface
- Search, filter, and journal management

## Components Breakdown

### DashboardHeader
**Location**: `/app/components/DashboardHeader.tsx`

**Props**: None (uses AuthContext)

**Features**:
- Logo display
- User information display
- Logout functionality

### JournalItem
**Location**: `/app/components/JournalItem.tsx`

**Props**:
```typescript
{
  journal: Journal;
  onView: (journal: Journal) => void;
  onEdit: (journal: Journal) => void;
  onDelete: (id: string) => void;
}
```

**Features**:
- Displays journal card
- Hover effects
- Edit/Delete buttons
- Click to view details

### JournalViewModal
**Location**: `/app/components/JournalViewModal.tsx`

**Props**:
```typescript
{
  journal: Journal | null;
  onClose: () => void;
}
```

**Features**:
- Full journal display
- Formatted content
- Close functionality

### JournalFormModal
**Location**: `/app/components/JournalFormModal.tsx`

**Props**:
```typescript
{
  journal?: Journal | null; // If provided, edits; if null, creates new
  onSave: (data: JournalFormData) => void;
  onClose: () => void;
}
```

**Features**:
- Create/Edit form
- Mood selection buttons
- Tag management (predefined + custom)
- Form validation
- Save/Cancel actions

## Validation

### Login Schema
```typescript
{
  email: string (must be valid email)
  password: string (minimum 6 characters)
}
```

### Journal Schema
```typescript
{
  title: string (required)
  content: string (required)
  mood: string (required)
  tags: string[] (optional, defaults to empty array)
}
```

## Mock Data Structure

### User Data (`/app/mockdata/userData.json`)
```json
[
  {
    "id": "uuid",
    "name": "Full Name",
    "email": "email@example.com"
  }
]
```

### Journal Data (`/app/mockdata/journalData.json`)
```json
[
  {
    "id": "uuid",
    "title": "Journal Title",
    "content": "Journal content...",
    "mood": "happy|calm|productive|tired|stressed|relaxed",
    "tags": ["tag1", "tag2"],
    "userId": "user-uuid",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  }
]
```

## Mood System

Available moods with color coding:
- **happy** - Yellow
- **calm** - Blue
- **productive** - Green
- **tired** - Gray
- **stressed** - Red
- **relaxed** - Purple

## Tag System

### Predefined Tags
- morning, evening, work, personal, reflection, gratitude
- coding, learning, health, family, weekend, plans

### Custom Tags
- Users can add custom tags via input field
- Custom tags can be removed like predefined tags

## State Management

### Authentication State
- Managed via `AuthContext`
- Persisted in `localStorage`
- Available globally via `useAuth()` hook

### Journal State
- Managed locally in Dashboard component
- Loaded from mock data
- Updated via CRUD operations

## Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Supported via `dark:` prefix
- **Responsive Design**: Mobile-first approach
- **Component Styling**: Inline Tailwind classes

## User Flow

1. User visits app → Redirected to `/login`
2. User enters email/password → Validated with Zod
3. On success → User stored in context + localStorage
4. Redirected to `/dashboard`
5. Dashboard displays user's journals
6. User can:
   - Search journals
   - Filter by mood
   - View journal details (click card)
   - Create new journal (+ New Journal button)
   - Edit journal (edit icon)
   - Delete journal (delete icon with confirmation)
7. Logout → Clears session, redirects to login

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Access application:
   - Open `http://localhost:3000`
   - Use any email from `mockdata/userData.json`
   - Use any password (minimum 6 characters)

## Testing the Application

### Login Credentials (Mock)
- **Email**: `werald@example.com` or `alex@example.com`
- **Password**: Any password with 6+ characters

### Sample Actions
1. Login with mock credentials
2. View existing journals
3. Search for "reflection" or "coding"
4. Filter by mood "happy" or "productive"
5. Click a journal card to view details
6. Create a new journal entry
7. Edit an existing journal
8. Delete a journal entry

## Key Implementation Details

### Form Validation
- Uses React Hook Form for form state
- Zod schemas for validation
- Real-time error display
- Prevents submission with invalid data

### Protected Routes
- Dashboard checks authentication status
- Redirects to login if not authenticated
- Uses `useAuth()` hook for authentication check

### Data Persistence
- User session stored in localStorage
- Journals loaded from mock JSON files
- State updates trigger re-renders

### Responsive Design
- Mobile-first approach
- Grid layout adapts: 1 → 2 → 3 columns
- Touch-friendly buttons and interactions
- Accessible forms and modals

## Future Enhancements (Not Implemented)

- Backend API integration
- Real authentication (Supabase Auth)
- Database persistence (Prisma + PostgreSQL)
- Image uploads
- Rich text editor for journal content
- Export journals functionality
- Journal categories/folders
- Advanced search filters
- User settings page
- Password reset functionality

## Notes

- Currently uses mock data for development
- Authentication is simulated (no real backend calls)
- All journal operations are client-side only
- Data persists only in component state (lost on refresh)
- Ready for backend integration when API endpoints are available

