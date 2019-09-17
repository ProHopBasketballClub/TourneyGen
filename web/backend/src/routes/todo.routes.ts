import { Router } from 'express';

import { ToDoController } from '../controllers';

/**
 * Mounts all routes for the ToDoController
 *
 * @see ToDoController
 * @export
 */
export function mountToDoRoutes(router: Router, route: string) {
    const controller = new ToDoController();

    router.get(route, (req, res) => {
        controller.get(req, res)
            .then(() => {
                // do nothing
            })
            .catch(error => {
                // log error
            });
    });

    router.post(route, (req, res) => {
        controller.post(req, res)
            .then(() => {
                // do nothing
            })
            .catch(error => {
                // log error
            });
    });

    router.put(route, (req, res) => {
        controller.put(req, res);
    });

    router.delete(route, (req, res) => {
        controller.delete(req, res);
    });
}