import React, {Component} from "react";

import './Home.css'
import Navbar from './Navbar'

export default class Home extends Component{
    
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <Navbar /> 
                <main style={{marginTop: '80px'}}>
                    <p>This is the page content!</p>
                </main>
            </div>
        )
    }

   
}