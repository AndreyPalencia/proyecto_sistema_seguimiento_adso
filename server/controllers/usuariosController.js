const db = require('../config/base_datos'); //Importamos la conexion de la base de datos
const bcryptjs = require('bcryptjs'); //Para encriptar 
const xlsx = require('xlsx'); //Para manipular archivos xlsx 

//encriptar password
const encriptarContrasenia = async (password) => {
    try {
        const hash = await bcryptjs.hash(password, 10);
        return hash;
    } catch (error) {
        console.log("Error al encriptar la contraseña: ", error);
        return null;
    }
}

// Función para validar que no exista un duplicado antes de insertar o actualizar
const validarCamposDuplicados = async (correo, numeroDocumento, usuarioId = null) => {
    // Preparamos la consulta para comprobar duplicados de correo o número de documento
    let consulta = 'SELECT * FROM usuario WHERE (correo_electronico = ? OR numero_documento = ?)';
    let params = [correo, numeroDocumento];

    // Si es una actualización, excluimos el usuario actual
    if (usuarioId) {
        consulta += ' AND id_usuario != ?';
        params.push(usuarioId);
    }

    
    // Ejecutamos la consulta
    const [usuariosExistentes] = await db.query(consulta, params);

    // Si se encuentran usuarios duplicados, retornamos un mensaje de error
    if (usuariosExistentes.length > 0) {

        const duplicadoCorreo = usuariosExistentes.find(u => u.correo_electronico === correo);
        const duplicadoDocumento = usuariosExistentes.find(u => u.numero_documento == numeroDocumento);

        if (duplicadoCorreo && duplicadoDocumento){
            return { error: true, mensaje: "El correo electrónico y el número de documento ya están registrados." };
        }

        if (duplicadoCorreo) {
            return { error: true, mensaje: "El correo electrónico ya está registrado." };
        }

        if (duplicadoDocumento) {
            return { error: true, mensaje: "El número de documento ya está registrado." };
        }

    }

    // Si no hay duplicados, se puede proceder con la inserción o actualización
    return { error: false };
};

//Crear usuarios por un archivo 
exports.crearUsuarioExcel = async (req, res) => {
    const archivo = req.file;
    //Validacion si existe el archivo
    if (!archivo) {
        return res.status(400).json({ mensaje: "No se ha subido ningún archivo." });
    }

    try {
        const workbook = xlsx.readFile(`upload/filesExcel/${archivo.filename}`);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        //Configuracion para lectura del archivo subido
        const jsonDataUsuarios = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '', blankrows: false });

        //Creacion de todos los usuarios registrados en archivo
        const usuarios = await Promise.all(
            jsonDataUsuarios.slice(1).map(async (fila) => {
                const [tipo, documento, nombre, apellido, telefono, correoElectronico, rol, contrasena] = fila;
                const contrasenaEncriptada = await encriptarContrasenia(contrasena.toString());
                return [tipo, documento, nombre, apellido, telefono, correoElectronico, rol, contrasenaEncriptada, 1];
            })
        );

        const consulta = 'INSERT INTO usuario (tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password, estado_usuario) VALUES ?';

        const [resultado] = await db.query(consulta, [usuarios]);
        await conexion.end();

        res.status(201).send({ mensaje: "Usuario creado exitosamente", resultado });
    } catch (error) {
        console.log("Error en la creación de los datos", error);
        res.status(500).send({ mensaje: "Error en la creación de usuario" });
    }
}

//Crear usuarios 
exports.crearUsuario = async (req, res) => {
    const { tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password } = req.body;
    const firma = req.file ? req.file.filename : null;

    const camposRequeridos = [tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password];
    for (const campo of camposRequeridos) {
        if (!campo) {
            return res.status(400).json({ message: 'Todos los campos son requeridos y no deben estar vacíos' });
        }
    }

    //Confirmar la existencia del usuario
    const { error, mensaje } = await validarCamposDuplicados(correo_electronico, numero_documento);
    if (error) {
        return res.status(400).json({ mensaje });
    }

    try {

        const passwordEncryptada = await encriptarContrasenia(password);
        const consulta = 'INSERT INTO usuario (tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, firma, rol, password) VALUES (?,?,?,?,?,?,?,?,?)';
        const datos = [tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, firma, rol, passwordEncryptada];

        const [resultado] = await db.query(consulta, datos);

        res.status(201).json({ mensaje: "Usuario creado exitosamente", resultado });
    } catch (error) {
        console.log("Error en la creación de los datos", error);
        res.status(500).send({ mensaje: "Error en la creación de usuario" });
    }
};

