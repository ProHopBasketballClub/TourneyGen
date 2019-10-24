import {Router} from 'express';
import {LeagueController, UserController} from '../controllers';
import {IController} from '../controllers/controller.interface';

import {mountAllRoutes} from './mount.routes';

/**
 * Mounts all routes for the app
 *
 * @export
 */
export function mountRoutes(router: Router) {
    // Routes must be prepended by a slash
    const conts: IController[] = [new UserController(), new LeagueController()];
    const routes: string[] = ['/api/user', '/api/league'];
    mountAllRoutes(router, conts, routes);
}
