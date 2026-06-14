import { Router } from 'express';
import { HealthV1Controller } from './controllers/health-v1.controller';

/** Module factory: builds the controller and returns the health Router. */
export function createHealthRouter(): Router {
    const router = Router();
    const controller = new HealthV1Controller();
    router.get('/', controller.check);
    return router;
}
