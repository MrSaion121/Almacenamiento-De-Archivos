const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

class UserModel {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mysql.createPool({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_NAME,
                port: DB_PORT,
                connectionLimit: 10
            });
        }
        return this.connection;
    }

    async createUser(id_usuario, password) {
        try {
            const conn = await this.connect();
            const query = `INSERT INTO usuarios (id_usuario, password) VALUES (?, ?)`;
            const [result] = await conn.execute(query, [id_usuario, password]);
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error al crear usuario');
        }
    }
}

module.exports = new UserModel();
