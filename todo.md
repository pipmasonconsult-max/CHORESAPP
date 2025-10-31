# Chore Tracker - Project TODO

## Phase 1: Setup & Configuration
- [x] Initialize web development project
- [x] Configure Railway deployment settings
- [x] Create GitHub repository and push initial code

## Phase 2: Database & Backend
- [x] Design database schema (users, kids, chores, tasks, photos)
- [x] Create database migrations
- [x] Implement backend helper functions
- [x] Create API endpoints

## Phase 3: Authentication & Parental Controls
- [x] Build parental login system
- [x] Implement session-based authentication
- [x] Build frontend UI for authentication
- [ ] Implement password-protected settings page

## Phase 4: Kid Profile Management
- [x] Create kid profile setup page
- [x] Add fields: name, birthday, pocket money amount, payment frequency
- [x] Implement profile CRUD operations

## Phase 5: Chore System
- [x] Create 50+ pre-populated household chores
- [x] Add custom chore creation feature
- [x] Implement chore frequency settings (daily, weekly, monthly)
- [x] Add chore assignment (specific kids or all kids)
- [x] Configure chore types (shared vs individual)
- [x] Set realistic payment amounts based on effort

## Phase 6: Kid Dashboard & Task Completion
- [x] Build kid dashboard showing profiles and earnings
- [x] Create task list organized by frequency
- [x] Implement "READY" button and timer tracking
- [x] Add "COMPLETE" button with photo upload
- [x] Display remaining pocket money to earn
- [x] Store completion photos with metadata

## Phase 7: Net Worth & Analytics
- [ ] Create net worth page for kids
- [ ] Show detailed task breakdowns
- [ ] Display earnings history
- [ ] Add performance metrics

## Phase 8: Task Scheduling & Logic
- [ ] Implement task reset based on frequency
- [ ] Add first-come-first-served logic for exclusive tasks
- [ ] Create recurring task availability for personal chores
- [ ] Build task completion tracking

## Phase 9: PWA & iPad Optimization
- [x] Fix PWA manifest for Android Chrome installation
- [x] Add service worker for offline support
- [ ] Optimize UI for iPad screen sizes
- [ ] Implement touch-friendly controls
- [ ] Configure app icons and splash screens
- [ ] Test PWA installation on Android and iOS

## Phase 10: Testing & Deployment
- [ ] Test all features end-to-end
- [ ] Verify Railway deployment configuration
- [ ] Create user guide
- [ ] Save checkpoint for deployment

## Railway Deployment Crash Investigation
- [x] Check Railway deployment logs
- [x] Verify build script configuration
- [x] Ensure all production dependencies are installed
- [x] Fix path.resolve error using fileURLToPath for ESM
- [x] Test production build locally
- [x] Verify fileURLToPath works in production build
- [x] Fix vite.config.ts to use fileURLToPath
- [ ] Deploy and verify on Railway

## iPad PWA & Registration Fixes
- [x] Fix PWA manifest for full-screen iPad display
- [x] Add proper viewport-fit meta tag for iPad
- [x] Update display mode to standalone
- [x] Add postbuild script to run database migrations
- [ ] Test registration on Railway deployment after migration

## Railway Build Fix
- [x] Remove postbuild script (DATABASE_URL not available during build)
- [x] Update start script to run migrations before server starts
- [ ] Test build and deployment on Railway

## Database Migration Fix
- [x] Change migrate script from "generate && migrate" to "push"
- [x] Update start script to use correct migration command
- [ ] Test on Railway to ensure password column is created

## Registration 500 Error Fix
- [x] Check Railway logs for migration errors
- [x] Verify drizzle-kit push is actually running
- [x] Found Issue 1: Foreign key constraint error (chore_id incompatible with id)
- [x] Found Issue 2: Registration returns NaN for user ID
- [x] Fix foreign key column types in schema (changed serial to int autoincrement)
- [x] Fix registration logic to properly handle BigInt insertId
- [ ] Drop existing Railway database tables
- [ ] Deploy and test on Railway

## Database Reset Endpoint
- [x] Create /api/admin/reset-database endpoint
- [x] Add password protection to reset endpoint
- [x] Deploy to Railway
- [x] Call reset endpoint to drop tables
- [x] Verify migrations run successfully (password column created!)
- [x] Test registration on Railway
- [x] Fix NaN insertId issue in registration (check result[0].insertId)
- [x] Test kid profile creation
- [x] Fix "Add Kid" button not adding new kids (fixed insertId extraction)
- [x] Debug kid profile creation API endpoint
- [x] Fix insertId extraction in database helpers (createKid, createCustomChore, startTask)
- [x] Add password column to users table via SQL
- [x] Make openId column nullable via SQL

## MAHI Rebranding
- [x] Create MAHI logo and app icons
- [x] Update app name to MAHI in manifest.json
- [x] Update app title in index.html
- [x] Update branding in landing page
- [x] Create 192x192 and 512x512 PWA icons
- [x] Create apple-touch-icon.png
- [ ] Test PWA opens without browser UI on iPad

## Kid Creation Error Handling
- [x] Add error toast messages to kid creation form
- [x] Display detailed error messages from API responses
- [ ] Test error messages on Railway deployment

## Railway Full Testing & Fixes
- [x] Test registration on Railway
- [x] Test kid creation on Railway
- [x] Fix any database schema issues (tables created successfully)
- [x] Verify migrations run correctly
- [x] Fix session cookie issue (401 errors)
- [x] Add trust proxy setting for Railway
- [x] Configure sameSite cookie attribute
- [ ] Ensure all features work end-to-end

## Settings & Camera Bugs
- [x] Fix settings page 404 error (SettingsPage created)
- [x] Investigate settings route configuration (route added)
- [x] Fix camera not opening on iPad/Safari (added delay and better constraints)
- [x] Add back/cancel button to camera modal
- [x] Improve camera error handling and user feedback
- [x] Add fallback option to complete task without photo (Skip Photo button)
- [ ] Test camera on iOS Safari with proper constraints
- [x] Create Net Worth page to show kid's total earnings
- [x] Add Net Worth navigation button to KidChoresPage
- [x] Fix background music not looping when task is initiated (audio plays/loops during tasks)

## Chore Loading Issues
- [ ] Fix chores not appearing in kid's chore list
- [ ] Debug chore fetching API endpoint
- [ ] Verify chore_assignments table relationships
- [ ] Test chore creation and assignment flow

## Camera Flow Issues
- [x] Fix "Skip Photo & Complete" button not working (made photo optional in API)
- [ ] Fix photo submission - add Submit/Use Photo button after capture
- [ ] Show captured photo preview before submission
- [ ] Test complete camera flow on Railway (take photo → submit → earn money)
