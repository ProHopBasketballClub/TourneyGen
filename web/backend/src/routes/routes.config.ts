
import { Router } from 'express';

import {mountLeagueRoutes} from './league.routes';
import {mountUserRoutes} from './user.routes';

/**
 * Mounts all routes for the app
 *
 * @export
 */
export function mountRoutes(router: Router) {
    mountUserRoutes(router,'/api/user');
    mountLeagueRoutes(router,'api/league');
}
