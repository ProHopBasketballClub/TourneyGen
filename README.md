# Team 3-9  -  SENG-350
Hello, we're team 3-9. We're not really sure what the
requirement to include 'you team's name' means, so 
we will from now on be known as 'Panznir',
a portmanteau of Mjolnir and Panzer, the only
ideas we had for a team name.

Ignore all the other code and Jenkins stuff you see here
we *promise* we haven't already started development.

# Project ideas
If you ignore the source code, you can also live with the
idea that we haven't already selected out idea.

## Idea I - TourneyGen
What is TourneyGen? Simple, its a webapp you can go to 
if you want to create a tournament bracket for a game.
But that's not it, you can also go here to set up a 
skill-tracked league where each match will update
the skill rating of any teams. Further, you can 
organize as many tournaments as you would like
within that league! sounds fun

## Idea II - Cloud Compute Framework
Building off a group project from SENG-371, a cloud
compute framework can be further fleshed out. 

## Idea III - Scheduling web-app
Building off a group project from SENG-321, a web-app
for managing shifts at a bakery could be implemented based
off a 130 page spec.

# Development Instructions
Warning: All who pass this point must disuade themselves from
the illusion that we haven't already picked our project.

Please note, these instructions are still a work-in-progress
and as such are very volatile.

## First time setup
Upon cloning the repo, you first need to install the
requirements, and setup pre-commit on your machine.

### Requirements
This project uses npm for package management, and as
such, running 
``` commandline
npm install
```
will automatically install your requirements.

### Precommit tools
A linter has been added to the repository. It will fix any formatting issue in Typescript when a commit is made.

## Building the project
Thanks to the magic of npm, building the project is easy!

In order to build the frontend, simply run
``` commandline
npm run build:frontent
```
and to build the backend, simply run
``` commandline
npm run build:backend
```

## Starting the Server
In order to build the server images run this should only be done if there are changes to the compose file or the Dockerfile
```commandline
docker-compose build
```
In order to start the Server run. The output will be the port the backend is running on.
```commandline
docker-compose up
```


