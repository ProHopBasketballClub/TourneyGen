import React, {Component} from "react";

import './TournamentBody.css'
import TournamentSidebarItem from "./TournamentSidebarItem";

export default class TournamentSidebar extends Component { 

    render() {
        return (
                <div className={'sidebar'}>
                    <div className={'current-tours'}>
                        <h5 className={'section current'}>Current</h5>
                        <TournamentSidebarItem/>
                        <TournamentSidebarItem/>
                    </div>
                    <div className={'past-tours'}>
                        <h5 className={'section completed'}>Completed</h5>
                        <TournamentSidebarItem/>
                    </div>
                </div>
        )
    }

}