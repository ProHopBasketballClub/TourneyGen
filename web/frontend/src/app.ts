import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import * as path from 'path';
import * as env from '../env';
import { league_get_all_route, league_route, match_get_all_route, match_route, team_get_all_route, team_route, user_route } from './constants/routes';
import { api_delete_request, api_get_multiple_requests,  api_get_request, api_post_request,
     api_put_request, create_cookie, destroy_cookie, generate_auth_token, generate_get_route, is_logged_in } from './helpers/routing';

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

let errors = [];

app.get('/', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const current_user = success.displayName;
        api_get_request(backend_location + league_get_all_route, (all_leagues) => {
            const leagues = [];
            all_leagues.forEach((league) => {
                if (league.Owner === success._id) {
                    leagues.push({ name: league.Name, id: league._id });
                }
            });
            api_get_request(backend_location + team_get_all_route, (all_teams) => {
                const teams = [];
                all_teams.forEach((team) => {
                    if(team.Owner === success._id) {
                        teams.push({ name: team.Name, id: team._id });
                    }
                });
                res.render('home', {
                    current_user,
                    errors,
                    leagues,
                    teams,
                });
                errors = [];
            });

        });
    }, (failure) => {
        res.redirect('/login');
    });
});

app.get('/league/:id', (req,res) => {
    const teams = [];
    const tournaments = [];
    const matches = [];
    is_logged_in(req.cookies, (success) => {
        const current_user = success.displayName;
        // this value ensures the HTML page is rendered before variables are used
        const route = backend_location + generate_get_route(league_route, { id: req.params.id });
        api_get_request(route, (league_object) => {
            const page_rendered=true;
            if(league_object._id === req.params.id) {
                // TODO: getting a league object SHOULD return a list of teams, tournaments and matches
                const league = {
                    _id: league_object._id,
                    description: league_object.Description,
                    game_type: league_object.Game_type,
                    name: league_object.Name,
                    teams: league_object.Teams,
                };
                const is_admin = (league_object && success && success._id && (league_object.Owner=== success._id));

                const team_routes = [];
                league.teams.forEach((team) => {
                    team_routes.push(backend_location + generate_get_route(team_route, {id: team}));
                });
                api_get_request(backend_location + match_get_all_route, (match_response) => {
                    if (match_response) {
                        match_response.forEach((match) => {
                            if (match.League === league._id) {
                                matches.push({
                                    away: match.Away,
                                    confirmed: match.Confirmed,
                                    home: match.Home,
                                    id: match._id,
                                    league: match.League,
                                    name: match.Title,
                                    tournament: match.Tournament,
                                    });
                            }
                        });
                    }

                    // This will make an api request to get a team object for each team id in the league
                    api_get_multiple_requests(team_routes, (response_object) => {
                        if (response_object) {
                            response_object.forEach((team) => {
                                teams.push({ name: team.Name, id: team._id, league: team.League });
                            });
                            // Sort team names alphabetically - not sure if this is best way
                            // but its better than a random order due to async.
                            teams.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
                        }
                        res.render('leagues', {
                            current_user,
                            errors,
                            is_admin,
                            league,
                            matches,
                            page_rendered,
                            teams,
                            tournaments,
                        });
                        errors = [];
                    });
                });
            }
        });

    }, (failure) => {
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        res.redirect('/');
    }, (failure) => {
        res.render('login', {
            errors,
        });
        errors = [];
    });
});

app.get('/match/:id', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        let match = {};
        let home_team = {};
        let away_team = {};
        const current_user = success.displayName;
        const route = backend_location + generate_get_route(match_route, { id: req.params.id });
        api_get_request(route, (match_object) => {
            if (match_object) {
                match = {
                    away: match_object.Away,
                    confirmed: match_object.Confirmed,
                    home: match_object.Home,
                    id: match_object._id,
                    league: match_object.League,
                    name: match_object.Title,
                    tournament: match_object.Tournament,
                };
            }
            const away_route = backend_location + generate_get_route(team_route, {id: match_object.Away});
            const home_route = backend_location + generate_get_route(team_route, {id: match_object.Home});
            const routes = [home_route, away_route];
            api_get_multiple_requests(routes, (teams_callback) => {
                teams_callback.forEach((team) => {
                    if (team._id === match_object.Home) {
                        home_team = {id: team._id, name: team.Name, description: team.Description, roster: team.Roster};
                    } else if (team._id === match_object.Away) {
                        away_team = {id: team._id, name: team.Name, description: team.Description, roster: team.Roster};
                    }
                });
                const page_rendered=true;
                res.render('match', {
                    away_team,
                    current_user,
                    errors,
                    home_team,
                    match,
                    page_rendered,
                });
            });
        });
    }, (failure) => {
        res.redirect('/login');
    });
});

