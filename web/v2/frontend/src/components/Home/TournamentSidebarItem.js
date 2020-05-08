import React, {Component} from "react";

import './TournamentBody.css'

export default class TournamentSidebarItem extends Component { 

    render() {
        return (
            <div className={'tournament 1'}>
                <div className={'tournament-info'}>
                    <p className={'tournament-name'}>Steve Nash Cup</p>
                    <p className={'tournament-dates'}>May 15th - May 30th</p>
                </div>
                <div className={'sidebar-selector'}>
                </div>
            </div>
                       
        )
    }

}