import React, {Component} from "react";
import { useParams } from "react-router-dom";
import { model, Bracket, BracketGame, BracketGenerator } from 'react-tournament-bracket'

export default function BracketBody(props) {
    /*
    So... we're going to try and build up a bracket of sorts here... let's see what we can do. We want just the bare minimum first and we expand later

    




*/

    const Teams = [
        {
            id: 101,
            name: 'Team 1'
        },
        {
            id: 102,
            name: 'Team 2'
        },
        {
            id: 103,
            name: 'Team 3'
        },
        {
            id: 104,
            name: 'Team 4'
        },
        {
            id: 105,
            name: 'Team 5'
        },
        {
            id: 106,
            name: 'Team 6'
        },
        {
            id: 107,
            name: 'Team 7'
        },
        {
            id: 108,
            name: 'Team 8'
        }
    ]



    let d = new Date()


    const qurarterFinals = [
        {
            id: 3,
            name: 'Quarter Final 1',
            scheduled: (d.getTime() - 4000000000),
            sides: {
                'home': {
                    team: Teams[0],
                    score: { score: 75 },
                },
                'visitor': {
                    team: Teams[1],
                    score: { score: 72 },
                }
            }
        },
        {
            id: 4,
            name: 'Quarter Final 2',
            scheduled: (d.getTime() - 4000000000),
            sides: {
                'home': {
                    team: Teams[2],
                    score: { score: 56 },
                },
                'visitor': {
                    team: Teams[3],
                    score: { score: 66 },
                }
            }
        },
        {
            id: 5,
            name: 'Quarter Final 3',
            scheduled: (d.getTime() - 4000000000),
            sides: {
                'home': {
                    team: Teams[4],
                    score: { score: 87 },
                },
                'visitor': {
                    team: Teams[5],
                    score: { score: 88 },
                }
            }
        },
        {
            id: 6,
            name: 'Quarter Final 4',
            scheduled: (d.getTime() - 4000000000),
            sides: {
                'home': {
                    team: Teams[6],
                    score: { score: 45 },
                },
                'visitor': {
                    team: Teams[7],
                    score: { score: 80 },
                }
            }
        },
    ]









    

    const semiFinal1 = {
        id: 1,
        name: 'Semi Final 1',
        scheduled: (d.getTime() - 1000000000),
        sides: {
            'home': {
                seed:{
                    rank: 1,
                    sourceGame: qurarterFinals[0],
                },
                team: Teams[0],
                score: { score: 48 }
                    //so our mvp version of this will just reference teams and it won't connect on the bracket (in terms of styling) thats fine
                    //there will be some logic that goes "what team won the previous game" and it'll update the json with a link of whichever team had the higher score
            },
            'visitor': {
                seed:{
                    rank: 1,
                    sourceGame: qurarterFinals[1],
                },
                team: Teams[3],
                score: { score: 56 }
            }
        }
    }

    const semiFinal2 = {
        id: 2,
        name: 'Semi Final 2',
        scheduled: (d.getTime() - 100000000),
        sides: {
            'home': {
                seed:{
                    rank: 1,
                    sourceGame: qurarterFinals[2],
                },
                team: Teams[5],
                score: { score: 63 }
            },
            'visitor': {
                seed:{
                    rank: 1,
                    sourceGame: qurarterFinals[3],
                },
                team: Teams[7],
                score: { score: 65 }
            }
        }
    }

    const testGame = {
        id: 0,
        name: 'Championship',
        scheduled: d.getTime(),
        //court is all optional
        //bracket label is optional
        sides: {
            'home': {
                //So this is champion of one side of bracket. Within here needs to be another game
                seed: {
                    //So this object is optional but it seems to be how the bracket links to previous games. Potentially it makes sense to have our
                    //data structure be an array instead of a huge nested tree? If it's just a reference to a certain game in here
                    //then I don't see why that wouldn't work. Would be easier to build + manage.
                    // displayName: 'Champion of A',
                    sourceGame: semiFinal1,
                    // sourcePool: 2,
                    rank: 1,
                },
                score: {score: 105},
                team: Teams[3],
                
                //Once this object exists, it seems it will overrule whatever is in seed.
                // team: {
                //     id: 10,
                //     name: 'Champs'
                // }
            },
            'visitor': {
                //So this is champion of one side of bracket. Within here needs to be another game
                seed: {
                    // displayName: 'Champion of B',
                    rank: 1,
                    sourceGame: semiFinal2,
                    // sourcePool: 2,
                    
                },
                score: {score: 95},
                team: Teams[7],
            }
        }
    }


    let { tournamentId, bracketId } = useParams()
    return (
        <div>
            <p>Bracket id is {bracketId}</p>
            {/* <BracketGame game={testGame}/> */}
            <Bracket game={testGame}/>
            {/* <Bracket game={someGame}/> */}
        </div>
    )
}
