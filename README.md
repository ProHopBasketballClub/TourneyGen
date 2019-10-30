[![Build Status](http://jenkins.theserverproject.com/buildStatus/icon?job=seng350f19-project-team-3-9%2Fmaster)](http://jenkins.theserverproject.com/job/seng350f19-project-team-3-9/job/master/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Code Quality Score](https://www.code-inspector.com/project/658/score/svg)](https://www.code-inspector.com/project/preferences/658)
[![Code Grade](https://www.code-inspector.com/project/658/status/svg)](https://www.code-inspector.com/project/preferences/658)
[![codecov](https://codecov.io/gh/seng350/seng350f19-project-team-3-9/branch/master/graph/badge.svg?token=DoKdk9BFej)](https://codecov.io/gh/seng350/seng350f19-project-team-3-9)
[![BCH compliance](https://bettercodehub.com/edge/badge/seng350/seng350f19-project-team-3-9?branch=master&token=1e91f01971b92e3a8085be6d8f38d504a7294a7a)](https://bettercodehub.com/)



# Team 3-9  -  SENG-350
Hello, we're team 3-9. We're not really sure what the
requirement to include 'you team's name' means, so 
we will from now on be known as 'Panznir',
a portmanteau of Mjolnir and Panzer, the only
ideas we had for a team name.


What is TourneyGen? It is primarily a sports league
management website. What does that mean? Well basically, if you are
in charge of a leage (sports, e-sports, etc), then you can use our
website to effectively manage the teams and tournaments hosted within
your league! Sign up at [TourneyGen's website](http://tourneygen.theserverproject.com/)

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

### Project requirements
In order to even run the project, you must have both docker/docker-compose,
and npm version 6.12.0 installed.

To install docker

on linux:
``` commandline
sudo snap install docker
```

on mac:
``` commandline
brew install docker
brew install docker-compose
```

To install npm

on linux:
``` commandline
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install npm -g
```

on mac:
``` commandline
brew install npm
sudo npm install -g npm@latest
```

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
Thanks to the magic of Docker, building the project manually is no longer
necessary. Docker will do all of the building automagically when you run
``` commandline
sudo-docker-compose build
```

## Starting the Server
In order to build the server images run this should only be done if there are changes to the compose file or the Dockerfile.
If you setup docker differently than is set out in this document, then you may not need to use sudo.

In order to start the Server run. The output will be the port the backend is running on.
```commandline
sudo docker-compose up
```

Alternatively, to both build and start the server in one, run
``` commandline
sudo docker-compose up --build
```

Docker controls both the front and the backend. If you would like to connect directly to the backend
then connect to `localhost:34345`. To connect to the frontend, connect to `localhost:34346`.


