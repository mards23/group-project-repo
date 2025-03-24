import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

function validateRequest(req: Request, next: NextFunction, schema: ObjectSchema) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        next();
    }
}

export default validateRequest;