//Obtener usuarios
exports.obtenerUsuarios = async (req, res) => {
    const { estado_usuario, numero_documento, nombre, apellido, correo_electronico } = req.body;
    const filtros = [];
    const valores = [estado_usuario];

    if (numero_documento) {
        filtros.push('numero_documento = ?');
        valores.push(numero_documento);
    }
    if (nombre) {
        filtros.push('nombre LIKE ?');
        valores.push(`%${nombre}%`);
    }
    if (apellido) {
        filtros.push('apellido LIKE ?');
        valores.push(`%${apellido}%`);
    }
    if (correo_electronico) {
        filtros.push('correo_electronico LIKE ?');
        valores.push(`%${correo_electronico}%`);
    }

    const consulta = `SELECT * 
                    FROM usuario 
                    WHERE estado_usuario = ? 
                    ${filtros.length > 0 ? ' AND ' + filtros.join(' AND ') : ''}`;
    try {
        const [resultado] = await db.query(consulta, valores);
        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: "No se encontraron usuarios relacionados." })
        }
        res.status(200).json(resultado);
    } catch (error) {
        console.log("Error en la consulta", error);
        res.status(500).send({ mensaje: "Error en la consulta" });
    }
};

//Visualizar un usuario por id
exports.obtenerUsuarioPorId = async (req, res) => {
    const id_usuario = req.params.idUsuario;
    const { estado_usuario } = req.query;
    const consulta = 'SELECT * FROM usuario WHERE id_usuario = ? AND estado_usuario = ?';
    try {
        const [resultado] = await db.query(consulta, [id_usuario, estado_usuario]);
        if (resultado.length === 0) {
            return res.status(404).send({ mensaje: "Usuario no encontrado o Usuario inactivo" });
        }
        res.json(resultado[0]);
    } catch (error) {
        console.log("Error en la consulta", error);
        res.status(500).send({ mensaje: "Error en la consulta" });
    }
};

//Modificar usuarios
exports.modificarUsuario = async (req, res) => {

    const id_usuario = req.params.idUsuario;

    const {
        tipo_documento, numero_documento,
        nombre, apellido, telefono, correo_electronico,
        firma, rol, password, estado_usuario
    } = req.body;

    // Validación de id_usuario
    if (!id_usuario) {
        return res.status(400).json({ message: 'El id_usuario es requerido' });
    }

    const { error, mensaje } = await validarCamposDuplicados(correo_electronico, numero_documento, id_usuario);
    if (error) {
        return res.status(400).json({ mensaje });
    }


    // Validación de otros campos
    const camposRequeridos = [tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, estado_usuario];
    for (const campo of camposRequeridos) {
        if (!campo) {
            return res.status(400).json({ message: 'Todos los campos son requeridos y no deben estar vacíos ' });
        }
    }

    const firmaNueva = req.file ? req.file.filename : firma;

    if (!password || password.trim() === "") {
        return res.status(400).json({ message: "La contraseña no puede ser vacía o nula." });
    }

    const passwordEncryptada = await encriptarContrasenia(password);

    const consulta = "UPDATE usuario SET tipo_documento = ?, numero_documento = ?, nombre = ?, apellido = ?, telefono = ?, correo_electronico = ?, firma = ?, rol = ?,  password = ?, estado_usuario = ? WHERE id_usuario = ?";


    try {
        const [resultado] = await db.query(consulta, [
            tipo_documento, numero_documento, nombre, apellido,
            telefono, correo_electronico, firmaNueva, rol,
            passwordEncryptada, estado_usuario, id_usuario
        ]);

        // Verificar si se actualizó algún registro
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado o no se realizaron cambios." });
        }

        res.json({ mensaje: 'Usuario actualizado exitosamente', resultado });
    } catch (error) {
        console.log("Error en la actualización", error);
        res.status(500).send({ mensaje: "Error en la actualización" });
    }
}

//Cambiar estado del usuario
exports.cambiarEstadoUsuario = async (req, res) => {
    const id_usuario = req.params.idUsuario;
    const { estado_usuario } = req.body;
    if (!id_usuario) {
        return res.status(400).send({ mensaje: "Id_usuario es requerido" });
    }

    try {
        const [resultado] = await db.query('SELECT estado_usuario FROM usuario WHERE id_usuario = ?', [id_usuario]);
        //Obtener el estado del usuario
        const estado_usuarioConsulta = resultado[0]?.estado_usuario;
        if (estado_usuarioConsulta === 0 && estado_usuario === 0) {
            return res.status(400).send({ mensaje: "El usuario ya está inactivo" });
        }

        const [resultadoActualizacion] = await db.query('UPDATE usuario SET estado_usuario = ? WHERE id_usuario = ?', [estado_usuario, id_usuario]);
        res.json({ mensaje: 'Estado del usuario cambiado exitosamente', resultadoActualizacion });
    } catch (error) {
        console.log("Error en la eliminación", error);
        res.status(500).send({ mensaje: "Error en la eliminación" });
    }
}