app.get('/signup', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        res.redirect('/');
    }, (failure) => {
        res.render('signup', {
            errors,
        });
        errors = [];
    });
});

app.get('/team/:id', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const current_user = success.displayName;
        const route = backend_location + generate_get_route(team_route, { id: req.params.id });
        api_get_request(route, (team_object) => {
            if(team_object._id === req.params.id) {
                const owner_route = backend_location + generate_get_route(user_route, {id: team_object.Owner});
                api_get_request(owner_route, (owner_object) =>  {
                    const team_league_route = backend_location + generate_get_route(league_route, {id: team_object.League});
                    api_get_request(team_league_route, (league_object) => {
                        const team = {
                            description: team_object.Description,
                            id: team_object._id,
                            name: team_object.Name,
                            roster: team_object.Roster,
                        };

                        const league = {
                            id: league_object._id,
                            name: league_object.Name,
                        };
                        if (owner_object._id === team_object.Owner) {
                            const page_rendered=true;
                            const owner = {
                                _id: owner_object._id,
                                email: owner_object.email,
                                name: owner_object.displayName,
                            };
                            // This allows the PUG page to only render admin tools if user owns the team
                            const is_admin = (owner && success && success._id && (owner._id === success._id));
                            res.render('team', {
                                current_user,
                                errors,
                                is_admin,
                                league,
                                owner,
                                page_rendered,
                                team,
                            });
                            errors = [];
                        }
                    });
                });
            }
        });
    }, (failure) => {
        res.redirect('/login');
    });
});

app.post('/add_team', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const teamName = req.body.teamName;
        const teamDescription = req.body.teamDescription;
        const ownerEmail = req.body.teamOwnerEmail;
        const textRoster = req.body.teamRoster;
        const leagueId = req.body.leagueId;

        if (!(teamName && teamDescription && ownerEmail && textRoster)) {
            errors.push('All fields are required');
            // TODO: When frontend error handling is implemented, report this error.
            res.redirect('back');
            return;
        }

        const teamRoster = (textRoster as string).split(',').map((item) => item.trim());

        // Get the userID for the email.
        const route = backend_location + generate_get_route(user_route, { email: ownerEmail });
        api_get_request(route, (user_object) => {
            if (!user_object || !user_object._id || !user_object.email || !user_object.displayName) {
                // User wasn't valid.
                errors.push(user_object.error);
                // TODO: When possible, pass that info along.
                res.redirect('back');
                return;
            }

            const payload = {
                Description: teamDescription,
                League: leagueId,
                Name: teamName,
                Owner: user_object._id,
                Roster: teamRoster,
            };
            api_post_request(backend_location, team_route, payload, (backend_response) => {
                if (backend_response) {
                    if (backend_response.status_code === HttpStatus.OK) {
                        // Redirect the user so that the new team appears.
                        res.redirect('back');
                        return;
                    }
                }

                errors.push(backend_response.error);
                // Error case handled here, all success cases above should have returned.
                // TODO: When we have front-end error handling, it should be reported here.
                res.redirect('/');
            });

        });

    }, (failure) => {
        res.redirect('/login');
    });
});

app.post('/create_league', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const ownerId = success._id;
        const name = req.body.leagueName ? req.body.leagueName : '';
        const description = req.body.leagueDescription ? req.body.leagueDescription : '';
        const gameType = req.body.leagueGameType ? req.body.leagueGameType : '';

        const payload = {
            Description: description,
            Game_type: gameType,
            Name: name,
            Owner: ownerId,
        };

        api_post_request(backend_location, league_route, payload, (backend_response) => {
            if (backend_response) {
                if (backend_response.status_code === HttpStatus.OK) {
                    // Redirect the user so that the new league appears.
                    res.redirect('/');
                    return;
                }
            }

            errors.push(backend_response.error);
            // Error case handled here, all success cases above should have returned.
            // TODO: When we have front-end error handling, it should be reported here.

            res.redirect('/');
        });
    }, (failure) => {

        res.redirect('/login');
    });
});

