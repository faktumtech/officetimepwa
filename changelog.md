## Known issues / bugs
- TimerTimeInput input in minutes should not alter hours input (see behaviour original Officetime)
- On IOs the pwa will mantained in memory for a uncertain time and only update the serviceworker if a manual reload is triggered or the app cache is emptied

## Roadmap / Ideas
- Reminder for backups
- Allow Keyboard shortcuts for stop / start / pause

## Changelog

v0.5.3
- mechanism to trigger serviceWorker update manually (important for IOS)
- bug: mockSessions creating uncomplete session data
- bug: ProjectEdit / CategoryEdit should submit at Enter
- bug: alert is not closed after closing underlying modal

v0.5.0
- handle expenses

v0.4.6
- bug: audioContext. Error on IOS