import { Request, Response } from 'express';
import { SuccessMessageConstant } from '../../../shared/constants/success-message.constant';
import { ACTOR_LIST } from '../constants/actor.constant';
import { ActorV1Response } from '../dtos/responses/actor-v1.response';

/**
 * Exposes the hardcoded actor list for the status-change dropdown. There is no auth and
 * no persistence, so this reads the constant directly with no service or repository.
 */
export class ActorV1Controller {
    list = (_req: Request, res: Response): void => {
        res.success(
            ActorV1Response.MapEntities(ACTOR_LIST),
            SuccessMessageConstant.ActorsRetrieved,
            200,
        );
    };
}
