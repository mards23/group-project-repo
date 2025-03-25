import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import config from '../config.json'; // Ensure correct path
import UserModel from '../users/user.model';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

// Define database object with strict types
const db: {
    sequelize?: Sequelize;
    User?: ReturnType<typeof UserModel>;
} = {};

async function initialize() {
    try {
        // Extract database configuration
        const { host, port, user, password, database } = config.database as DatabaseConfig;

        // Create database if it doesn't exist
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Connect to the database
        const sequelize = new Sequelize(database, user, password, { host, dialect: 'mysql' });

        // Store sequelize instance
        db.sequelize = sequelize;

        // Initialize models
        db.User = UserModel(sequelize); // Ensure this is correctly defined

        // Sync all models with the database
        await sequelize.sync({ alter: true });

        console.log("✅ Database initialized successfully.");
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
        process.exit(1); // Exit the process if initialization fails
    }
}

// Call initialize but ensure it's awaited in top-level usage
initialize();

export default db;