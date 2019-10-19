import { Request, Response } from 'express';

/**
 * interface defining the CRUD methods for a controller
 *
 * @export
 */
export interface IController {
    delete(req: Request, res: Response);
    get(req: Request, res: Response);
    post(req: Request, res: Response);
    put(req: Request, res: Response);
}
