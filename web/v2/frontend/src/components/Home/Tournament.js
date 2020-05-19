import React, { Component } from "react";

import './Tournament.css'
import Navbar from './Navbar'
import TournamentBody from "./TournamentBody";
import TournamentSidebar from "./TournamentSidebar";
import TournamentSidebarItem from "./TournamentSidebarItem"
import { Switch, Route, NavLink, useParams } from "react-router-dom";


const players = [ //0-17
    'Michael Jordan',
    'Lebron James',
    'Scottie Pippen',
    'Steve Nash',
    'Kobe Bryant',
    'Neil Farber',
    'Keaton Allan',
    'Zion Williamson',
    'Kevin Durant',
    'Giannis Antetokounmpo',
    'Anthony Davis',
    'Stephen Curry',
    'Klay Thompson',
    'Kareem Abdul-Jabbar',
    'Larry Bird',
    'Magic Johnson',
    'Bill Russell',
    'Shaquille O\'Neal',
]

const tournaments = [ // 0 - 13
    'Tourney',
    'Event',
    'Brawl',
    'League',
    'Classic',
    'Cup',
    'Invitiational',
    'Duel',
    'Battle',
    'Clash',
    'Championship',
    'Series',
    'Meet',
    'Nationals',
]

let globalTournamentIndex = 0;

//val is # of items to create
function createData(val) {
    let accum = []
    for (let i = 0; i < val; i++) {
        accum.push({
            tournamentId: `${globalTournamentIndex}`,
            tournamentName: `${players[getRandomInt(0, 17)]} ${tournaments[getRandomInt(0, 13)]}`,
            tournamentDateRange: 'May 15th - 30th' //yeah yeah it's boring, whatever
        });
        globalTournamentIndex++;
    }
    return accum;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


const currentTournamentData = []
const pastTournamentData = []

const rawCurrentTournamentData = createData(getRandomInt(3, 15));

const rawPastTournamentData = createData(getRandomInt(5, 10));

rawCurrentTournamentData.map(({ tournamentId, tournamentName, tournamentDateRange }) => {
    currentTournamentData.push(
        <NavLink to={`/tournaments/${tournamentId}`} activeClassName="active-tournament-selector">
            <TournamentSidebarItem tournamentId={tournamentId} tournamentName={tournamentName} tournamentDateRange={tournamentDateRange} />
        </NavLink>
    )
})

rawPastTournamentData.map(({ tournamentId, tournamentName, tournamentDateRange }) => {
    pastTournamentData.push(
        <NavLink to={`/tournaments/${tournamentId}`} activeClassName="active-tournament-selector">
            <TournamentSidebarItem tournamentId={tournamentId} tournamentName={tournamentName} tournamentDateRange={tournamentDateRange} />
        </NavLink>
    )
})


export default class Tournament extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    //probably need some logic for the params we want being passed into TournamentBody component...
    //at the same time, might just make sense to call api b/c it'll need to get brackets anyways
    render() {
        return (
            <div style={{height: '100%'}}>
                <Navbar />
                <div className="page-body">
                    <div className="tournament-sidebar-block">
                        <TournamentSidebar currentTournamentData={currentTournamentData} pastTournamentData={pastTournamentData} />
                    </div>
                    <div className="tournament-body-block">
                        <Switch>
                            <Route path="/tournaments/:tournamentId">
                                <TournamentBody currentTournamentData={currentTournamentData} pastTournamentData={pastTournamentData}/>
                            </Route>
                        </Switch>    
                    </div>
                </div>
            </div>
        )
    }


}
