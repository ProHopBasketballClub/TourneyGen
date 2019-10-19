import {Router} from 'express';
import {LeagueController} from '../controllers/league-controller';

// This class mount's the user-controller routes. This means it matches requests type to the function we want called in the controller
export function mountLeagueRoutes(router: Router, route: string) {
    const controller: LeagueController = new LeagueController();
    const allLeagueRoute: string = '/api/league/all';

    router.get(route, (req, res) => {
        controller.get(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                // log error
            });
    });

    router.get(allLeagueRoute, (req, res) => {
        controller.getAll(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                // log error
            });
    });

    router.post(route, (req, res) => {
        controller.post(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                // log error
            });
    });

    router.put(route, (req, res) => {
        controller.put(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                // log error
            });
    });

    router.delete(route, (req, res) => {
        controller.delete(req, res)
            .then(() => {
                // do nothing
            })
            .catch((error) => {
                // log error
            });
    });
}
