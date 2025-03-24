import bcrypt from 'bcryptjs';
import db from '../_helpers/db';
import { Model } from 'sequelize';

export const userService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

// Helper function to ensure User model is initialized
function getUserModel() {
    if (!db.User) {
        throw new Error('User model is not initialized');
    }
    return db.User;
}

async function getAll() {
    const UserModel = getUserModel();
    return await UserModel.findAll();
}

async function getById(id: string) {
    const UserModel = getUserModel();
    return await UserModel.findByPk(id);
}

async function create(params: { title: string; firstName: string; lastName: string; role: string; email: string; password: string }) {
    const UserModel = getUserModel();

    // Validate
    if (await UserModel.findOne({ where: { email: params.email } })) {
        throw new Error(`Email "${params.email}" is already registered`);
    }

    const passwordHash = await bcrypt.hash(params.password, 10);

    const user = await UserModel.create({
        ...params,
        passwordHash, // Correctly assigning hashed password
    });

    return user;
}

async function update(id: string, params: { title?: string; firstName?: string; lastName?: string; role?: string; email?: string; password?: string }) {
    const user = await getUser(id);
    const UserModel = getUserModel();

    // Validate email uniqueness if changed
    if (params.email && user.email !== params.email) {
        if (await UserModel.findOne({ where: { email: params.email } })) {
            throw new Error(`Email "${params.email}" is already taken`);
        }
    }

    // Hash password if provided
    const updatedParams: Partial<typeof params> = { ...params };
    if (params.password) {
        updatedParams.password = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, updatedParams);
    await user.save();
    return user;
}

async function _delete(id: string) {
    const user = await getUser(id);
    await user.destroy();
}

// Helper function to fetch user by ID
async function getUser(id: string) {
    const UserModel = getUserModel();
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error('User not found');
    return user;
}