import { Router } from 'express';
import { ActorV1Controller } from './controllers/actor-v1.controller';

/** Module factory: builds the controller and returns the actor Router. */
export function createActorRouter(): Router {
    const router = Router();
    const controller = new ActorV1Controller();
    router.get('/', controller.list);
    return router;
}
