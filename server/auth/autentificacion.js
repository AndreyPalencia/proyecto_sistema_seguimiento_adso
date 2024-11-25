const { SECRET_JWT_KEY, MAIL_USER ,PASS_MAIL_USER } = process.env;
const db = require('../config/base_datos');

//Dependecias 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Función para el iniciar sesión
exports.iniciarSesion = async (req, res) => {
    const { tipo_documento, numero_documento, password } = req.body;    

    Validaciones.password(password);
    Validaciones.numeroDocumento(numero_documento);
    Validaciones.tipo_documento(tipo_documento);

    try {
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE numero_documento = ? AND tipo_documento = ?', [numero_documento, tipo_documento]);

        const usuario = usuarioExistente[0];

        if (usuarioExistente.length === 0) {
            return res.status(400).send({ mensaje: "El usuario o contraseña es incorrecta." });
        }
        
        const contrasenia = await bcrypt.compare(
            String(password),
            String(usuario.password)
        );

        if (!contrasenia) {
            return res.status(400).send({ mensaje: "El usuario o contraseña es incorrecta." });
        }
        
        const token = jwt.sign({
            id: usuario.id_usuario, tipo_documento: usuario.tipo_documento,
            documento: usuario.numero_documento, password: contrasenia, rol: usuario.rol,
            estado_usuario: usuario.estado_usuario
            },  SECRET_JWT_KEY, 
            { expiresIn: '1h' });

        res.cookie('acceso_token', token, {
            httpOnly: true, //solo se puede acceder desde el servidor
            secure: process.env.NODE_ENV === 'production',//solo se puede acceder por http
            sameSite: 'strict', //solo se puede acceder desde el mismo dominio
            maxAge: 1000 * 60 * 60 //tiempo de una hora
        }).send({ mensaje: "Inicio de sesion Autorizado." });

    } catch (error) {
        console.log("Error en el inicio de sesión ", error);
        res.status(500).send({ mensaje: "Error en el inicio de sesión", error: error });
    }
}

//Cerrar sesion
exports.cerrarSesion = async (req, res) => {
    try {
        res.clearCookie('acceso_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // solo en producción
            sameSite: 'strict'
        }).status(200).send({ mensaje: 'Sesión cerrada' });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).send({ mensaje: 'Error al cerrar sesión' });
    }
}

//cambiar contraseña
exports.cambiarContrasenia = async (req, res) => {

    const token = req.cookies.acceso_token;
    const { password, nuevaPassword } = req.body;
    
    //Se manda en header
    if (!password || !nuevaPassword) return res.status(400).send({ mensaje: 'Se deben proporcionar la contraseña actual y la nueva contraseña' });

    if (nuevaPassword.length < 8) return res.status(400).send({ mensaje: 'La nueva contraseña debe tener al menos 8 caracteres' });

    try {
        //Obtengo los datos de cookiees
        const usuarioData = jwt.verify(token, SECRET_JWT_KEY);
        const usuarioId = usuarioData.id;

        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [usuarioId]);

        if (!usuarioExistente) return res.status(404).send({ mensaje: 'Usuario no encontrado' });

        // Comparo la contraseña proporcionada con la almacenada
        const contraseniaCorrecta = bcrypt.compare(password, usuarioExistente.password);

        if (!contraseniaCorrecta) {
            return res.status(400).send({ mensaje: 'La contraseña actual no es correcta' });
        }

        // Encripto la nueva contraseña
        const nuevaContraseniaEncryptada = await bcrypt.hash(nuevaPassword, 10);

        // Actualizo la contraseña en la base de datos
        await db.query('UPDATE usuario SET password = ? WHERE id_usuario = ?', [nuevaContraseniaEncryptada, usuarioId]);

        res.status(200).send({ mensaje: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.log("Error al cambiar la contraseña:", error);
        res.status(401).send({ mensaje: 'error', error })
    }
}

exports.recuperarContrasenia = async (req, res) => {

    const { correo_electronico } = req.body;

    if (!correo_electronico) return res.status(400).send({ mensaje: "El correo electrónico es requerido." });

    try {
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE correo_electronico = ?', [correo_electronico]);

        if (usuarioExistente.length < 1) {
            return res.status(404).send({ mensaje: "Usuario no encontrado" });
        }

        const recuperarCuentaUsuario = usuarioExistente[0];

        //Generar token JWT para recuperar contraseña
        const tokenRecuperacion = jwt.sign({
            id: recuperarCuentaUsuario.id_usuario,
            username: recuperarCuentaUsuario.nombre,
            rol: recuperarCuentaUsuario.rol,
            documento: recuperarCuentaUsuario.numero_documento
        }, SECRET_JWT_KEY, { expiresIn: '1h' });


        //Enviar email con link para recuperar contraseña
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MAIL_USER,
                pass: PASS_MAIL_USER
            }
        });

        const mailOptions = {
            from: mail_user,
            to: correo_electronico,
            subject: 'Recuperar contraseña',
            text: `Haga click en el siguiente enlace para recuperar su contraseña: http://localhost:3000/auth/reset/?token=${tokenRecuperacion}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send({ mensaje: "Error al enviar el correo de recuperación de contraseña." });
            } else {
                console.log('Email sent: ' + info.response);
                res.send({ mensaje: "Correo enviado para recuperación de contraseña." });
            }
        });

        res.status(200).send({ mensaje: "Token enviado al correo" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ mensaje: "Error en el servidor" });
    }
}

class Validaciones {
    static password(password) {
        if (!password ) return res.status(401).json("Contraseña es requerida"); 
        if (password.length < 6) return res.status(401).json("Contraseña debe tener al menos 8 caracteres");        
    }

    static numeroDocumento(numero_documento) {
        if (!numero_documento) return res.status(401).json("Número de documento es requerido");
        if (numero_documento.length < 10) return res.status(401).json("Número de documento debe tener al menos 10 caracteres");
        if (!/^\d+$/.test(numero_documento)) return res.status(401).json("Número de documento solo puede contener números");
    }

    static tipo_documento(tipo_documento) { 
        if (!tipo_documento) return res.status(401).json("Tipo de documento es requerido");
        //if (!["CC", "TI", "CE", "PEP", "PPT"].includes(tipo_documento)) return res.status(401).json("Tipo de documento válido son CC, TI y CE");
    }
}