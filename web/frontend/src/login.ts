// import * as express from 'express';
// import {Router} from 'express';
import * as env from '../env.js';
console.log('working');

function get_login() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    console.log(username);
    check_login(username);
}

function check_login(username) {
    console.log(env);
    // const route = env.BACKEND_LOCATION+'/user?displayName=' + username;
    // console.log(route);
}

export default get_login;
