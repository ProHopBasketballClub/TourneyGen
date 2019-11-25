import {Router} from 'express';
import {LeagueController, UserController} from '../controllers';
import {IController} from '../controllers/controller.interface';
import {MatchController} from '../controllers/match-controller';
import {TeamController} from '../controllers/team-controller';

import {mountAllRoutes} from './mount.routes';
import {mountMatchRoutes} from './mountMatchRoutes';

/**
 * Mounts all routes for the app
 *
 * @export
 */
export function mountRoutes(router: Router) {
    // Routes must be prepended by a slash
    const conts: IController[] = [new UserController(), new LeagueController(), new TeamController(), new MatchController()];
    const routes: string[] = ['/api/user', '/api/league', '/api/team', '/api/match'];
    mountAllRoutes(router, conts, routes);
    mountMatchRoutes(router);
}
