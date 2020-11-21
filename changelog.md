## Known issues / bugs
- TimerTimeInput input in minutes should not alter hours input (see behaviour of original Officetime)
- On IOs the pwa will mantained in memory for a uncertain time and only update the serviceworker if a manual reload is triggered or the app cache is emptied
- On IOS v12 new sessions shows right time in input, but time + 1 hour when shown in table

## Roadmap / Ideas
- Reminder for backups
- Fixed table high like in SessionsTable for all Tables

## Changelog

v0.6.1
- bug: Import does not parse correctly "dd/MM/yyyy hh:mm" formated date strings
- improved formating for table columns

v0.6.0
- let user import data from csv

v0.5.4
- Allow Keyboard shortcuts for stop / start / pause
- Save option for reports

v0.5.3
- mechanism to trigger serviceWorker update manually (important for IOS)
- bug: mockSessions creating uncomplete session data
- bug: ProjectEdit / CategoryEdit should submit at Enter
- bug: alert is not closed after closing underlying modal

v0.5.0
- handle expenses

v0.4.6
- bug: audioContext. Error on IOS