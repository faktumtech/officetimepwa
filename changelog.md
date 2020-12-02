## Known issues / bugs
- On IOS v12 new sessions shows right time in input, but time + tzoffset when shown in table
- Bug: After adding, editing or deleting a Project or Category, ESC does not close dialog

## Roadmap / Ideas
- Improve TimerTimeInput and make more similar to original Officetime
- Allow cursor to move between sessions


## Changelog

v0.6.9
- replace TimerBtn v-progress-circular with less cpu consuming animation

v0.6.8
- Save itemsPerPage setting of sessions tables
- Remember backup rejection for 1 day

v0.6.7
- Changing category rate gives possibility to update all or future session rates
- bug: categories not updating correctly

v0.6.6
- bug: changes in ProjectEdit or CategoryEdit are commited even when canceling

v0.6.5
- improved font loading and elimination of non woff2 fonts
- improved Import display and error handling
- Project Select: show in alphabetical order

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