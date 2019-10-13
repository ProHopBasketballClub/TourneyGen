# Milestone 2: Detailed Design Document
## Team 3-9: TourneyGen

<h4>
Jordan Sandberg V00871232 <br/>
Landon Marshall V00843849 <br/>
Ross Alexandra V00867152 <br/>
Ethan Kwan V00

# 1 Introduction
This section will provide a problem statement, give an overview of the functionality of the application, and specify any constraints.

## 1.1 Problem
Currently, there lacks an intuitive method for competitive leagues to organize themselves into groups and keep track of skill level while playing against each other in tournaments. Although there are existing products which allow you to create brackets for single tournaments (ex. [Tournament Bracket Generator](https://challonge.com/tournament/bracket_generator)), there is currently no software which organizes entire leagues.

## 1.2 Overview
The goal of TourneyGen is to allow leagues to organize and manage themselves. TourneyGen will provide an overarching structure to leagues, allowing them to keep track of multiple competitive tournaments and matches within that league. The application will have four main components for users to interact with: leagues, teams, matches and tournaments.The app is laid out in a hierarchical structure with a league being at the top of the hierarchy and teams residing underneath a league. Once a league contains multiple teams, tournaments and matches can be held within that given league. The additional functionality of ranking is provided in the form of “Elo”. The Elo ranking system helps to rank teams appropriately. Every team in each league starts with the same amount of Elo, and Elo is adjusted based on the result of each match. If two teams with the same Elo play a game, the Elo gain/loss will be moderate. If two teams with a large difference in Elo play (which implies one team is better than the other), then if the team that has the higher Elo wins, the Elo gain/loss will be very small. However, if the lower Elo team wins, the Elo gain/loss will be significantly larger [3].

# 2 Design Decisions
This section will explain how the architectural design decisions will solve the problem TourneyGen is attempting to solve. 



# 3 Architecture Design
The following section will outline the CI architecture.
## 3.1 Continuous Integration (CI)
This section will explain the technologies being used for continuous integration (CI

### 3.1.1 Technologies Being Used
Jenkins is a customizable open source automation tool. Jenkins can be used/customized to detect changes and automatically build and test the new version of the project. Jenkins is a free tool, and we are using it because it promotes collaboration within a team of developers. Using Jenkins allows all of us to work on the project at the same time, and if there are any conflicts in our changes, Jenkins should be able to catch it and notify us.

### 3.1.2 Consequences and Constraints
The consequences of using Jenkins are relatively minimal, as it is all open source, and it runs on plugins so for most cases it will be able to do what you need it to do. In the event that it can’t one can always write their own plugin. Another consequence of Jenkins is that since it is so configurable, it is up to the developers to set it up properly. 

## 3.2 Testing
The following section will outline the testing frameworks being used and how these frameworks will interact with the CI tools in place. 

### 3.2.1 Technologies Being Used
The application will use Mocha.js and Chai.js. Mocha.js is a testing framework which provides a simple interface for creating testing suites [1]. Ran alongside Mocha.js is Chai.js, which is an assertion library for Node.js applications. This library adds the ability to create assertions in the Mocha.js testing suites [2]. Used in conjunction, these libraries will have the full capability of testing both the front and back-end of the application. 

### 3.2.2 Consequences and Constraints
The consequences of using Mocha.js and Chai.js are that the application must be written in JavaScript and the runtime environment must be Node.js. Mocha.js and Chai.js will only work for 

# Resources 

1. “the fun, simple, flexible JavaScript test framework,” Mocha. [Online]. Available: 
https://mochajs.org/. [Accessed: 10-Oct-2019].

2. “Chai Assertion Library,” Chai.js Documentation. [Online]. Available: 
https://www.chaijs.com/. [Accessed: 10-Oct-2019].

3. “Elo rating system,” Wikipedia, 04-Oct-2019. [Online]. Available: 
https://en.wikipedia.org/wiki/Elo_rating_system. [Accessed: 10-Oct-2019].

4. “What is Jenkins? | Jenkins For Continuous Integration | Edureka.” [Online]. Available: https://www.edureka.co/blog/what-is-jenkins/ . [Accessed: 13-Oct-2019].
