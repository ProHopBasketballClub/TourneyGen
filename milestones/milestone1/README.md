# Milestone 1

### User Stories:

Each of these user stories are captured in relating projects (linked). These projects each contain issues which make up the body of work required to make that user story work. Further, captured within the [milestones](https://github.com/seng350/seng350f19-project-team-3-9/milestones "Team 3-9 System Milestones") of the project are the steps and general order that we are going to take to implement the system.

[1.](https://github.com/seng350/seng350f19-project-team-3-9/projects/1 "Base webpage project") As a football league owner, I need to manage my league’s tournaments and matches so I can maintain an organized structure within my league.

[2.](https://github.com/seng350/seng350f19-project-team-3-9/projects/7 "Add tournaments project") As a tournament organizer I need to create a tournament which users can leave before the bracket is created. Once the bracket is created, the teams can no longer leave so that the bracket is not disrupted by teams leaving. I need the tournament to have the ability to be viewed publicly by teams within the tournament so they can see who they play as the tournament progresses. 

[3.](https://github.com/seng350/seng350f19-project-team-3-9/projects/6 "Adding matches project") As a esports competitive league owner I need to track league participants’ skill based on some score which reflects their ranking so that I can differentiate the skill level of each team.

[4.](https://github.com/seng350/seng350f19-project-team-3-9/projects/2 "User home page project") As an e-sports gaming manager, I need to manage multiple leagues in one place so that I can easily track all of the leagues for the different esports that I run. 

[5.](https://github.com/seng350/seng350f19-project-team-3-9/projects/3 "Adding teams to league project") As a league owner, I need to add and remove teams from my league as the league members change. 

[6.](https://github.com/seng350/seng350f19-project-team-3-9/projects/4 "Change team info project")  As a team owner I need to manage my team info so I can keep track of my team’s roster and other information.

[7.](https://github.com/seng350/seng350f19-project-team-3-9/projects/5 "Adding teams to home page project") As a coach for 4 different teams, I need to manage all 4 teams within their leagues from one place.

### Quality Attributes:

The quality attributes of this system are caputres in 7 tickets (GH-1, GH-2, GH-3, GH-4, GH-5, GH-6, and GH-7.) Three of these tickets (GH-3, GH-5, and GH-6) all expain how testing for them should be implemented in the actual system. Others are simpy there as a course requirements, and will be considered in implementation. For easy reference, the 7 quality attributes are included here: 

Attribute: Accessibility
Goal: The system should be made to be as accommodate as many people as possible.
Stimulus: When the build pipeline is run every view is checked with achecker.ca.
Stimulus source: A front end code is pushed to the remote.
Response: If the any of the views in the system dont achieve at-least a score of 80% from achecker.ca the build fails.
Response Measure: Score from achecker.ca converted to a perentage

Attribute: Fault tolerance
Goal: If the app enters a state from which it cannot recover fails safes are engaged and a new instance of the app is spawned and the failed app is terminated. Common faults should be tests to see if the app is able to recover from them. Such as null references, negative indexes and overflows.
Stimulus: A backend code change is made;
Stimulus Source: A backend merge is initiated.
Response Measure: Is the app able to recover from these issues gracefully and without manual input.

Attribute: Testability
Goal: The system should not suffer from any preventable regressions. Every API endpoint is also covered by at-least one unit test.
Stimulus: Any code change is made.
Stimulus source: Code is pushed to the remote.
Response: If any of the unit tests fail the build fails and the branch is unable to be merged.
Response Measure: Number of unit tests that fail on build.

Attribute: Learnability
Goal: The app should be quick to learn and easy to use for people of all abilities. A user should be able to navigate the app with proficiency within 20 minutes of experience. UI pages should be examined by a tests team to see if the control flow differs from user expected behaviour.
Stimulus: There is a change made to the UI or control flow.
Stimulus Source: Front end PR
Response: If a tester stumbles while trying to use the system or requires an in depth explanation of how to use a feature the features UI and control flow should be re-examined.
Response Measure: Time to become proficient with the system in minutes.

Attribute: Maintainability
Goal: The code should be easy to work on and be consistent in style. The source code achieves a perfect score when run against a code smells engine and passes a linter that enforces googles Typescript format. All source code that is committed will have eslint format the code and run against the code smells engine in the build pipeline.
Stimulus: Code is pushed to the remote.
Response: If the code does not pass the formatter it cannot be merged into any other branch and the build fails. If the code smells tests does not achieve the required score it must be re-examined by the whole team before merge.
Response Measure: The formatter must have no errors or warnings and the code smells must achieve the equivalent of an 80% score.

Attribute: Resiliency
Goal: A malicious user should not be able to put the system into a state into which it cannot recover. Input pages should be fuzz tested whenever changes are made and the app should not crash.
Stimulus: A change is made to a front end input or a backend change.
Stimulus Source: Back-end PR or Select front end PRs
Response: If the test put the system into a state from which it cannot recover the change is rejected.
Response Measure: If the testing is able to put the system into a bad state.

Attribute: Consistency
Goal: System UI pages that perform the same method should be at least 60% similar input placement. Examine structure of input and each major difference subtract 10% and 5% for minor.
Stimulus: A new UI page is added to the system
Stimulus Source: Front-End PR
Response: If the percentage is lower than 60% the PR is rejected and the changes reverted.
Response Measure: Similarity percentage
