const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

class RegisterController {

    async registerUser(req, res) {
        try {
            const {email, password } = req.body;

            //Validar que ambos campos esten presentes
            if (!email || !password) {
                return res.status(400).json({message: 'Email y contraseña son requeridos..'});
            }

            //Encriptar password
            const hashedPassword = await bcrypt.hash(password, 10);

            //Crear el usuario en la BDD
            await UserModel.createUser(email, hashedPassword);

            //Proceso para guardar el ID del usuario en LocalStorage mediante front
            res.status(201).json({
                message: 'Usuario creado correctamente',
                userId: email
            });
        } catch (error) {
            console.error('Error en el registro', error);
            res.status(500).json({message: 'Error interno del server'});
        }
    }
}

module.exports = new RegisterController();