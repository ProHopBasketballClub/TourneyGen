// This is the express server for the frontend

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as env from '../env';

const app = express();
const DEFAULT_PORT = 3001;
const port = (env as any).env.PORT || DEFAULT_PORT;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define useful functions.
async function api_get_request(route: string) {
    // Make a get request to the server at route.

    let data: string = '';
    let status_code;
    let APIResponse = new Promise((resolve, reject) => {
        http.get(route, (resp) => {
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. return the data
            resp.on('end', () => {
                APIResponse = JSON.parse(data);
                status_code = resp.statusCode;
                console.log(status_code);
                resolve(APIResponse);
            });

        }).on('error', (err) => {
            reject('Error: ' + err.message);
        });
    });
    console.log(status_code);
    return await [APIResponse, status_code];
}

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const username = req.body.username ? req.body.username : '';
    const route = 'http://' + (env as any).env.BACKEND_LOCATION + '/Api/user?displayName=' + username;

    const api_response = await api_get_request(route);
    const user_object: any = api_response[0];
    const status_code = api_response[1];

    let id = '';
    let email = '';
    let name = '';

    if (user_object) {
        name = user_object.displayName;
        id = user_object._id;
        email = user_object.email;
    }
    console.log(status_code);
    // Attach some sutff to browser....

    // Send user to their home page.
    // GH-9 should handle this.
    res.redirect('/login');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});
