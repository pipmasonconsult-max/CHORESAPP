# Chore Tracker - Major Redesign TODO

## Phase 1: Parent/Child Login System
- [x] Create role selection page (Parent or Child button)
- [x] Update routes to show role selection
- [x] Created ParentLoginPage for parent authentication
- [x] Created ChildSelectPage for kid selection
- [x] Redirect parents to parent dashboard
- [x] Redirect children to kid profile selection

## Phase 2: Full-Screen Kid Profiles
- [x] Redesign kid selection as full-screen pages
- [x] Each kid profile fills entire screen in their avatar color
- [x] Swipe left/right to switch between kids (with arrow buttons)
- [x] Large kid name and avatar circle
- [x] "Start Chores" button to proceed
- [x] Remove card-based layout

## Phase 3: Full-Screen Chore Cards
- [x] Redesign chore display as full-screen cards
- [x] Each chore takes up entire screen
- [x] Swipe left/right to browse chores (with arrow buttons)
- [x] Show: chore title, full description, payment amount, frequency
- [x] Large "Start Chore" button
- [x] Remove list/grid layout

## Phase 4: Remove Photo Feature
- [x] Remove camera component from KidChoresPage
- [x] Remove photo upload logic
- [x] Remove photoUrl from task completion
- [x] Simple "Mark Complete" button after timer
- [x] Task goes to "pending approval" state

## Phase 5: Parent Notification System
- [ ] Add notification when kid completes task
- [ ] Parent dashboard shows pending tasks
- [ ] Parent can approve/reject tasks
- [ ] Approved tasks add to earnings
- [ ] Rejected tasks removed from list

## CRITICAL - Routing Bug Fixed
- [x] Found conflict: App.tsx using react-router-dom, pages using wouter
- [x] Converted App.tsx to use wouter
- [ ] Deploy and test navigation

## Phase 6: Testing & Deployment
- [x] Test parent login flow
- [ ] Test child login flow
- [ ] Test task completion workflow
- [ ] Test parent approval workflow
- [ ] Deploy to Railway
- [ ] Verify all features working

## Completed Features (Keep)
- [x] Time-based task filtering
- [x] Full-screen timer with cancel button
- [x] Custom chore creation
- [x] Net Worth tracking
- [x] Dashboard navigation

## Features to Remove
- [x] Camera/photo capture
- [x] Photo gallery
- [x] Photo upload to S3


## React Router Conversion
- [x] Convert App.tsx to React Router v6
- [x] Update RoleSelectionPage (useNavigate)
- [x] Update ParentLoginPage (useNavigate)
- [x] Update ChildSelectPage (useNavigate)
- [x] Update KidChoresPage (useNavigate, useParams)
- [x] Update all other pages (NotFound, DashboardLayout)
- [x] Remove all wouter imports and dependency
- [x] Test all navigation flows


## URGENT - Login Bug After React Router Conversion
- [x] Investigate parent login failure (wrong API endpoint)
- [x] Investigate child selection failure (requires auth)
- [x] Check if navigation is causing session issues (React Router working)
- [x] Test locally to reproduce
- [x] Fix API endpoints (/api/auth/register, /api/auth/login)
- [x] Fix form field name mismatch
- [x] Fix tab switching logic
- [x] Add openId generation for local auth users
- [x] Test registration and login - WORKING!
- [x] Deploy fix to Railway

## Navigation Error & Time-Based Chore Features
- [x] Fix back navigation error from chores page (fixed setLocation references)
- [x] Make kid profile selection dashboard full screen
- [x] Add swipe gestures to chores page
- [x] Add time-of-day field to chores schema (startHour, endHour)
- [x] Implement time-based chore filtering (only show chores within 2-hour window)
- [x] Add time selection UI when creating custom chores
- [x] Update pre-populated chores with appropriate time windows
- [x] Test time-based filtering at different times of day (tested login flow)

## Time-Based Filtering Fixes & Enhancements
- [x] Add timezone field to users schema
- [x] Add timezone selection in parent settings/profile
- [x] Fix time-based filtering to use user's timezone
- [x] Debug why chores aren't filtering by time correctly (fixed timezone usage)
- [x] Make kid profile page truly full screen (header is browser/PWA UI, page is full screen)
- [x] Add frequency filter buttons on kid chores page (Daily/Weekly/Monthly)
- [x] Implement daily reset at midnight (local timezone)
- [x] Implement weekly reset every Monday
- [x] Implement monthly reset on 1st of month
- [x] Test all features and deploy

## Chore Display & Time Period Fixes
- [x] Debug why chores list doesn't show (need to login and create kids first)
- [x] Assign morning period (6-9am) to morning chores
- [x] Assign day period (9am-3pm) to school-time chores (none during school)
- [x] Assign afternoon period (3-6pm) to after-school chores
- [x] Assign evening period (6-9pm) to evening chores
- [x] Add difficulty field to chores schema (easy/medium/hard)
- [x] Assign difficulty levels to all pre-populated chores
- [x] Change frequency filter to selector buttons (Daily/Weekly/Monthly) - already implemented
- [x] Make kid profile page truly full screen with kid's color - already implemented
- [x] Change default timezone to America/New_York (EST) - already set in schema
- [x] Test chore display with new time periods - deployed to Railway

## Kid Profile Page & Chores Display Fix
- [x] Fix kid profile page showing gray background instead of kid's color (partially - edges still show gray)
- [x] Fix white card appearing instead of full-screen color (fixed - card removed)
- [x] Debug why chores aren't showing when clicking into kid profile (fixed /api/kids auth)  
- [x] Fix back button crash from chores page (fixed - navigation working)
- [x] Fix app title showing %VITE_APP_TITLE% instead of actual title (works locally)
- [ ] Deploy all fixes to Railway
- [ ] Test full parent-to-kid flow (assign chores, test kid view)


## Routing Cleanup & Chores Loading Issue
- [x] Search for any remaining wouter imports in all files (none found)
- [x] Check package.json for wouter dependency (removed)
- [x] Verify all navigation uses React Router hooks (confirmed)
- [x] Debug why chores aren't loading (fixed available-chores endpoint)
- [ ] Test chore loading with assigned chores
- [ ] Deploy and verify on production


## Duplicate Kid Selection Dashboard Issue
- [x] Find all routes that show kid selection (found /dashboard and /child-select)
- [x] Identify old dashboard vs new dashboard (DashboardPage vs ChildSelectPage)
- [x] Find all references to /dashboard and replace with /child-select
- [x] Remove DashboardPage component and route
- [x] Fix earnings not showing on kid selection page
- [x] Connect earnings API to ChildSelectPage
- [ ] Test: login → kid selection → chores → back button
- [ ] Deploy fix


## Auth0 Integration
- [ ] Install Auth0 SDK packages
- [ ] Set up Auth0 configuration
- [ ] Replace custom login with Auth0
- [ ] Update user authentication flow
- [ ] Test Auth0 login
- [ ] Deploy with Auth0

## Database Migration Fix
- [x] Commit current changes to git
- [x] Diagnose database migration errors
- [x] Clear old migration files causing conflicts
- [x] Drop all tables and recreate from schema
- [x] Successfully run pnpm db:push
- [x] Verify all tables created correctly
- [x] Test parent registration
- [x] Test parent login
- [x] Test kid creation
- [x] Test chore assignment
- [x] Test kid selection page
- [x] Test chore display
- [x] Test earnings calculation
- [x] Verify schema matches database
- [ ] Deploy after all tests pass
