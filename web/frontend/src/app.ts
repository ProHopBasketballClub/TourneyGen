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
    let APIResponse = new Promise((resolve, reject) => {
        http.get(route, (resp) => {
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                console.log('Data chunk is: ' + chunk);
                data += chunk;
            });

            // The whole response has been received. return the data
            resp.on('end', () => {
                console.log('The data is: ' + data);
                APIResponse = JSON.parse(data);
                console.log('Parsing the data.');
                console.log('The API response is: ' + APIResponse);
                resolve(APIResponse);
            });

        }).on('error', (err) => {
            console.log('Error: ' + err.message);
            reject('Error: ' + err.message);
        });
    });

    return await APIResponse;
}

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/submit_login', (req, res) => {
    const username = req.query.username ? req.query.username : '';
    const route = 'http://' + (env as any).env.BACKEND_LOCATION + '/Api/user?displayName=' + username;
    console.log('Using route: ' + route);

    const user_object: any = api_get_request(route);
    console.log('userobj: ' + user_object);
    let id = 0;
    let email = '';
    let name = '';

    if (user_object) {
        name = user_object.displayName;
        id = user_object._id;
        email = user_object.email;
    }
    console.log(name, id, email);

    // Attach some sutff to browser....

    // Send user to their home page.
    // GH-9 should handle this.
    res.redirect('/login');
});

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});
