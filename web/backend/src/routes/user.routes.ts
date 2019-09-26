import {Router} from "express";

import {UserController} from "../controllers";

/**
 * Mounts all routes for the ToDoController
 *
 * @see ToDoController
 * @export
 */
export function mountUserRoutes(router: Router, route: string) {
    const controller = new UserController();

    router.get(route, (req, res) => {
        controller.get(req, res)
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
