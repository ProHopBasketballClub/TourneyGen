// This is the express server for the frontend

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as env from '../env';
import * as cookieParser from 'cookie-parser'

const app = express();
const DEFAULT_PORT = 3001;
const port = (env as any).env.PORT || DEFAULT_PORT;
const user_route = 'http://' + (env as any).env.BACKEND_LOCATION + '/Api/user?displayName=';

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // NOTE: If security is being implemented, a secret can be passed here.

// Define useful functions.
function api_get_request(route: string, callback) {

    try {
        let data: string = '';
        let APIResponse;

        http.get(route, (resp) => {
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. return the data
            resp.on('end', () => {
                APIResponse = JSON.parse(data);
                console.log("Sending this back to callback: " + Object.keys(data));
                callback(APIResponse);
            });

        }).on('error', (err) => {
            callback('Error: ' + err.message);
        });
    } catch (e) {
        console.log(e);
    }
}

function async_convert(params, async_method, callback) {
    // callback gets 1 parameter. This parameter is called data.

    function runCallback(data) {
        callback(data);
    }

    // Calls the async method with the passed parameters,
    // and a callback. The callback should take one parameter.
    // That callback method will be run synchronously.
    async_method(...params, runCallback);
  
}

// function is_logged_in(cookies): boolean {
//     const route = user_route + cookies.tourneygen_user;
//     const user_object: any = api_get_request(route);
//     //console.log("route: " + route);
//     //console.log("user_object: " + user_object);

//     // Error checking for user_object.

//     const auth_token = generate_auth_token(user_object.id, user_object.email, user_object.name, cookies.tourneygen_srn);

//     return auth_token === cookies.tourneygen_auth;
// }

function generate_auth_token(id: string, email: string, name: string, random: number) {
    // Theoretically some security could be added here.
    // for now just returning id. 
    // Note, methods using this function *should*
    // use it in a way disallowing reversabililty (ie checking
    // necessary information against this.) That way if real
    // security is implemented here it will be useable.
    return id;
}

function create_cookie(cookie_name, cookie_value, res) {
    // Adds a cookie to the browser based on the cookie_obj passed.
    res.cookie(cookie_name, cookie_value, { maxAge: 900000, httpOnly: true });
}

function destory_cookie(cookie_name: string, cookies) {
    // Removed the cookie from the browser with the passed name.

    if (!cookies.cookie_name) {
        return false;
    }

    cookies.set(cookie_name, { expires: Date.now() });
    return true;
}

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/submit_login', (req, res) => {

    // if (is_logged_in(req.cookies)) {
    //     // return some kind of error.
    // }

    const username = req.query.username ? req.query.username : '';
    console.log("Username: " + username);

    const route = user_route + username;

    api_get_request(route, (user_object) => {

        let id = user_object ? user_object._id : '';
        let email = user_object ? user_object.email : '';
        let name = user_object ? user_object.displayName : '';
        let random_number = Math.random();
    
        // Attach a "security random number" (srn)
        // the user's auth token, and their username
        // to the browser.
        create_cookie('tourneygen_srn', random_number, res);
        create_cookie('tourneygen_auth', generate_auth_token(id, email, name, random_number), res);
        create_cookie('tourneygen_user', name , res);
    
        // Send user to their home page.
        // GH-9 should handle this.
        res.redirect('/login');
    });
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});
