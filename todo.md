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
