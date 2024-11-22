const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

class LoginController {
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            //Validar que ambos campos esten presentes
            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos..' });
            }

            const pool = await UserModel.connect();

            //Buscar el user
            const [user] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [email]);

            //si no existe usuario
            if (user.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado..' });
            }

            //Validar la contraseña
            const passwordMatch = await bcrypt.compare(password, user[0].password);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta..' });
            }

            //Si la password es correcta, devolver el user_id (email)
            return res.status(200).json({ user_id: user[0].id_usuario})

        } catch (error) {
            console.error('Error al iniciar sesion:',error);
            return res.status(500).json({ message: 'Error en el servidor'})
        }
    }
}

module.exports = new LoginController();