const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

//test
console.log({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
});

class UserModel {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            // Creamos un pool de conexiones
            this.connection = await mysql.createPool({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
                port: DB_PORT || 3306,
                connectionLimit: 10
            });
        }
        return this.connection;
    }

    async createUser(id_usuario, password) {
        try {
            const pool = await this.connect();
            const query = `INSERT INTO usuarios (id_usuario, password) VALUES (?, ?)`;
            const [result] = await pool.query(query, [id_usuario, password]);
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error al crear usuario');
        }
    }
}

module.exports = new UserModel();
