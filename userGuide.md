# Pocket Money & Chore Tracker - User Guide

## Purpose
A progressive web app designed for iPad that helps kids earn pocket money by completing household chores. Parents set up profiles, assign tasks, and monitor progress while children track their earnings and complete chores with photo verification.

## Access
Public access with parent login required for setup and management. Kids access the dashboard without login.

---

## Powered by Manus

**Technology Stack:**
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui components
- **Backend**: Node.js + Express 4 + tRPC 11 for type-safe API
- **Database**: MySQL with Drizzle ORM for data management
- **Authentication**: Session-based authentication with bcrypt password hashing
- **Storage**: AWS S3 for photo uploads and task completion verification
- **Deployment**: Auto-scaling infrastructure with global CDN via Railway

This modern stack delivers a blazing-fast, type-safe application with real-time data synchronization and enterprise-grade security. The progressive web app architecture enables installation directly to iPad home screens for a native app experience.

---

## Using Your Website

### For Parents

**Getting Started**
Visit the landing page and click "Register" to create your account. Enter a username and password, then click "Create Account" to access the setup wizard.

**Setting Up Kid Profiles**
After login, you'll see "Setup Kid Profiles". Click "Add New Kid" and fill in your child's name, birthday, pocket money amount (like $10), and payment frequency ("Daily", "Weekly", or "Monthly"). Pick an avatar color by clicking the colored circles, then click "Add Kid". Repeat for each child, then click "Continue to Chore Setup".

**Assigning Chores**
The chore selection page shows 56 pre-populated household tasks organized into "Daily", "Weekly", and "Monthly" tabs. Use the search box to find specific chores like "making bed" or "mowing lawns". Click any chore card to select it (you'll see a checkmark). Choose "All Kids" to assign to everyone or "Specific Kids" to pick individuals. Click "Assign X Chore(s)" when ready.

**Monitoring Progress**
Access the dashboard to see each kid's profile card showing their total earnings, progress bar, and remaining pocket money. Click "Settings" (gear icon) in the top-right to manage profiles and view completed tasks with photos.

### For Kids

**Starting Tasks**
From the main dashboard, tap your profile card to see your assigned chores. Browse "Daily", "Weekly", or "Monthly" tabs. When ready to start a chore, tap "READY - Start Timer". The timer begins tracking your work time.

**Completing Tasks**
When finished, tap "Complete Task". The camera opens automatically. Take a photo of your completed work, then tap "Submit & Earn $X". Your earnings update immediately and the photo is saved for parents to review.

**Tracking Progress**
Tap "View My Net Worth & Stats" to see your total earnings, tasks completed, average time per task, and a photo history of all completed chores organized by date.

---

## Managing Your Website

**Settings Panel**
Click the "Settings" icon in the dashboard header to access parental controls (password-protected with your login password). Here you can:
- View and edit kid profiles in the "Database" panel
- Check completed tasks with photos and timestamps
- Modify pocket money amounts and frequencies
- Remove or add new children

**Dashboard Panel**
Monitor real-time statistics including total tasks completed across all kids, earnings distributed, and activity trends. Use this to track family chore completion rates.

**Database Panel**
Direct access to all data tables (kids, chores, tasks, assignments). Use the CRUD interface to manually adjust records if needed, such as correcting earnings or removing duplicate entries.

---

## Next Steps

Talk to Manus AI anytime to request changes or add features.

Ready to teach your kids about earning and responsibility? Create your first kid profile and assign their first chore to get started!
