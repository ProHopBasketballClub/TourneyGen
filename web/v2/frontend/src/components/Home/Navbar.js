import React, {Component} from "react";

import './Navbar.css'
import {BsPersonFill} from "react-icons/bs"
import {FaTrophy} from "react-icons/fa"
import { IconContext } from "react-icons"
import ProHopLogo from "../../ProHop-ai.png"
import { NavLink } from "react-router-dom"

export default class Navbar extends Component { 

    render() {
        return (
            <header className="navbar">

                <nav className="navbar-navigation">

                    <div className="org-section">
                        <div className="org-section-titles">
                            <p id="company-name">TeamGen</p>
                            <p id="organization-name">ProHop</p>
                        </div>
                        <img src={ProHopLogo} alt="Logo" className="navbar-organization-logo"/>
                    </div>

                    <div className="navbar-navigation-items">
                        <NavLink to="/tournaments" activeClassName="tournament-active">
                            <div className="tournaments-selector">
                                <div className="label-and-logo">
                                    <IconContext.Provider value={{ className: 'navbar-tournament-icon'}}><FaTrophy /></IconContext.Provider>      
                                    Tournaments
                                </div>
                                <div className="navbar-active-selector-tournaments"></div>
                            </div>
                        </NavLink>
                    </div>

                    <div className="spacer"></div>
                    <NavLink to="/profile" activeClassName="profile-active">
                        <div className="navbar-profile-selector">
                            <IconContext.Provider value={{ className: 'navbar-profile-icon'}}><BsPersonFill /></IconContext.Provider>
                            <div className="navbar-active-selector-profile"></div>
                        </div>
                    </NavLink>
                </nav>
            </header>
        )
    }

}