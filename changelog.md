## Known issues / bugs
- On IOS v12 new sessions shows right time in input, but time + tzoffset when shown in table

## Roadmap / Ideas
- Improve TimerTimeInput and make more similar to original Officetime
- Changing category rate should give possibility to update all or future session rates.



## Changelog

v0.6.4
- Added notes and active indicator to projects. Show only active projects in projects select
- bug: deleting or moving a running session, does not stop the timer
- bug: Imports expenses are added as sessions instead of expenses
- bug: Report should export complete data including ProjectId, CategoryId and expense (true/false)
- bug: Reports Time should not break in lines on small screens

v0.6.3
- improved styling for dark theme
- dependencies updated

v0.6.2
- Reminder for backups
- Fixed table high for all tables except Reports

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