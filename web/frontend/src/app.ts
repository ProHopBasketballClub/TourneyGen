import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import * as path from 'path';
import * as env from '../env';
import { league_get_all_route, user_route } from './constants/routes';

import { api_get_request, api_post_request, create_cookie, generate_auth_token, generate_get_route, is_logged_in } from './helpers/routing';

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

app.get('/', (req, res) => {
    is_logged_in(req.cookies, (user_object) => {

        api_get_request(backend_location + league_get_all_route, (all_leagues) => {
            const leagues = [];
            all_leagues.forEach((league) => {
                if (league.Owner === user_object._id) {
                    leagues.push({ name: league, id: league.Owner });
                }
            });

            res.render('home', {
                leagues,
            });
        });
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

app.post('/login', (req, res) => {
    is_logged_in(req.cookies, (success) => {
            res.redirect('/'); // User is already logged-in,
    }, (failure) => {
        const username = req.body.username ? req.body.username : '';
        const route = backend_location + generate_get_route(user_route, { displayName: username });
        console.log('Submitting login request to route: ' + route);

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

app.get('/signup', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        res.redirect('/');
    }, (failure) => {
        res.render('signup');
    });
});

app.post('/signup', async (req, res) => {

    const username = req.body.username ? req.body.username : '';
    const email = req.body.email ? req.body.email : '';
    const route =  (env as any).env.BACKEND_LOCATION;
    const url_path = '/Api/user';
    const body = {
        displayName : username,
        email,
    };

    api_post_request(route, url_path, body, (user_object) => {
        if (user_object) {
            if (user_object.status_code === HttpStatus.OK) {
                // Hit the login route to auto login
                const login_body = {
                    username,
                };
                res.redirect('/login');
            }
        }
    });

});
app.get('/leagues/:league_name/:id', (req,res) => {

    is_logged_in(req.cookies, (success) => {
        // this value ensures the HTML page is rendered before variables are used
        const page_rendered=true;
        const league = {
            logo:null,
            name: req.params.league_name,
        };
        const tournaments = [
            { name: 'tournament1' },
            { name: 'tournament2' },
            { name: 'tournament3' },
        ];
        res.render('leagues', {
            league,
            page_rendered,
            tournaments,
        });
    }, (failure) => {
        res.redirect('/login');
    });
});

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});