app.post('/create_match', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const homeTeam = req.body.homeTeam;
        const awayTeam = req.body.awayTeam;
        const league = req.body.leagueId;

        const payload = {
            Away: awayTeam,
            Home: homeTeam,
            League: league,
        };

        api_post_request(backend_location, match_route, payload, (backend_response) => {
            if (backend_response) {
                if (backend_response.status_code === HttpStatus.OK) {
                    // Redirect the user so that the new league appears.
                    res.redirect('back');
                    return;
                }
            }

            errors.push(backend_response.error);
            // Error case handled here, all success cases above should have returned.
            // TODO: When we have front-end error handling, it should be reported here.

            res.redirect('back');
        });
    }, (failure) => {

        res.redirect('/login');
    });
});

app.post('/delete_league', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const leagueId = req.body.leagueId ? req.body.leagueId : '';

        api_delete_request(generate_get_route(backend_location + league_route, { id: leagueId }), (backend_response) => {
            if (backend_response) {
                if (backend_response.status_code === HttpStatus.OK) {
                    // Redirect the user so that the changes appear.
                    res.redirect('/'); // Go back to home
                }
            }
        });

    }, (failure) => {
        res.redirect('/login');
    });
});

app.post('/edit_league', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const leagueOwner = success._id;
        const leagueName = req.body.leagueName;
        const leagueDescription = req.body.leagueDescription;
        const leagueGameType = req.body.leagueGameType;
        const leagueId = req.body.leagueId ? req.body.leagueId : '';

        if (!leagueName || !leagueDescription || !leagueGameType || !leagueId) {
            errors.push('All fields are required');
            // TODO: When we have front-end error handling, it should be reported here.
            res.redirect('back'); // Go back to the refferer.
        }

        const payload = {
            Description: leagueDescription,
            Game_type: leagueGameType,
            Name: leagueName,
            Owner: leagueOwner,
        };

        api_put_request(generate_get_route(backend_location + league_route, { id: leagueId }), payload, (backend_response) => {
            if (backend_response) {
                if (backend_response.status_code === HttpStatus.OK) {
                    // Redirect the user so that the changes appear.
                    res.redirect('back'); // Go back to the refferer.
                }
            }
        });

    }, (failure) => {
        res.redirect('/login');
    });
});

app.post('/edit_team', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        const teamOwner = success._id;
        const teamName = req.body.teamName;
        const teamDescription = req.body.teamDescription;
        const textRoster = req.body.teamRoster;
        const teamId = req.body.teamId ? req.body.teamId : '';

        if (!teamName || !teamDescription || !textRoster || !teamId) {
            // TODO: When we have front-end error handling, it should be reported here.
            res.redirect('back'); // Go back to the refferer.
        }
        const teamRoster = (textRoster as string).split(',').map((item) => item.trim());

        const payload = {
            Description: teamDescription,
            Name: teamName,
            Owner: teamOwner,
            Roster: teamRoster,
        };

        api_put_request(generate_get_route(backend_location + team_route, { id: teamId }), payload, (backend_response) => {
            if (backend_response) {
                if (backend_response.status_code === HttpStatus.OK) {
                    // Redirect the user so that the changes appear.
                    res.redirect('back'); // Go back to the refferer.
                }
            }
        });

    }, (failure) => {
        res.redirect('/login');
    });
});

app.post('/login', (req, res) => {
    is_logged_in(req.cookies, (success) => {
        // User is already logged in, so ignore their request.
    }, (failure) => {
        // Check for no body, and for string versions of falsey things.
        if (!req.body.username || req.body.username === 'undefined' || req.body.username === 'null') {
            res.redirect('/login');
            return;
        }

        const username = req.body.username;
        const route = backend_location + generate_get_route(user_route, { displayName: username });

        api_get_request(route, (user_object) => {
            if (!user_object || !user_object._id || !user_object.email || !user_object.displayName) {
                // User wasn't valid.
                // When possible, pass that info along.
                if (user_object) {
                    errors.push(user_object.error);
                }
                res.redirect('/login');
                return;
            }

            const id = user_object._id;
            const email = user_object.email;
            const name = user_object.displayName;
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

app.post('/logout', async (req, res) => {
    destroy_cookie('tourneygen_srn', res, req.cookies);
    destroy_cookie('tourneygen_auth', res, req.cookies);
    destroy_cookie('tourneygen_user', res, req.cookies);
    res.redirect('/login');
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
        if (user_object && user_object.status_code === HttpStatus.OK) {
            res.redirect('/login');
        } else {
            errors.push(user_object.error);
            res.redirect('/signup');
        }
    });
});

app.listen(port,() => {
    return console.info(`Server is listening on port ${port}`);
});

app.use((req, res) => {
    res.status(HttpStatus.NOT_FOUND);

    // respond with html page

    res.render('404 not found');
    return;
});
