# Chore Tracker - TODO

## Critical Bugs
- [x] Fix Submit & Earn button disappearing after photo capture
- [x] Add defensive state management to prevent photoData from being cleared (using useRef)
- [x] Add console logging to debug button visibility issue
- [ ] Test photo submission flow end-to-end on Railway

## Camera Flow Issues  
- [x] Fix "Skip Photo & Complete" button not working (made photo optional in API)
- [x] Fix Submit & Earn button flashing and disappearing after photo capture (using photoDataRef)
- [x] Ensure photoData state persists after taking photo (dual storage: state + ref)
- [x] Improved Retake button to restart camera automatically
- [ ] Test complete camera flow on Railway (take photo → submit → earn money)

## NEW BUG REPORT - Camera buttons still disappearing
- [x] useRef fix didn't work - buttons still flash then disappear
- [x] Root cause: conditional rendering based on photoData existence was unreliable
- [x] Solution: Implemented state machine with explicit cameraView state ('camera' | 'preview')
- [ ] Test camera fix on Railway deployment

## Navigation & Routing Issues
- [ ] Fix 404 error on /kid/:kidId route
- [ ] After logout/login, redirect to dashboard instead of setup page
- [ ] Preserve chores and kids data after logout/login
- [ ] Check if session/authentication is persisting user data correctly

## Settings/Management Page for Parents
- [ ] Create parent settings page accessible from dashboard
- [ ] Allow editing existing kid profiles (name, birthday, pocket money, frequency)
- [ ] Allow adding new kids from settings
- [ ] Allow removing/deleting kids
- [ ] Allow viewing all assigned chores
- [ ] Allow removing chores from kids
- [ ] Allow creating custom chores
- [ ] Allow assigning new chores to kids

## Net Worth Page Issues
- [ ] Debug and fix error on Net Worth page
- [ ] Verify API endpoint /api/kids/:kidId/networth is working
- [ ] Check if data is being fetched correctly
