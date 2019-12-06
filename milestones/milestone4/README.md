## Milestone 4

#Backend Changes




This iteration added a new controller the Tournament controller. The functionality of creating brackets has not yet been implemented but the controller has been designed in a way so that the generation of a bracket functionality could be implemented very quickly.   
 
 This iteration also implemented a service that managed the ratings of teams based on won and lost matches.

The logic that handles the deletion of teams was improved. When a team is deleted now it updates matches to present the 
fact the team has been deleted  and and pending matches are counted as losses and the rating the the teams are updated accordingly.

#Frontend Changes
