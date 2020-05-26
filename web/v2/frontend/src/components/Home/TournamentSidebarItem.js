import React, {Component} from "react";

import './TournamentBody.css'

export default class TournamentSidebarItem extends Component { 

    render() {
        return (
            <div className={'tournament 1'}>
                <div className={'tournament-info'}>
                    <p className={'tournament-name'}>{this.props.tournamentName}</p>
                    <p className={'tournament-dates'}>{this.props.tournamentDateRange}</p>
                </div>
                <div className={'sidebar-selector'}>
                </div>
            </div>
                       
        )
    }

}