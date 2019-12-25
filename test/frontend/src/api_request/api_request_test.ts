import { expect } from 'chai';
import * as HttpStatus from 'http-status-codes';
import * as nock from 'nock';
import ApiRequest from '../../../../web/v1/frontend/src/api_request/api_request';

describe('Test the ApiRequest\'s public methods', () => {
    describe('Test ApiRequest GET requests should call the callback with the correct parameters', () => {

        const response_object = {
            _id: '123abc',
            displayName: 'user',
            email: 'user@email.com',
            status_code: HttpStatus.OK,
        };

        beforeEach('Stub out http.get', () => {
            // Setup a nock interceptor to intercept the fake request being made.
            nock('http://www.website.com')
                .get('/the/backend')
                .reply(HttpStatus.OK, response_object);
        });
        afterEach('Clean out the nock interceptors', () => {
            nock.cleanAll();
        });

        it('Should call the callback method on success.', (done) => {

            const request_route = 'http://www.website.com/the/backend';
            const request = new ApiRequest('GET', request_route, { params: null, body: null });

            request.send_request((data) => {
                expect(data).to.not.equal(null);
                done(); // The callback was called!
            });
        });

        it('Should call the callback method on invalid URL.', (done) => {

            const request_route = 'http://invalidURL/invalid';
            const request = new ApiRequest('GET', request_route, { params: null, body: null });

            request.send_request((data) => {
                done(); // The callback was called!
            });
        });

        it('Should call the callback method on invalid data returned', (done) => {
            // Setup a nock interceptor to return invalid data.
            nock('http://invalid.website.com')
                .get('/the/backend')
                .reply(HttpStatus.OK, '<!DOCTYPE html>');

            const request_route = 'http://invalid.website.com/the/backend';
            const request = new ApiRequest('GET', request_route, { params: null, body: null });

            request.send_request( (data) => {
                done(); // The callback was called!
            });
        });

        it('Should pass the correct APIResponse to the callback method on successful get request.', (done) => {

            const request_route = 'http://www.website.com/the/backend';
            const request = new ApiRequest('GET', request_route, { params: null, body: null });

            request.send_request(  (data) => {
                expect(data).to.eql(response_object); // eql for object equality check.
                done();
            });
        });

        it('Should pass an error object to the callback method on failure.', (done) => {

            const request_route = 'http://invalidURL/invalid';
            const request = new ApiRequest('GET', request_route, { params: null, body: null });

            request.send_request( (data) => {
                expect(!!data.error).to.equal(true);
                done();
            });
        });
    });

    describe('Test api_post_request should call the callback with the correct parameters', () => {

        const response_object = {
            _id: '123abc',
            displayName: 'user',
            email: 'user@email.com',
            status_code: HttpStatus.OK,
        };

        const correct_route = 'http://www.website.com';
        const incorrect_route = 'http://invalidURL';

        const correct_path = '/the/backend';
        const incorrect_path = '/invalid';

        const valid_url = correct_route + correct_path;

        const body = {
            email: 'testing@gmail.com',
            username: 'testing',
        };

        beforeEach('Stub out http.post', () => {
            // Setup a nock interceptor to intercept the fake request being made.
            nock(correct_route)
                .post(correct_path)
                .reply(HttpStatus.OK, response_object);
        });
        afterEach('Clean out the nock interceptors', () => {
            nock.cleanAll();
        });

        it('Should call the callback method on success.', (done) => {

            const request = new ApiRequest('POST', valid_url, { params: null, body });

            request.send_request((data) => {
                expect(data).to.not.equal(null);
                done(); // The callback was called!
            });
        });

        it('Should call the callback method on 302', (done) => {
            nock(correct_route)
                .get(correct_path)
                .reply(HttpStatus.MOVED_TEMPORARILY, '<!DOCTYPE html>');

            const request = new ApiRequest('POST', valid_url, { params: null, body });

            request.send_request((data) => {
                done(); // The callback was called!
            });
        });

        it('Should call the callback method on invalid URL.', (done) => {

            const request = new ApiRequest('POST', incorrect_route + incorrect_path, { params: null, body });

            request.send_request((data) => {
                done(); // The callback was called!
            });
        });

        it('Should call the callback method on invalid data returned', (done) => {
            // Setup a nock interceptor to return invalid data.
            nock(incorrect_route)
                .get(correct_path)
                .reply(HttpStatus.OK, '<!DOCTYPE html>');

            const request = new ApiRequest('POST', incorrect_route + correct_path, { params: null, body });

            request.send_request((data) => {
                done(); // The callback was called!
            });
        });

        it('Should pass the correct APIResponse to the callback method on successful post request.', (done) => {

            const request = new ApiRequest('POST', valid_url, { params: null, body });

            request.send_request((data) => {
                expect(data).to.eql(response_object); // eql for object equality check.
                done();
            });
        });

        it('Should pass an error object to the callback method on failure.', (done) => {

            const request = new ApiRequest('POST', incorrect_route + incorrect_path, { params: null, body });

            request.send_request((data) => {
                expect(!!data.error).to.equal(true);
                done();
            });
        });
    });
});
