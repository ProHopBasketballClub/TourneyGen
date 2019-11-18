### Milestone 4

#### Backend Changes

This iteration added 2 more controllers. The first was the Team controller. 
This allows league owners to setup a team with a Roster of players.

The second was the Match controller. This controller allows teams to setup matches against each other.
After a match is played both teams have to report the outcome. This will change the match to either confirmed or 
conflicted. To resolve a conflict the league owner must intervene and report the outcome.

There have also been several bug fixes since the last sprint and more unit tests have been added.

Notable fixes 

The system now properly validates empty update fields.

The update endpoints no longer nulls fields if they are included

Move some validation functions to a new class to make code cleaner

#### Frontend Changes
