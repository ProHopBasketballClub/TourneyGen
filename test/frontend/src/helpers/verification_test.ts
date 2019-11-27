import { expect } from 'chai';
import * as HttpStatus from 'http-status-codes';
import * as nock from 'nock';
import * as sinon from 'sinon';
import * as env from '../../../../web/frontend/env';
import { user_route } from '../../../../web/frontend/src/constants/routes';
import { create_cookie, destroy_cookie, generate_auth_token, is_logged_in } from '../../../../web/frontend/src/helpers/verification';

const backend_location = (env as any).env.BACKEND_LOCATION;

describe('Test the verification functions', () => {
    describe('Test create_cookie should add the specified cookie to the response', () => {

        const call_args = [
            'cookie_name',
            'cookie_value',
            {}, // cookie_params
        ];

        it('Should create a cookie with the correct name and value on the response', () => {
            const response_object = {
                cookie() { /* do nothing */
                },
            };
            const response_mock = sinon.mock(response_object);
            response_mock.expects('cookie').withExactArgs(...call_args);

            create_cookie('cookie_name', 'cookie_value', response_object, {});

            response_mock.verify();
        });
    });

    describe('Test destroy_cookie should set the specified cookie to be removed', () => {
        // Testing cookie.set working is both hard and redundant.
        // That is a method provided by an npm library, and it is presumably
        // tested there, thus we only test our returns.
        const call_args = {cookie_name: 'test'};

        const response_object = {
            cookie() { /* do nothing */
            },
        };
        const response_mock = sinon.mock(response_object);
        create_cookie('cookie_name', 'cookie_value', response_object, {});
        response_mock.verify();

        it('Should return true for a valid token name', () => {
            expect(destroy_cookie('cookie_name', response_object, call_args)).to.equal(true);
        });

        it('Should return false for an invalid token name', () => {
            expect(destroy_cookie('fake_name', response_object, call_args)).to.equal(false);
        });
    });

    describe('Test generate_auth_token generates a token consistently for specific users', () => {

        const u1_name = 'UserA';
        const u1_email = 'UserA@tourneygen.theserverproject.com';
        const u1__id = 'df842jf24iv024';
        const u1_srn = 0.383483;
        const u2_name = 'UserB';
        const u2_email = 'UserB@tourneygen.theserverproject.com';
        const u2__id = 'sdfldf393fhf';
        const u2_srn = 0.383483;

        it('Should generate the same token for the same inputs', () => {
            const u1_token = generate_auth_token(u1__id, u1_email, u1_name, u1_srn);

            expect(generate_auth_token(u1__id, u1_email, u1_name, u1_srn)).to.equal(u1_token);
        });

        it('Should not generate the same token for different inputs', () => {
            const u1_token = generate_auth_token(u1__id, u1_email, u1_name, u1_srn);

            expect(generate_auth_token(u1__id, u2_email, u2_name, u2_srn)).to.not.equal(u1_token);
        });
    });

    describe('Test is_logged_in calls success and failure callbacks correctly', () => {

        const srn = .1415926535;

        const response_object = {
            _id: '123abc',
            displayName: 'user',
            email: 'user@email.com',
            status_code: HttpStatus.OK,
        };

        const valid_cookies = {
            tourneygen_auth: generate_auth_token('123abc', 'user@email.com', 'user', srn),
            tourneygen_srn: srn,
            tourneygen_user: 'user',
        };

        const invalid_auth_cookies = {
            tourneygen_auth: 'This is not the correct auth token.',
            tourneygen_srn: srn,
            tourneygen_user: 'user',
        };

        const invalid_user_cookies = {
            tourneygen_auth: generate_auth_token('123abc', 'user@email.com', 'invalid_user', srn),
            tourneygen_srn: srn,
            tourneygen_user: 'invalid_user',
        };

        const missing_auth_cookie = {
            tourneygen_srn: srn,
            tourneygen_user: 'invalid_user',
        };

        const missing_srn_cookie = {
            tourneygen_auth: generate_auth_token('123abc', 'user@email.com', 'invalid_user', srn),
            tourneygen_user: 'invalid_user',
        };

        const missing_user_cookie = {
            tourneygen_auth: generate_auth_token('123abc', 'user@email.com', 'invalid_user', srn),
            tourneygen_srn: srn,
        };

        beforeEach('Stub out http.get', () => {
            // Setup a nock interceptor to intercept the fake request being made.
            nock(backend_location)
                .get(user_route + '?displayName=user')
                .reply(HttpStatus.OK, response_object);
        });
        afterEach('Clean out the nock interceptors', () => {
            nock.cleanAll();
        });

        it('Should call success callback when the auth_tokens match', (done) => {
            is_logged_in(valid_cookies, (successful_query) => {
                done();
            }, (failure) => {
                // This is a fail state. Console log the reasoning and wait for timeout.
                console.log(failure.reason);
            });
        });

        it('Should call the failure callback when the auth_tokens dont match with a reason', (done) => {
            is_logged_in(invalid_auth_cookies, (sucessful_query) => {
                // This is a fail state, wait for a timeout.
            }, (failure) => {
                expect(!!failure.reason).to.equal(true);
                done();
            });
        });

        it('Should call the failure callback when the user does not exist in db with a reason', (done) => {
            nock(backend_location)
                .get(user_route + '?displayName=invalid_user')
                .reply(HttpStatus.OK, null);

            is_logged_in(invalid_user_cookies, (sucessful_query) => {
                // This is a fail state. Wait for a timeout.
            }, (failure) => {
                expect(!!failure.reason).to.equal(true);
                done();
            });
        });

        it('Should call the failure callback when the auth cookie is not present with a reason', (done) => {
            is_logged_in(missing_auth_cookie, (user_object) => {
                // This is a fail state. Wait for a timeout.
            }, (failure) => {
                expect(!!failure.reason).to.equal(true);
                done();
            });
        });

        it('Should call the failure callback when the user cookie is not present with a reason', (done) => {
            is_logged_in(missing_user_cookie, (user_object) => {
                // This is a fail state. Wait for a timeout.
            }, (failure) => {
                expect(!!failure.reason).to.equal(true);
                done();
            });
        });

        it('Should call the failure callback when the srn cookie is not present with a reason', (done) => {
            is_logged_in(missing_srn_cookie, (user_object) => {
                // This is a fail state. Wait for a timeout.
            }, (failure) => {
                expect(!!failure.reason).to.equal(true);
                done();
            });
        });

        it('Should call the success callback with the user object', (done) => {
            is_logged_in(valid_cookies, (user_object) => {
                expect(user_object).to.eql(response_object);
                done();
            }, (failure) => {
                // This is a fail state. Console log the reasoning and wait for timeout.
                console.log(failure.reason);
            });
        });
    });
});
