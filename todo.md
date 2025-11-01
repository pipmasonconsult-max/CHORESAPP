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
