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
- [ ] Add PWA manifest and service worker
- [ ] Optimize UI for iPad screen sizes
- [ ] Implement touch-friendly controls
- [ ] Add offline support
- [ ] Configure app icons and splash screens

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
- [ ] Test kid profile creation
- [ ] Fix any identified issues
