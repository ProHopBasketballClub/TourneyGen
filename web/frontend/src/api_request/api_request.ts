import * as HttpStatus from 'http-status-codes';
import * as request from 'request';

export default class ApiRequest {
    /*
        An object used to generate requests.

        Params:
            type: A string of the request type.
            destination: The request destination (this does NOT include request parameters)
            request_params: The data for the request which should be included in the URL
            request_body: The data for the request which should be included in the request body.
            response_filter: A filter used when chaining requests. This filter should take in a response
                             object expected from the previous request. It will return an array of objects.
                             The first object will be the params used by the next call, the second object will be
                             the body used by the next call. The third object will be data that should be persisted
                             to the original caller.
    */
    public static FILTER_PARAM_IND = 0;
    public static FILTER_BODY_IND = 1;
    public static FILTER_RETURN_DATA_IND = 2;

    public type: string;
    public destination: string;
    public request_params: object;
    public request_body: object;
    public response_filter: (response_data: object) => object[];

    constructor(type: string, destination: string, request_data: {params: object, body: object}, response_filter: (response_data: object) => object[] = null) {
        this.type = type;
        this.destination = destination;
        this.request_params = request_data.params;
        this.request_body = request_data.body;

        if (!response_filter) {
            this.response_filter = (data) => {
                return [{}, {}, data];
            };
        } else {
            this.response_filter = response_filter;
        }
    }

    public send_request(callback) {
        const route = this.generate_get_route(this.destination, this.request_params);
        const payload = this.request_body;

        if (this.type === 'GET') {
            return this.api_get_request(route, callback);

        } else if (this.type === 'POST') {
            return this.api_post_request(route, payload, callback);

        } else if (this.type === 'PUT') {
            return this.api_put_request(route, payload, callback);

        } else if (this.type === 'DELETE') {
            return this.api_delete_request(route, callback);
        }

        console.error('Unable to submit a request of the type: "' + this.type + '".');
        return callback({ error: 'Unable to process HTTP Request of type ' + this.type + '.'});
    }

    private api_get_request(route: string, callback) {
        /* Sends an HTTP GET request to the passed route, calling
            the callback method with whatever response the backend
            gives.
        */
        let APIResponse;
        console.log('Submitting GET request to: ' + route);

        request({
            json: true,
            method: 'GET',
            url: route,
        }, (error, get_response, get_body) => {

            if (error) {
                console.log(error);
                APIResponse = { error };
                return callback(APIResponse);
            }

            try {
                if (get_response.statusCode === HttpStatus.OK) {
                    APIResponse = get_body;
                    try {
                        APIResponse.status_code = get_response.statusCode;
                    } catch (object_error) {
                        console.log('Received GET response body not of type json.');
                        return callback({ error: 'Received GET response body not of type json.' });
                    }

                    return callback(APIResponse);
                } else if (get_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                    console.log('302 response: ', get_response);
                    APIResponse = get_response;

                    return callback(APIResponse);
                } else {
                    APIResponse = get_body;

                    console.log('Got response: ' + get_response.statusCode + ' for reason: ' + get_body.error);
                    return callback(APIResponse);
                }
            } catch (e) {
                console.log(e);
                APIResponse = { error: e };
                return callback(APIResponse);
            }
        });
    }

    private api_post_request(route: string, body: object, callback) {
        /* Sends an HTTP POST request to the passed route, calling
            the callback method with whatever response the backend
            gives.

            route: localhost:3001/signup --- backend_location
        */

        let APIResponse;
        const url: string = route;
        console.log('Submitting POST request to: ' + url);

        request({
            body,
            json: true,
            method: 'POST',
            url,
        }, (error, post_response, post_body) => {
            if (error) {
                console.log(error);
                APIResponse = { error };
                return callback(APIResponse);
            }
            try {
                if (post_response.statusCode === HttpStatus.OK) {
                    APIResponse = post_body;
                    APIResponse.status_code = post_response.statusCode;
                    return callback(APIResponse);
                } else if (post_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                    console.log('302 response: ', post_response);
                    APIResponse = post_response;
                    return callback(APIResponse);
                } else {
                    APIResponse = post_body;
                    console.log('Got response: ' + post_response.statusCode + ' for reason: ' + post_body.error);
                    return callback(APIResponse);
                }
            } catch (e) {
                console.log(e);
                APIResponse = { error: e };
                return callback(APIResponse);
            }
        });
    }

    private api_delete_request(route: string, callback) {
        /* Sends an HTTP DELETE request to the passed route, calling
            the callback method with whatever response the backend
            gives.
        */
        // let data: string = '';
        let APIResponse;
        console.log('submitting DELETE request to: ' + route);
        const url = route;
        request({
            json: true,
            method: 'DELETE',
            url,
        }, (error, delete_response, delete_body) => {
            if (error) {
                console.log(error);
                APIResponse = { error };
                return callback(APIResponse);            }
            try {
                if (delete_response.statusCode === HttpStatus.OK) {
                    APIResponse = delete_body;
                    APIResponse.status_code = delete_response.statusCode;
                    return callback(APIResponse);
                } else if (delete_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                    console.log('302 response: ', delete_response);
                    APIResponse = delete_response;
                    return callback(APIResponse);
                } else {
                    console.log('Got response: ' + delete_response.statusCode + ' for reason: ' + delete_body.error);
                    return callback(null);
                }
            } catch (e) {
                console.log(e);
                APIResponse = { error: e };
                return callback(APIResponse);            }
        });
    }

    private api_put_request(route: string, body: object, callback) {
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
                APIResponse = { error };
                return callback(APIResponse);            }
            try {
                if (put_response.statusCode === HttpStatus.OK) {
                    APIResponse = put_body;
                    APIResponse.status_code = put_response.statusCode;
                    return callback(APIResponse);
                } else if (put_response.statusCode === HttpStatus.MOVED_TEMPORARILY) {
                    console.log('302 response: ', put_response);
                    APIResponse = put_response;
                    return callback(APIResponse);
                } else {
                    APIResponse = put_body;
                    console.log('Got response: ' + put_response.statusCode + ' for reason: ' + put_body.error);
                    return callback(APIResponse);
                }
            } catch (e) {
                console.log(e);
                APIResponse = { error: e };
                return callback(APIResponse);            }
        });
    }

    private generate_get_route(route, args) {

        if (!args) {
            return route;
        }

        let get_route = route + '?';
        for (const [key, value] of Object.entries(args)) {
            get_route += key.toString() + '=' + value.toString() + '&';
        }

        // Don't return the last &.
        return get_route.slice(0, -1);
    }
}
