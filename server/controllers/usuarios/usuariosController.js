const { Usuario } = require("../../models");
const { Op, where } = require("sequelize");
const db = require("../../config/base_datos");
const bcryptjs = require("bcryptjs");
const xlsx = require("xlsx");




//Crear usuarios por un archivo --> SI HAY QUE DEJARLO CON USO DE SQL
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
    const jsonDataUsuarios = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    //Creacion de todos los usuarios registrados en archivo
    const usuarios = await Promise.all(
      jsonDataUsuarios.slice(1).map(async (fila) => {
        const [
          tipo,
          documento,
          nombre,
          apellido,
          telefono,
          correoElectronico,
          rol,
          contrasena,
        ] = fila;
        const contrasenaEncriptada = await encriptarContrasenia(
          contrasena.toString()
        );
        return [
          tipo,
          documento,
          nombre,
          apellido,
          telefono,
          correoElectronico,
          rol,
          contrasenaEncriptada,
          1,
        ];
      })
    );

    const consulta =
      "INSERT INTO usuario (tipo_documento, numero_documento, nombre, apellido, telefono, correo_electronico, rol, password, estado_usuario) VALUES ?";

    const [resultado] = await db.query(consulta, [usuarios]);
    await conexion.end();

    res.status(201).send({ mensaje: "Usuario creado exitosamente", resultado });
  } catch (error) {
    console.log("Error en la creación de los datos", error);
    res.status(500).send({ mensaje: "Error en la creación de usuario" });
  }
};



//Encriptacion de contraseña
const encriptarContrasenia = async (password) => {
  try {
    const hash = await bcryptjs.hash(password, 10);
    return hash;
  } catch (error) {
    console.log("Error al encriptar la contraseña: ", error);
    return null;
  }
};

// Función para validar que no exista un duplicado antes de insertar o actualizar
const validarCamposDuplicados = async (
  correo,
  numeroDocumento,
  usuarioId = null
) => {
  // Preparamos la consulta para comprobar duplicados de correo o número de documento
  let consulta =
    "SELECT * FROM usuario WHERE (correo_electronico = ? OR numero_documento = ?)";
  let params = [correo, numeroDocumento];

  // Si es una actualización, excluimos el usuario actual
  if (usuarioId) {
    consulta += " AND id_usuario != ?";
    params.push(usuarioId);
  }

  // Ejecutamos la consulta
  const [usuariosExistentes] = await db.query(consulta, params);

  // Si se encuentran usuarios duplicados, retornamos un mensaje de error
  if (usuariosExistentes.length > 0) {
    const duplicadoCorreo = usuariosExistentes.find(
      (u) => u.correo_electronico === correo
    );
    const duplicadoDocumento = usuariosExistentes.find(
      (u) => u.numero_documento == numeroDocumento
    );

    if (duplicadoCorreo && duplicadoDocumento) {
      return {
        error: true,
        mensaje:
          "El correo electrónico y el número de documento ya están registrados.",
      };
    }

    if (duplicadoCorreo) {
      return {
        error: true,
        mensaje: "El correo electrónico ya está registrado.",
      };
    }

    if (duplicadoDocumento) {
      return {
        error: true,
        mensaje: "El número de documento ya está registrado.",
      };
    }
  }

  // Si no hay duplicados, se puede proceder con la inserción o actualización
  return { error: false };
};




//Crear un usuario
exports.crearUsuario = async (req, res) => {
  try {
    // Encriptar la contraseña antes de crear el usuario
    const passwordEncryptada = await encriptarContrasenia(req.body.password);
    req.body.password = passwordEncryptada;

    // Si se subió un archivo (firma), añadirlo al cuerpo de la solicitud
    if (req.file && req.file.filename) {
      req.body.firma = req.file.filename;
    }

    // Crear el usuario con la contraseña encriptada y la firma (si existe)
    const usuario = await Usuario.create(req.body);

    res.status(201).json({ mensaje: "Usuario creado exitosamente", usuario });
  } catch (error) {
    console.log("Error en la creación de los datos", error);
    res
      .status(500)
      .send({
        mensaje: "Error en la creación de usuario",
        error: error.message,
      });
  }
};


