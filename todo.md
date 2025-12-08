# Pocket Money & Chore Tracker - Complete Rebuild TODO

## Phase 1: Database Schema & Authentication
- [x] Update schema.ts with all new tables (bank_accounts, investments, transactions, time_entries, achievements, etc.)
- [x] Add real authentication with bcrypt password hashing
- [x] Update users table with passwordHash field
- [x] Run database migrations (pnpm db:push)
- [x] Verify all tables created correctly

## Phase 2: Dependencies Installation
- [x] Install animation libraries (framer-motion, react-spring)
- [x] Install audio library (howler)
- [x] Install chart libraries (recharts, victory)
- [x] Install gesture libraries (react-swipeable, embla-carousel-react)
- [x] Install confetti libraries (react-confetti, canvas-confetti)
- [x] Install date utilities (date-fns, date-fns-tz)
- [x] Install bcrypt for password hashing
- [x] Verify all dependencies installed

## Phase 3: Liquid Glass Design System
- [ ] Update Tailwind config with glass effects
- [ ] Create global CSS with backdrop-filter and glass utilities
- [ ] Create reusable Glass components (GlassCard, GlassButton, GlassModal)
- [ ] Update theme with gradient meshes and vibrant colors
- [ ] Test glass effects in browser

## Phase 4: Authentication System
- [ ] Implement real bcrypt password hashing in registration
- [ ] Implement password verification in login
- [ ] Update auth routers with proper security
- [ ] Test registration with password hashing
- [ ] Test login with password verification

## Phase 5: Bank Account System
- [ ] Create bank account database helpers
- [ ] Build bank account tRPC routers (list, create, transfer)
- [ ] Create default accounts on kid creation (MAIN, SAVINGS)
- [ ] Build BankAccountPage component with glass design
- [ ] Build automatic transfer system
- [ ] Test account creation and transfers

## Phase 6: Investment System
- [ ] Create investment database helpers
- [ ] Build investment tRPC routers
- [ ] Implement compound interest calculation logic
- [ ] Create cron job for daily investment calculations
- [ ] Build InvestmentDashboard component
- [ ] Test investment creation and calculations

## Phase 7: Time Tracking System
- [ ] Create time tracking database helpers
- [ ] Build time tracking tRPC routers
- [ ] Update task completion to record hours
- [ ] Build TimeTrackingDashboard for kids
- [ ] Build parent analytics dashboard
- [ ] Create achievement system for hour milestones
- [ ] Test time tracking end-to-end

## Phase 8: Music & Audio System
- [ ] Upload music tracks to S3 or public folder
- [ ] Create audio service with Howler.js
- [ ] Build MusicPlayer component
- [ ] Add music playback on task start
- [ ] Add sound effects for all interactions
- [ ] Add volume controls
- [ ] Test audio playback

## Phase 9: Payout System
- [ ] Build payout checking logic
- [ ] Create payout prompt modal
- [ ] Implement standard payout flow
- [ ] Implement investment payout option
- [ ] Implement custom split payout
- [ ] Add automatic savings transfer (10%)
- [ ] Test payout flows

## Phase 10: UI Updates with Liquid Glass
- [ ] Update Home/Landing page with glass design
- [ ] Update ParentLoginPage with glass effects
- [ ] Update ChildSelectPage with full-screen glass
- [ ] Update ChoreDisplayPage with glass cards
- [ ] Update all buttons with glass effects
- [ ] Update all modals with glass overlays
- [ ] Add animations and transitions
- [ ] Add confetti effects for achievements

## Phase 11: Testing & Deployment
- [ ] Test parent registration and login
- [ ] Test kid creation with default accounts
- [ ] Test chore assignment and completion
- [ ] Test bank account transfers
- [ ] Test investment creation
- [ ] Test time tracking display
- [ ] Test music playback
- [ ] Test payout system
- [ ] Commit all changes to git
- [ ] Push to GitHub for Railway deployment

## Railway Deployment Fix
- [x] Create custom migration script to handle schema changes
- [x] Update package.json migrate command
- [x] Test migration locally
- [x] Push to GitHub and verify deployment
