import React from "react";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import { Bracket, BracketGame, BracketGenerator} from 'react-tournament-bracket'
import BracketBody from "./BracketBody";


// const gameObject = {
//     id: 1,
//     // the game name
//     name: 'GameName',
//     // optional: the label for the game within the bracket, e.g. Gold Finals, Silver Semi-Finals
//     bracketLabel: 'Gold Finals?',
//     // the unix timestamp of the game-will be transformed to a human-readable time using momentjs
//     scheduled: 10,
//     court: {
//       name: 'ExampleCourt',
//       venue: {
//         name: 'ExampleVenue'
//       }
//     },
//     sides: {
//       'home': {
//         score: {
//             score: 10
//         },
//         // seed?: 
//         team: {
//             id: 5,
//             name: 'TeamName'
//         }
//       },
//       'visitor': {
//           score: {
//               score: 20
//           },
//           team: {
//               id: 10,
//               name: 'OtherTeam'
//           }
//       }

//     }
//   }
  
export default function TournamentBody(props) {
    let { tournamentId } = useParams();
    const currentLength = props.currentTournamentData.length;
    let tournamentData;
    if(tournamentId < currentLength){
        tournamentData = props.currentTournamentData[tournamentId].props.children.props;
    } else {
        tournamentData = props.pastTournamentData[tournamentId - currentLength].props.children.props;
    }
    const linkedBrackets = tournamentData.brackets.map(({bracketId}) => {
        return (
            <NavLink to={`/tournaments/${tournamentId}/${bracketId}`} activeClassName={'active-bracket-selector'} className="bracket-selector-link">
                <p>Bracket {bracketId}</p>
            </NavLink>
        )
    });
    return (
        <div className="tournament-body-block-2">
            <div className="tournament-body-info">
                <p className="tournament-title">{tournamentData.tournamentName}</p>
                <div className="tournament-info-round-time">
                    <p>Round Time:</p>
                    <p className="variable-text">48 hrs</p>
                </div>
                <div className="tournament-info-reset-time">
                    <p>Round Reset Time</p>
                    <p className="variable-text">5:00 pm PST</p>
                </div>
                <p id="tournament-date">May 15th - May 30th, 2020</p>
            </div>
            <div className="tournament-bracket-zone">
                <div className="bracket-block">
                    <div className="bracket-selectors">
                        {linkedBrackets}
                    </div>
                    <div className="bracket-window">
                        <Switch>
                            <Route path={`/tournaments/${tournamentId}/:bracketId`}>
                                <BracketBody/>
                            </Route>
                        </Switch>   
                        {/* <BracketGame game={gameObject} homeOnTop="true"/> */}
                    </div>
                </div>
            </div>
        </div>
    )
}