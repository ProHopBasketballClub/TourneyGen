import React, {Component} from "react";

import './TournamentBody.css'
import TournamentSidebar from "./TournamentSidebar";

export default class TournamentBody extends Component { 

    render() {
        return (
            <body>
                <TournamentSidebar/>
                <div className={'main-content'}>
                    {/* <h3>Body</h3> */}
                </div>
            </body>
        )
    }

}