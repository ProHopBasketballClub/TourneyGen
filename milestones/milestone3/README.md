# Milestone 3

### User Stories

#### E-sports Manager Story

The first user story we implemented was the e-sports manger needing to manage multiple leagues in one place. 
This story was addressed by us creating a home page that allows users to login and view the leagues that they own.
Each league can also be viewed for a more in-depth view. This view displays the game type, description 
and tournaments that relate to this league. 

#### Football League Owner Story

The second user story that we implemented was a football league owner needing to manage the tournaments
and information associated with a league. This user story was implemented by creating a page where the user is 
able to edit or delete leagues that they own. 

### Static Analysis 

The static analysis for Team 3-6 project is handled by code inspector reports can be found [here](https://www.code-inspector.com/project/preferences/658). 

The code coverage report is available in the codecov.txt file.

Several other metrics can also be explored by examining the badges on the home page of this repository.

### Design Problems

A major design issue that we encountered in our design plan was the frontend of the system was supposed to be served statically.
Once we began implementing this, we realized if the frontend was static we would not be able to tie in our variables properly.
This presented a major design decision, we would either have to refactor to make the frontend dynamic or investigate a new way 
to incorporate our variables. The solution we decided on was to make the frontend dynamic. We chose to pursue this becasue 
it was a guaranteed solution and opened up more possibles for the system.

The other major design issue that we encountered was consistency in naming. The backend and front end must interface 
though an api. This api is very strict and we encountered several issues of variables being named with different conventions. 
An example of this is the backend was implemented to accept a parameter called id, the frontend was implemented to send 
a parameter called Id. This change of case was enough to cause the api to return an error. The solution to this was to have 
a meeting and decide how parameters should be named. We decided to use Pascalcase for object and lowercase for query parameters


