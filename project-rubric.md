# Milestone 2   16 / 20

## Marking Guide

- technical writing is clear and concise (key decisions are documented; organization is easy to follow; basic English spelling and writing conventions adhered to)
- design follows basic principles like cohesion/coupling, single responsibility, open/closed
- design addresses QAR from M1
- design provides path for implementing user stories in M1
- design models follow conventions for class and sequence diagrams
- design justifies technology choices
- ADRs (3+) explain why decision was taken, what the context is, and what alternatives were rejected
- ADRs don't capture trivial design decisions

## Notes M2

(explaining why marks were deducted)
-----

- Not the best writing. The Sequence diagram is not found by clicking on the link on section 2.1 Backend Architecture. There is a broken link on section 3.1.2.3 Frontend consistency (-1)
- The Sequence diagram only outlines backend but does not outline the individual responsibilities of the backend. Could have broken them down into modules and outline responsibilities for every modules. (-1)
- ADRs are not explained in terms of what choices were there on hand (-1)
- There are no explanations of why a particular choice was made (-1)

# Milestone 3   20 / 20

## Marking Guide

- code compiles
- code conventions/CI from above (commented, code style, design principles)
- working demo
- clear explanation of what user stories were satisfied in this iteration
- design as implemented follows design doc, or change rationale is present in README
- async is async when necessary
- TSLint does not complain
- test suite present/part of CI
- test coverage reasonable and meaningful

Marks deducted:


## Notes M3

(explaining why marks were deducted)
-----
# Milestone 4 24 / 30

## Marking Guide

- code compiles
- code conventions/CI from above (commented, code style, design principles)
- working demo
- clear explanation of what user stories were satisfied in this iteration
- design as implemented follows design doc, or change rationale is present in README
- async is async when necessary
- TSLint does not complain
- test suite present/part of CI
- test coverage reasonable and meaningful
- explanation of how you are automating testing 3 QAS from your list in M1
- explanation of integration testing and CI pipeline


Marks deducted:

- Not enough code comment. (-2)
- Test coverage could be a little higher. (-2)
- QASs implementation report. (-2)


## Notes M4

(explaining why marks were deducted)
-----

 - All the controllers are not commented. Services are not commented at all. This reduces one of the QASs called **Learnability/Readability**
 - Controllers and models could be covered more in terms of test code.
 - Could not see the implementation report of 3 QASs in the M4 report.