//Visualizar un usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  const id_usuario = req.params.idUsuario;

  try {
    // Consultar el usuario con ambos parámetros
    const usuario = await Usuario.findByPk({
      where: { id_usuario: id_usuario },
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).send({ mensaje: "Usuario no encontrado" });
    }

    // Devolver el usuario encontrado
    res.status(200).json(usuario);
  } catch (error) {
    console.log("Error en la consulta", error);
    res.status(500).send({ mensaje: "Error en la consulta" });
  }
};


// Obtener usuarios -> Agregar clasulas para rol instructro para no buscar en fichas no le corresponda
exports.obtenerUsuarios = async (req, res) => {
  const {
    estado_usuario,
    numero_documento,
    nombre,
    apellido,
    correo_electronico,
  } = req.body;

  try {
    const filtros = {};

    if (estado_usuario) {
      filtros.estado_usuario = estado_usuario;
    }

    if (numero_documento) {
      filtros.numero_documento = numero_documento;
    }

    if (nombre) {
      filtros.nombre = { [Op.like]: `%${nombre}%` };
    }

    if (apellido) {
      filtros.apellido = { [Op.like]: `%${apellido}%` };
    }

    if (correo_electronico) {
      filtros.correo_electronico = correo_electronico;
    }

    // Validar si no se pasaron filtros
    if (Object.keys(filtros).length === 0) {
      return res.status(400).json({
        mensaje: "No se proporcionaron parámetros de búsqueda.",
      });
    }

    const usuarios = await Usuario.findAll({ where: filtros });

    if (usuarios.length === 0) {
      return res.status(404).json({
        mensaje:
          "No se encontraron usuarios que coincidan con los parámetros proporcionados.",
      });
    }

    res
      .status(200)
      .json({ mensaje: "Usuarios encontrados exitosamente.", usuarios });
  } catch (error) {
    console.log("Error en la consulta:", error);
    res
      .status(500)
      .json({ mensaje: "Error en la consulta.", error: error.message });
  }
};

//Modificar un usuario por ID
exports.modificarUsuario = async (req, res) => {
  const id_usuario = req.params.idUsuario;
  const nuevosDatos = req.body;

  // Validación de id_usuario
  if (!id_usuario) {
    return res.status(400).json({ message: "El id_usuario es requerido" });
  }

  try {

    if (nuevosDatos.password){
        const passwordEncryptada = await encriptarContrasenia(nuevosDatos.password);
        nuevosDatos.password = passwordEncryptada;
    }

    // Si se subió un archivo (firma), añadirlo al cuerpo de la solicitud
    if (req.file && req.file.filename) {
      nuevosDatos.firma = req.file.filename;
    }

    const [updateRow] = await Usuario.update(nuevosDatos, {
      where: {
        id_usuario: id_usuario,
      },
    });

    // Verificar si se actualizó algún registro
    if (updateRow === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    // Obentenemos el usuarios actualizado
    const usuarioActualizado = await Usuario.findByPk({
      where: { id_usuario: id_usuario },
    });

    return res.status(200).json({
      mensaje: "Usuario actualizado exitosamente",
      usuarioActualizado,
    });
  } catch (error) {
    console.log("Error en la actualización", error);
    res.status(500).send({ mensaje: "Error en la actualización" });
  }
};



//Cambiar estado del usuario por ID
exports.cambiarEstadoUsuario = async (req, res) => {
  const id_usuario = req.params.idUsuario;
  const { estado_usuario } = req.body;

  //Validacion del Id
  if (!id_usuario) {
    return res.status(400).send({ mensaje: "Id_usuario es requerido" });
  }

  // Validación del estado (opcional, pero útil para evitar valores incorrectos)
  if (estado_usuario === undefined) {
    return res.status(400).send({ mensaje: "estado_usuario es requerido" });
  }

  try {
    const [updateRow] = await Usuario.update(
      { estado_usuario },
      {
        where: {
          id_usuario: id_usuario,
        },
      }
    );

     if (updateRow === 0) {
       return res
         .status(404)
         .json({ mensaje: "Usuario no encontrado o sin cambios." });
     }

    res.status(200).json({
      mensaje: "Estado del usuario cambiado exitosamente",
      resultadoActualizacion,
    });

  } catch (error) {
    console.log("Error en la eliminación", error);
    res.status(500).send({ mensaje: "Error en la eliminación" });
  }
};