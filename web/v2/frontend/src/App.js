import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route, Link, Redirect} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from "./components/Login/Login";
import SignUp from "./components/Login/SignUp";
import Profile from "./components/Home/Profile"
import Tournament from './components/Home/Tournament';

function App() {
  return (<BrowserRouter>
        <div style={{backgroundColor: '#282c34'}}>
          <div className={'auth-wrapper'}>
            <div className={'auth-inner'}>
              <Switch>
                {/* <Route exact path={'/'} render={ props =>  <Login />} /> */}
                <Route exact path={'/'}>
                  {/* Check if logged in, if no, redirect to login page, if yes, redirect to tournaments */}
                  <Redirect to={{pathname: '/sign-in'}}/>
                </Route>
                <Route path={'/tournaments'} component={Tournament}/>
                <Route path={'/profile'} component={Profile}/>
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


/*
Want / -> sign-in OR (long term) check for cookies and then go to /tournaments



*/