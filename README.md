[![Build Status](http://jenkins.theserverproject.com/buildStatus/icon?job=seng350f19-project-team-3-9%2Fmaster)](http://jenkins.theserverproject.com/job/seng350f19-project-team-3-9/job/master/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# Team 3-9  -  SENG-350
Hello, we're team 3-9. We're not really sure what the
requirement to include 'you team's name' means, so 
we will from now on be known as 'Panznir',
a portmanteau of Mjolnir and Panzer, the only
ideas we had for a team name.

# INSERT-PROJECT-NAME-HERE
We are... not the most creative bunch (could you guess from the team name?)
We're actively searching for a name for our project...

What is INSERT-PROJECT-NAME-HERE? It is primarily a sports leage
management website. What does that mean? Well basically, if you are
in charge of a leage (sports, e-sports, etc), then you can use our
website to effectively manage the teams and tournaments hosted within
your league! Sign up at [INSERT-PROJECT-NAME-HERE's website](http://tourneygen.theserverproject.com/)

# Course info
To avoid disrupting this file as well as seperatinng course 
requirements from actual project, please go to the "milestones" 
folder's base readme file to see course requirements.

# Development Instructions
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
npm run build:frontend
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


