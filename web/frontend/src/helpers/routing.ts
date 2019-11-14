import * as http from 'http';
import * as HttpStatus from 'http-status-codes';
import * as request from 'request';
import * as env from '../../env';
import { default_cookie_max_age } from '../constants/cookie';
import { user_route } from '../constants/routes';
const backend_location = (env as any).env.BACKEND_LOCATION;

export function api_get_request(route: string, callback) {
    /* Sends an HTTP GET request to the passed route, calling
        the callback method with whatever response the backend
        gives.
    */
    let data: string = '';
    let APIResponse;
    console.log('Submitting GET request to: ' + route);

    // TODO: this should be updated to use request rather than
    // http.get
    http.get(route, (resp) => {

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. return the data
        resp.on('end', () => {
            try {
                APIResponse = JSON.parse(data);
                APIResponse.status_code = resp.statusCode;
            } catch (e) {
                callback(null);
                return;
            }
            callback(APIResponse);
        });
    }).on('error', (err) => {
        callback(null);
    });
}

// This function can be used to make multiple get requests with one callback function.
export function api_get_multiple_requests(routes: string[], callback) {
    console.log('Submitting multiple GET requests');
    const result: object[] = [];
    routes.forEach(function(route) {
        api_get_request(route, (multi_response) => {
            result.push(multi_response);
            // Only if this is the last get request, do we want to return
            if (result.length === routes.length) {
                callback(result);
            }
        });
    });

}

// TODO: Refactor: this should aleady have the thing combined. Also update the docstring.
export function api_post_request(route: string, path: string, body: object, callback) {
    /* Sends an HTTP GET request to the passed route, calling
        the callback method with whatever response the backend
        gives.
    route: localhost:3001 --- backend_loaction
    path: /signup --- route
    */

    let APIResponse;
    const url: string = route + path;
    console.log('Submitting POST request to: ' + url);

    request({
        body,
        json: true,
        method: 'POST',
        url,
    }, (error, post_response, post_body) => {
        if (error) {
            console.log(error);
            callback(null);
            return;
        }
        try {
            if (post_response.statusCode === HttpStatus.OK) {
                APIResponse = post_body;
                APIResponse.status_code = post_response.statusCode;
                callback(APIResponse);
                return;
            } else if (post_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                console.log('302 response: ', post_response);
                APIResponse = post_response;
                callback(APIResponse);
                return;
            } else {
                console.log(post_response.statusCode);
                callback(null);
                return;
            }
        } catch (e) {
            console.log(e);
            callback(null);
            return;
        }
    });
}

export function api_delete_request(route: string, callback) {
    /* Sends an HTTP DELETE request to the passed route, calling
        the callback method with whatever response the backend
        gives.
    */
    // let data: string = '';
    let APIResponse;
    const url = route;
    request({
        json: true,
        method: 'DELETE',
        url,
    }, (error, delete_response, post_body) => {
        if (error) {
            console.log(error);
            callback(null);
            return;
        }
        try {
            if (delete_response.statusCode === HttpStatus.OK) {
                APIResponse = post_body;
                APIResponse.status_code = delete_response.statusCode;
                callback(APIResponse);
                return;
            } else if (delete_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                console.log('302 response: ', delete_response);
                APIResponse = delete_response;
                callback(APIResponse);
                return;
            } else {
                console.log(delete_response.statusCode);
                callback(null);
                return;
            }
        } catch (e) {
            console.log(e);
            callback(null);
            return;
        }
    });
}

export function api_put_request(route: string, body: object, callback) {
    let APIResponse;
    console.log('submitting PUT request to: ' + route);
    console.log('with the body: ' + JSON.stringify(body));

    request({
        body,
        json: true,
        method: 'PUT',
        url: route,
    }, (error, put_response, put_body) => {

        if (error) {
            console.log(error);
            callback(null);
            return;
        }
        try {
            if (put_response.statusCode === HttpStatus.OK) {
                APIResponse = put_body;
                APIResponse.status_code = put_response.statusCode;
                callback(APIResponse);
                return;
            } else if (put_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                console.log('302 response: ', put_response);
                APIResponse = put_response;
                callback(APIResponse);
                return;
            } else {
                console.log(put_response.statusCode);
                callback(null);
                return;
            }
        } catch (e) {
            console.log(e);
            callback(null);
            return;
        }
    });
}

export function create_cookie(cookie_name, cookie_value, res, cookie_params: object = { maxAge: default_cookie_max_age, httpOnly: true }) {
    // Adds a cookie to the browser with the name and value passed.
    res.cookie(cookie_name, cookie_value, cookie_params);
}

export function destroy_cookie(cookie_name: string, cookies) {
    // Removed the cookie from the browser with the passed name.

    if (!cookies[cookie_name]) {
        return false;
    }

    cookies.set(cookie_name, { expires: Date.now(), maxAge: 0 });
    return true;
}

export function generate_auth_token(id: string, email: string, name: string, random: number) {
    /* Theoretically some security could be added here.
        for now just returning concat of free data.
        Note, methods using this function *should*
        use it in a way disallowing reversabililty (ie checking
        necessary information against this.) That way if real
        security is implemented here it will be useable.
    */
    return id + email + name + random.toString();
}

export function generate_get_route(route, args) {
    let get_route = route + '?';
    for (const [key, value] of Object.entries(args)) {
        get_route += key.toString() + '=' + value.toString() + '&';
    }

    // Don't return the last &.
    return get_route.slice(0, -1);
}

export function is_logged_in(cookies, success_callback, failure_callback) {
    /* Checks whether the user is logged in or not. This is done by verifying that
        the auth token attached to the browser is identical to the auth token
        generated by the user's object.

        If the user is logged in, then the success_callback function will
        be called with their object from the database.

        If the user is not logged in, then the failure_callback function will
        be called with an object specifying the `reason` that the authentication
        failed.
    */
    if (!cookies.tourneygen_auth || !cookies.tourneygen_srn || !cookies.tourneygen_user ) {
        failure_callback( { reason: 'Missing cookies have rendered authentication impossible.' } );
        return;
    }
    const tourneygen_auth = unescape(cookies.tourneygen_auth);
    const tourneygen_srn = cookies.tourneygen_srn; // No need to unescape as this is a number.
    const tourneygen_user = unescape(cookies.tourneygen_user);

    const route = backend_location + generate_get_route(user_route, { displayName: tourneygen_user });

    api_get_request(route, (user_object) => {
        if (!user_object || user_object.status_code === HttpStatus.NOT_FOUND) {
            failure_callback({ reason: 'User not found.' });
            return;
        }

        // Generate and check the auth token with the one stored in browser.
        const auth_token = generate_auth_token(user_object._id, user_object.email, user_object.displayName, tourneygen_srn);
        if (auth_token === tourneygen_auth) {
            success_callback(user_object); // On success, return the logged-in user's object.
        } else {
            failure_callback({ reason: 'Generated token did not match stored token.' });
        }
    });
}
