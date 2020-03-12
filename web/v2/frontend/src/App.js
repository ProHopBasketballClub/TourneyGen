import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";
import Home from "./components/Home/Home"

function App() {
  return (<BrowserRouter>
        <div style={{backgroundColor: '#282c34'}}>
          <div className={'auth-wrapper'}>
            <div className={'auth-inner'}>
              <Switch>
                <Route exact path={'/'} component={Home} />
                <Route path={'/sign-in'} component={Login}/>
                <Route path={'/sign-up'} component={SignUp} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
  );
}

export default App;
