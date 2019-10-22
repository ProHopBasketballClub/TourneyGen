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
                data += chunk;
            });

            // The whole response has been received. return the data
            resp.on('end', () => {
                APIResponse = JSON.parse(data);
                resolve(APIResponse);
            });

        }).on('error', (err) => {
            reject('Error: ' + err.message);
        });
    });

    return await APIResponse;
}

// async function api_post_request(route: string, path: string,  body: object) {
//     const data = JSON.stringify(body);
//     let response = '';
//     const options = {
//         hostname: route,
//         port: 80,
//         path,
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(data),
//         },
//     };
//     let APIResponse = new Promise((resolve, reject) => {
//         const req = http.request(options, (resp) => {
//             // A chunk of data has been recieved.
//             resp.on('data', (chunk) => {
//                 response += chunk;
//                 console.log(chunk);
//             });

//             // The whole response has been received. return the data
//             resp.on('end', () => {
//                 APIResponse = JSON.parse(data);
//                 resolve(APIResponse);
//             });

//         }).on('error', (err) => {
//             reject('Error: ' + err.message);
//         });

//         req.write(data);
//         console.log(response);
//         console.log();
//         req.end;
//     });

//     return await APIResponse;
// }

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/submit_login', async (req, res) => {
    const username = req.query.username ? req.query.username : '';
    const route = 'http://' + (env as any).env.BACKEND_LOCATION + '/Api/user?displayName=' + username;

    const user_object: any = await api_get_request(route);
    let id = '';
    let email = '';
    let name = '';

    if (user_object) {
        name = user_object.displayName;
        id = user_object._id;
        email = user_object.email;
    }

    // Attach some sutff to browser....

    // Send user to their home page.
    // GH-9 should handle this.
    res.redirect('/login');
});

// app.get('/signup', (req, res) => {
//     res.render('signup');
// });

// app.post('/signup', async (req, res) => {

//     const username = req.body.username ? req.body.username : '';
//     const email = req.body.email ? req.body.email : '';
//     const route = 'http://' + (env as any).env.BACKEND_LOCATION;
//     const path = '/Api/user';
//     const body = {
//         displayName : username,
//         email,
//     };
//     console.log(body);
//     const user_object: any = await api_post_request(route, path, body);
//     const id = '';
//     const name = '';

//     res.redirect('/signup');
})

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});
