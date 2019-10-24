import {Router} from 'express';
import {IController} from '../controllers/controller.interface';

// This class mount's all of the controller routes
export function mountAllRoutes(router: Router, controllers: IController[], routes: string[]) {
    for (let i = 0; i < controllers.length; i++) {

        router.get(routes[i], (req, res) => {
            controllers[i].get(req, res)
                .then(() => {
                    // do nothing
                })
                .catch((error) => {
                    console.log(error);
                });
        });

        router.get(routes[i] + '/all', (req, res) => {
            controllers[i].getAll(req, res)
                .then(() => {
                    // do nothing
                })
                .catch((error) => {
                    console.log(error);
                });
        });

        router.post(routes[i], (req, res) => {
            controllers[i].post(req, res)
                .then(() => {
                    // do nothing
                })
                .catch((error) => {
                    console.log(error);
                });
        });

        router.put(routes[i], (req, res) => {
            controllers[i].put(req, res)
                .then(() => {
                    // do nothing
                })
                .catch((error) => {
                    console.log(error);
                });
        });

        router.delete(routes[i], (req, res) => {
            controllers[i].delete(req, res)
                .then(() => {
                    // do nothing
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }
}
