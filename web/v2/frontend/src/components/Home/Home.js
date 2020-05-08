import React, {Component} from "react";

import './Home.css'
import Navbar from './Navbar'
import TournamentBody from "./TournamentBody";

export default class Home extends Component{
    
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <Navbar /> 
                <TournamentBody />
            </div>
        )
    }

   
}