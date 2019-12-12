\# Team 3-9 Project Retrospective
For our software architecture course, team 3-9 developed a league management web-app called TourneyGen. 
This web-app has two basic flows for users. 

The first is the ability to manage a league of sports teams (an intramural college basketball team for example). A user can sign
up for an account with TourneyGen, and then simply create a league. Once they've created the league, they will be able to
add teams to the league. Teams are controlled by a "team owner" (the second basic flow on the app). Once at least 2 teams have
been created, the "league owner" can create matches to be played by these teams. TourneyGen will then use self-reported stats
from these matches to create stats about the teams.

The second flow is that of a "team owner". A team owner must register an account before they can be given a team. Once they've
registered an account, a league owner is able to create a team, and set the user as the owner. An owner has the ability to
self-report the outcomes of matches, as well as edit information about their team.

## Lessons we learned, and how to improve
In the process of creating this project, the team learned a few important lessons.

The first lesson is a reinforced lesson from a previous course: the importance of synchonizing a team's view of the
to-be-developed app. At the beginning of the project, before any code was written, the team had 2 meeting to synchonize
our views on the app. Each of these meetings were an hour each, and saw the team discussing the planned features,
how they would look, what was needed to develop them, etc. This worked great for the first portion of the project, as
the team in general had a very *same-brain* view of the app. However as the proeject grew larger and the last discussions 
about how the app worked grew older this *same-brain-ness* of the app dissolved. Thanks to this, the team learned the
importance of having follow-up meetings on design as the project grows larger. Follow-up meetings would have allowed
the team to refresh their understanding of the app, as well as catch any divergences from the original design earlier.

The next lesson that we learned was the importance of managing scope at the design phase of the project. As we furthered our completion of the
app, we realized that compromises needed to be made. In order the project to be completed on time the team had to make decisions
on cutting features, ignoring the design, or allowing the overall project quality to suffer. The most ideal of these the team
decided was cutting features, as other ways of saving time were simply increasing technical debt and slowing the rest of the
development. Cutting features required the team to look at the design and what was already developed in order to effectively
target portions of the app that weren't required for the app to be functional as a whole. The team identified that tournaments
could be removed and still maintain all required features. Users could still simulate tournaments with the matches, they simply
wouldn't have a UI for it. This issue at the design level allowed us to realize the importance of measuring the scope of a
project, and not designing in too many features.

The final lesson that we learned was the importance of not allowing any one member to be "in-charge" of a specific portion
of the app. When we started the project, the team decided that certain developers would only work on certain portions of the
app. In theory, this could work as it is used in practice on larger systems. However, we discovered that (especially when
adding in the delay of team-members not investing 100% of their time to the project as would be in a work-place) this only
lead to a decrease in overall efficiency in developing the app. Whenever a front-end developer would encounter a problem
with the back-end, rather than fixing the issue and moving on, they would contact a back-end developer to fix it. Further, 
this management choice baked-in an increase in our bus-factor. Rather than the whole project dying with a developer, portions
of it would (effectively killing the whole project.) Near the end of the project, where time was most important, these rolls
began to break down, and front-end developers would make back-end changes when they encountered problems. However, this was
too little, too late as their lack of familiarity with the back-end resulted in them being slowed down by learning how
it was designed. Overall, the team realized the importance of having developers work on all portions of the system from
this mistake, as it caused "bubbles" of tacit knowledge which slowed the team down as a whole.

## Design Flaws?
Team 3-9 invested a significant amount of time at the set-out of the project to designing the system, and thanks to this
we overall had very few design-specific issues with the system itself. However, this doesn't mean the design was without
flaw. Rather than there being techincal issues with the project, the design lead to *soft-design-flaws*. These design flaws
were inherant to the way we developed the system, rather than how the system itself was developed. Overall, there were
2 main classes of soft-design-flaws. The first (as discussed above) was allowing ourselves to be labeled as "front-end" or 
"back-end" developers. This simply put caused the system to act like two seperate systems, rather than one system with 
two components. Next, there was simply put too many features baked into the overall project; another soft-design-flaw. 
The system as desgned was too large to be developed in the alotted time, forcing the team to make awkward decisions 
about the development, despite following the overall design properly. Finally, the team made the mistake of only having
meetings when absolutely necessary; this lead to the final product to slip from the original design, requiring it to be
re-worked to follow the design properly. In the future development of this app, regular meetings should be scheduled to 
ensure that the team understands how the app is meant to be developed, and to ensure that current development follows that
plan.

## What's next
From the beginning, the plan for this app was to continue it as a personal-team-project. To do this however, we are simply
going to take the important pieces learned from the design, and throw out the rest. Simply put, the stack for this app was
obsolete on launch, and as a result slows the development significantly.

### The Backend
The backend of this app is going to be completely scrapped. It will most-likely be replaced with either a Java a Python based
backend technology. This will allow our developers to both develop multi-threaded optimizations for the application, as well
as to enjoy a more rapid development with more fleshed out tools.

### The Frontend
This will be replaced more slowly. As designed, the frontend simply interfaces with an API to display all the necessary
formation to a user, and to create and update that information. Thanks to this design decision, we are able to re-start
development of a new backend without interrupting the flow of the current application.

## Suggestions for the future
I know that this is outside of the scope of this retro, but I feel it could be useful for the future of this course. 
While speaking with many classmates, I've found that the general consesnsus is that this project seemed fairly 
perpendicular to what we were learning in the course. Further, we felt that the "lesson" we were meant to learn about
ORMs didn't really pan out (with little-to-no lab or lecture time being spent on it.)

For the future of this course, our team suggests that the project should be planned to be built smaller, and alongside the
lecture material. For example, the first weeks of the course could be dedcated to a quick overview of *high-level* design
patterns (ie, not code-level, but system-level). This could be made analogous to the first milestone being a rough-draft
design of the project. Then in the following weeks, how to plan a project, how to select frameworks, etc could be taught,
and with it a milestone for the final-draft of the project's design. Finally, the course could focus further on actual
design processes, etc (as opposed to tactics used to select how to design the system.) We believe focusing on actually
designing in lecture (rather than how to select what to design) would be more useful in our day-to-day careers, as 
software engineering very often manifests itself as designing a project to specification given to the developer. This requires
a software engineer to know how to design a system, rather than needing to know what areas to focus on during the design.
