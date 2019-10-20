import { config } from 'dotenv';
import * as express from 'express';
import {Router} from 'express';
config();

function get_login() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    console.log(username);
    check_login(username);
}

function check_login(username) {
    const route = process.env.BACKEND_LOCATION+'/user?displayName=' + username;
    console.log(route);
}

export default get_login;
