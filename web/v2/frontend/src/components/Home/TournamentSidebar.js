import React, {Component} from "react";

import './TournamentBody.css'
import { Switch, NavLink, useRouteMatch } from "react-router-dom";


export default class TournamentSidebar extends Component { 

    render() {
        return (
                <div className={'sidebar'}>
                        <div className={'current-tours'}>
                            <h5 className={'section current'}>Current</h5>
                            {this.props.currentTournamentData}
                        </div>
                        <div className={'past-tours'}>
                            <h5 className={'section completed'}>Completed</h5>
                            {this.props.pastTournamentData}
                        </div>
                </div>
        )
    }

}