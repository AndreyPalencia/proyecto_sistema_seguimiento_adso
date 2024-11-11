const db = require('../config/base_datos'); //Importamos la conexion de la base de datos
const bcrypt = require('bcryptjs') //Para encriptar 
const xlsx = require('xlsx'); //Para manipular archivos xlsx 


//encriptar password
const encriptarContrasenia = async (password) => {
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (error) {
        console.log("Error al encriptar la contraseña: ", error);
        return null;
    }
}


//Crear usuarios por excel
exports.crearUsuarioExcel = async(req,res) =>{
    const archivo = req.file;
    if (!archivo) {
        return res.status(400).json({ mensaje: "No se ha subido ningún archivo." });
    }

    try {
        const workbook = xlsx.readFile(`upload/filesExcel/${archivo.filename}`);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        const jsonDataUsuarios = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: '', blankrows: false });
        
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
exports.crearUsuario = async (req,res) =>{
    const { tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password } = req.body;
    const firma = req.file ? req.file.path : null;

    try {
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE numero_documento = ?', [numero_documento]);

        if (usuarioExistente.length > 0) {
            return res.status(400).json({ mensaje: "El correo electrónico ya está registrado" });
        }

        const hash = await bcrypt.hash(password, 10);
        const consulta = 'INSERT INTO usuario (tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, firma, rol, password, estado_usuario) VALUES (?,?,?,?,?,?,?,?,?,1)';
        const datos = [tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, firma, rol, hash];
        
        const [resultado] = await db.query(consulta, datos);

        res.status(201).send({ mensaje: "Usuario creado exitosamente", resultado });
    } catch (error) {
        console.log("Error en la creación de los datos", error);
        res.status(500).send({ mensaje: "Error en la creación de usuario" });
    }
}

//Visualizar usuarios
exports.obtenerUsuario = async(req,res) =>{
    const { numero_documento, nombre, apellido, correo_electronico } = req.query;
    let consulta = 'SELECT * FROM usuario WHERE 1=1';
    const parametros = [];

    if (numero_documento) {
        consulta += ' AND numero_documento LIKE ?';
        parametros.push(`${numero_documento}%`);
    }
    if (nombre) {
        consulta += ' AND nombre LIKE ?';
        parametros.push(`%${nombre}%`);
    }
    if (apellido) {
        consulta += ' AND apellido LIKE ?';
        parametros.push(`%${apellido}%`);
    }
    if (correo_electronico) {
        consulta += ' AND correo_electronico LIKE ?';
        parametros.push(`%${correo_electronico}%`);
    }
    consulta += 'AND estado_usuario = 1';

    try {
        const [resultado] = await db.query(consulta, parametros);
        res.json(resultado);
    } catch (error) {
        console.log("Error en la consulta", error);
        res.status(500).send({ mensaje: "Error en la consulta" });
    }
}

//Visualizar un usuario por id
exports.obtenerUsuarioPorId = async (req, res) => {
    const { id_usuario } = req.query;
    const { numero_documento, nombre, apellido, correo_electronico } = req.query;

    let consulta = 'SELECT * FROM usuario WHERE 1=1';
    const parametros = [];

    if (numero_documento) {
        consulta += ' AND numero_documento LIKE ?';
        parametros.push(`%${numero_documento}%`);
    }
    if (nombre) {
        consulta += ' AND nombre LIKE ?';
        parametros.push(`%${nombre}%`);
    }
    if (apellido) {
        consulta += ' AND apellido LIKE ?';
        parametros.push(`%${apellido}%`);
    }
    if (correo_electronico) {
        consulta += ' AND correo_electronico LIKE ?';
        parametros.push(`%${correo_electronico}%`);
    }

    consulta += ' AND id_usuario = ?';
    parametros.push(id_usuario);

    try {
        const [resultado] = await db.query(consulta, parametros);

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
exports.modificarUsuario = async(req,res) =>{
    const { id_usuario, tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password, estado_usuario } = req.body;

    // Validación de id_usuario 
    if (!id_usuario) {
        return res.status(400).json({ message: 'El id_usuario es requerido' });
    }

    const firma = req.file ? req.file.path : null;

    let query = 'UPDATE usuario SET ';
    const parametros = [];

    // Condicionales para agregar los campos a la query
    if (tipo_documento) {
        query += 'tipo_documento = ?, ';
        parametros.push(tipo_documento);
    }
    if (numero_documento) {
        query += 'numero_documento = ?, ';
        parametros.push(numero_documento);
    }
    if (nombre) {
        query += 'nombre = ?, ';
        parametros.push(nombre);
    }
    if (apellido) {
        query += 'apellido = ?, ';
        parametros.push(apellido);
    }
    if (telefono) {
        query += 'telefono = ?, ';
        parametros.push(telefono);
    }
    if (correo_electronico) {
        query += 'correo_electronico = ?, ';
        parametros.push(correo_electronico);
    }
    if (firma) {
        query += 'firma = ?, ';
        parametros.push(firma);
    }
    if (rol) {
        query += 'rol = ?, ';
        parametros.push(rol);
    }
    if (password) {
        query += 'password = ?, '; 
        const hash = await bcrypt.hash(password, 10);
        parametros.push(hash);
    }
    if (estado_usuario) {
        if (estado_usuario === 'inactivo' || estado_usuario === 'activo') {
            const estadoUsuarioBool = estado_usuario === 'inactivo' ? false : true;
            query += 'estado_usuario = ?, ';
            parametros.push(estadoUsuarioBool);}
    }

    // Remover la última coma y espacio extra antes del WHERE
    query = query.slice(0, -2);

    

    // Agregar el WHERE
    query += ' WHERE id_usuario = ?';
    parametros.push(id_usuario);

    try {
        const [resultado] = await db.query(query, parametros);

        res.json({ mensaje: 'Usuario actualizado exitosamente', resultado });
    } catch (error) {
        console.log("Error en la actualización", error);
        res.status(500).send({ mensaje: "Error en la actualización" });
    }
}


//Eliminar usuarios
exports.eliminarUsuario = async(req,res) =>{
    const { id_usuario } = req.body;
    if (!id_usuario) {
        return res.status(400).send({ mensaje: "id_usuario es requerido" });
    }

    try {
        const [resultado] = await db.query('SELECT estado_usuario FROM usuario WHERE id_usuario = ?', [id_usuario]);

        const estadoUsuario = resultado[0]?.estado_usuario;
        if (estadoUsuario === 0) {
            return res.status(400).send({ mensaje: "El usuario ya está inactivo" });
        }

        const [resultadoActualizacion] = await db.query('UPDATE usuario SET estado_usuario = 0 WHERE id_usuario = ?', [id_usuario]);


        res.json({ mensaje: 'Usuario eliminado exitosamente', resultadoActualizacion });
    } catch (error) {
        console.log("Error en la eliminación", error);
        res.status(500).send({ mensaje: "Error en la eliminación" });
    }
}

