const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;


class FileModel {
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
                port: DB_PORT || 3306,
                connectionLimit: 10,
            });
        }
        return this.connection;
    }

    //Creacion de archivo en RDS
    async createFile(id_usuario, titulo_archivo, url_archivo) {
        try {
            const pool = await this.connect();
            const query = `
                INSERT INTO archivos (id_usuario, titulo_archivo, url_archivo)
                VALUES (?, ?, ?)
            `;

            const [result] = await pool.query(query, [id_usuario, titulo_archivo, url_archivo]);
            return result;
        } catch (error) {
            console.error('Error creating file record:', error);
            throw new Error('Error al registrar archivo en la base de datos');
        }
    }

    // Ejemplo de listar archivos por usuario (para verificar funcionalidad)
    async getFilesByUser(id_usuario) {
        try {
            const pool = await this.connect();
            const query = `SELECT * FROM archivos WHERE id_usuario = ?`;
            const [rows] = await pool.query(query, [id_usuario]);
            return rows;
        } catch (error) {
            console.error('Error fetching files for user:', error);
            throw new Error('Error al obtener archivos del usuario');
        }
    }
}

module.exports = new FileModel();