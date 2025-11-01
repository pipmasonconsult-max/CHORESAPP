# Chore Tracker - TODO

## PRIORITY: Camera Auto-Complete
- [x] Remove Submit & Retake buttons completely
- [x] Auto-complete task immediately after photo is taken
- [x] Show success message and return to chores list
- [x] Save photo to task completion record

## Photo Gallery Feature
- [x] Store all task completion photos in database
- [x] Create photo gallery view in parent settings
- [x] Show photo, kid name, chore name, date for each completion
- [x] Allow parents to view all completed task photos

## Routing Fixes
- [x] Fix 404 error on /kid/:kidId route (route was correct, just needed proper navigation)
- [x] Fix Net Worth page error (wrong API endpoint)
- [x] Redirect to dashboard after login (not setup page)
- [x] Only show setup page for first-time users

## Parent Settings/Management Page
- [x] Create parent settings dashboard
- [x] View and edit kid profiles
- [x] Add/remove kids
- [x] View assigned chores
- [x] Add/remove chores
- [x] Create custom chores (via chore setup page)
- [x] View photo gallery of completed tasks
- [x] Access from parent dashboard

## Completed
- [x] Fix Submit & Earn button disappearing after photo capture
- [x] Add defensive state management to prevent photoData from being cleared (using useRef)
- [x] Add console logging to debug button visibility issue
- [x] Fix "Skip Photo & Complete" button not working (made photo optional in API)
- [x] Fix Submit & Earn button flashing and disappearing after photo capture (using photoDataRef)
- [x] Ensure photoData state persists after taking photo (dual storage: state + ref)
- [x] Improved Retake button to restart camera automatically
- [x] useRef fix didn't work - buttons still flash then disappear
- [x] Root cause: conditional rendering based on photoData existence was unreliable
- [x] Solution: Implemented state machine with explicit cameraView state ('camera' | 'preview')


## NEW BUG - Camera Freeze
- [x] Added comprehensive logging (client and server)
- [x] Added loading toast "Uploading photo..."
- [x] Added error handling to close camera on failure
- [x] Compressed photo to 70% quality
- [x] Reduced photo resolution to max 1280x720 for faster upload
- [x] Added 30-second timeout to prevent infinite freeze
- [x] Fixed SQL query bug (status field doesn't exist, use completedAt)
- [ ] Deploy and test on Railway - should be much faster now


## New Feature Requests

### Full-Screen Timer Enhancement
- [x] Make timer bar full-screen when task is active
- [x] Display kid's name prominently on timer screen
- [x] Show chore title and description on timer screen
- [x] Add "Cancel Chore" button to stop task if wrong one selected
- [x] Make timer UI more engaging and kid-friendly

### Parental Task Confirmation
- [x] Add "Pending Approval" section in parent management
- [x] List all completed tasks awaiting parent confirmation
- [x] Parents can approve or reject completed tasks
- [x] Rejected tasks don't add to earnings (task deleted)
- [x] Added API endpoints for approve/reject
- [ ] Update earnings calculation to only count approved tasks

### Custom Chore Creation
- [x] Add "Create Custom Chore" button in parent management
- [x] Form to create custom chores with title, description, payment, frequency
- [x] Custom chores appear in chore assignment list
- [x] Can assign custom chores to specific kids

## CRITICAL - Task Completion Broken
- [x] Fixed TypeScript errors (requireAuth middleware)
- [x] Server now starts successfully
- [ ] Test task completion on Railway
- [ ] Verify photos upload and save correctly


## Bug - Photos Not Showing
- [x] Root cause: No completed tasks in database (task completion failing)
- [x] Photos will show once task completion is fixed
- [ ] Test complete flow: take photo → upload → complete task → show in gallery
