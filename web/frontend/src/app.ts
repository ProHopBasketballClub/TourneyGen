import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';
import * as env from '../env';
import { user_route } from './constants/routes';
import { api_get_request, create_cookie, generate_auth_token, generate_get_route, is_logged_in } from './helpers/routing';

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
    is_logged_in(req.cookies, (success) => {
       res.render('home');
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
