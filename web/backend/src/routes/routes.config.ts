
import { Router } from 'express';


import {mountUserRoutes} from "./user.routes";

/**
 * Mounts all routes for the app
 *
 * @export
 */
export function mountRoutes(router: Router) {
    mountUserRoutes(router,'/api/user')
}
