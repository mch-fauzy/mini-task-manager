import { Request, Response } from 'express';
import { SuccessMessageConstant } from '../../../shared/constants/success-message.constant';

/** Liveness probe. Confirms the app and middleware stack are wired. */
export class HealthV1Controller {
    check = (_req: Request, res: Response): void => {
        res.success({ status: 'ok' }, SuccessMessageConstant.Healthy, 200);
    };
}
