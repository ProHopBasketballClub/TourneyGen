
import { Router } from 'express';

import { mountToDoRoutes } from './todo.routes';

/**
 * Mounts all routes for the app
 *
 * @export
 */
export function mountRoutes(router: Router) {
    const todoRoute = process.env.TODO_ROUTE || '/api/todo';
    mountToDoRoutes(router, todoRoute);
}