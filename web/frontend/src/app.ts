// This is the express server for the frontend

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as env from '../env';
import { generate_get_route, user_route } from './constants/routes';

const app = express();
const DEFAULT_PORT = 3001;
const port = (env as any).env.PORT || DEFAULT_PORT;
const backend_location = (env as any).env.BACKEND_LOCATION;

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
                callback(APIResponse);
            });

        }).on('error', (err) => {
            callback(null);
        });
    } catch (e) {
        console.log(e);
    }
}

function is_logged_in(cookies, success_callback, failure_callback) {
    if (!cookies.tourneygen_auth || !cookies.tourneygen_srn || !cookies.tourneygen_user ) {
        failure_callback( { reason: 'No user found in cookies. User has not attemped to login yet.' } );
        return;
    }
    const route = backend_location + generate_get_route(user_route, { displayName: cookies.tourneygen_user });

    api_get_request(route, (user_object) => {
        if (!user_object) {
            failure_callback({ reason: 'User not found.' });
            return;
        }

        const auth_token = generate_auth_token(unescape(user_object._id), unescape(user_object.email), unescape(user_object.displayName), cookies.tourneygen_srn);
        if (auth_token === cookies.tourneygen_auth) {
            success_callback({}); // Success. No need for reason. Still return for clean code.
        } else {
            failure_callback({ reason: 'Generated token did not match stored token.' });
        }
    });
}

function generate_auth_token(id: string, email: string, name: string, random: number) {
    // Theoretically some security could be added here.
    // for now just returning concat of free data.
    // Note, methods using this function *should*
    // use it in a way disallowing reversabililty (ie checking
    // necessary information against this.) That way if real
    // security is implemented here it will be useable.
    return id + email + name + random.toString();
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
    is_logged_in(req.cookies, (success) => {
       res.render('index');
    }, (failure) => {
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        res.redirect('/');
    }, (failure) => {
        res.render('login');
    });
});

app.get('/submit_login', (req, res) => {
    is_logged_in(req.cookies, (success) => {
            res.redirect('/'); // User is already logged-in,
    }, (failure) => {
        const username = req.query.username ? req.query.username : '';
        const route = backend_location + generate_get_route(user_route, { displayName: username });
        console.log('Submitting loging request to route: ' + route);

        api_get_request(route, (user_object) => {

            if (!user_object) {
                // User wasn't valid.
                // When possible, pass that info along.
                res.redirect('/login');
                return;
            }

            const id = user_object ? user_object._id : '';
            const email = user_object ? user_object.email : '';
            const name = user_object ? user_object.displayName : '';
            const random_number = Math.random();

            // Attach a "security random number" (srn)
            // the user's auth token, and their username
            // to the browser.
            create_cookie('tourneygen_srn', random_number, res);
            create_cookie('tourneygen_auth', generate_auth_token(id, email, name, random_number), res);
            create_cookie('tourneygen_user', name , res);

            // Send user to their home page.
            // GH-9 should handle this.
            res.redirect('/');
        });
    });
});

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});
