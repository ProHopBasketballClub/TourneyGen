### Milestone 3.5

#### Backend Changes

This iteration added 2 more controllers. The first was the Team controller. 
This allows league owners to setup a team with a roster of players.

The second was the Match controller. This controller allows teams to setup matches against each other.
After a match is played both teams have to report the outcome. This will change the match to either confirmed or 
conflicted. To resolve a conflict the league owner must intervene and report the outcome.

There have also been several bug fixes since the last sprint and more unit tests have been added.

Notable fixes 

The system now properly validates empty update fields.

The update endpoints no longer nulls fields if they are not included in the request body

Moved some validation functions to a new class to make controller code cleaner

#### Frontend Changes

In this iteration, the ability to create a new team was added. This is done by clicking add team in the league view as the owner of the league, and then adding a user by email.

Additionally, in league view the list of teams within the league are listed and available to click on.

If a team is clicked on, there is now a team view page where any team can be viewed, and the team owner has access to admin tools that currently allows the team owner only to edit their team information.

This iteration also added error message display on the front end. The errors are stored in an app wide variable, and every time a page is rendered it checks if there are any errors to display, and if there are it will flash the error messages and clear the error variable. The error messages are created when a HTTP request to the API returns an error, such as an empty field in a post request or when a user tries to register an account with a username that already exists.
