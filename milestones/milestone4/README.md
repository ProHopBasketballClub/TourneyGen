## Milestone 4

#Backend Changes




This iteration added a new controller the Tournament controller. The functionality of creating brackets has not yet been implemented but the controller has been designed in a way so that the generation of a bracket functionality could be implemented very quickly.   
 
 This iteration also implemented a service that managed the ratings of teams based on won and lost matches.

The logic that handles the deletion of teams was improved. When a team is deleted now it updates matches to present the 
fact the team has been deleted  and and pending matches are counted as losses and the rating the the teams are updated accordingly.

#Frontend Changes

This iteration added match functionality, as well as reporting matches on the front end. When you are in league view, you can see all of the matches within that league, as well as the status of the match.

Additionally, the way the frontend sends asynchronous requests to the API was improved in a way that cleans up the code, preventing very nested callbacks in routes that require multiple requests.

This iteration also added the deletion of teams, which will also cascade report any unfinished matches that team is part of.

Lastly, win/loss records are now displayed on teams and matches, as well as the ratings of teams (or ELO), which is based on their wins and losses. 

