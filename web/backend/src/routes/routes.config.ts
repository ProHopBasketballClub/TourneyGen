
import { Router } from 'express';

<<<<<<< HEAD

=======
>>>>>>> Did some linting
import {mountUserRoutes} from "./user.routes";

/**
 * Mounts all routes for the app
 *
 * @export
 */
export function mountRoutes(router: Router) {
<<<<<<< HEAD
    mountUserRoutes(router,'/api/user')
=======
    mountUserRoutes(router,'/api/user');
>>>>>>> Did some linting
}
