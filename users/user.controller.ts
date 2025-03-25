import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import validateRequest from '../_middleware/validate.request';
import { Role } from '../_helpers/role';
import userService from '../users/user.service';

const router = express.Router();

// Routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

// Route functions
async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users: any = await userService.getAll();
        res.json(users);
    } catch (error: any) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const id: number = parseInt(req.params.id, 10);
        const user: any = await userService.getById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error: any) {
        next(error);
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.create(req.body);
        res.json({ message: 'User created' });
    } catch (error: any) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const id: number = parseInt(req.params.id, 10);
        await userService.update(id, req.body);
        res.json({ message: 'User updated' });
    } catch (error: any) {
        next(error);
    }
}

async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        const id: number = parseInt(req.params.id, 10);
        await userService.delete(id);
        res.json({ message: 'User deleted' });
    } catch (error: any) {
        next(error);
    }
}

// Schema validation functions
function createSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        role: Joi.string().valid(Role.Admin, Role.User).optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).optional(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).optional(),
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}