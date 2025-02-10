const db = require("../config/base_datos"); //Importamos la conexion de la base de datos

exports.crearBitacora = async (req, res) => {
  const { numero_bitacora, observacion, id_ficha_aprendiz } = req.body;
  const bitacora = req.file ? req.file.filename : null;

  const fecha_actualizacion = new Date();

  const camposRequeridos = [
    numero_bitacora,
    observacion,
    fecha_actualizacion,
    bitacora,
  ];

  for (const campo of camposRequeridos) {
    if (!campo) {
      return res
        .status(400)
        .json({
          message: "Todos los campos son requeridos y no deben estar vacíos",
        });
    }
  }

  try {
    const consulta =
      "INSERT INTO bitacora (numero_bitacora, observacion, fecha_ultima_actualizacion, bitacora,id_ficha_aprendiz, estado_bitacora) VALUES (?,?,?,?,?,0)";
    const datos = [
      numero_bitacora,
      observacion,
      fecha_actualizacion,
      bitacora,
      id_ficha_aprendiz,
    ];
    const [resultado] = await db.query(consulta, datos);

    res
      .status(201)
      .json({ mensaje: "Bitacora creada exitosamente", resultado });
  } catch (error) {
    console.log("Error en la creación de los datos", error);
    res.status(500).send({ mensaje: "Error en la creación de la bitacora" });
  }
};

exports.listarBitacoras = async (req, res) => {
  const id_ficha_Aprendiz = req.params.idFichaAprendiz;

//   if (!id_aprendiz) {
//     return res
//       .status(400)
//       .json({ message: "El campo numero_documento es requerido." });
//   }

  try {
    const [resultado] = await db.query(
      "SELECT * FROM bitacora WHERE id_ficha_aprendiz = ?",
      [id_ficha_Aprendiz]
    );

    if (resultado.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron registros para el número de documento proporcionado.",
        });
    }

    res
      .status(200)
      .json({ mensaje: "Bitacora visualizada exitosamente", resultado });
  } catch (error) {
    console.log("Error en la visualización de los datos", error);
    res
      .status(500)
      .send({ mensaje: "Error en la visualización de la bitacora" });
  }
};

exports.visualizarBitacora = async (req, res) => {
  const id_bitacora = req.params.idBitacora;

  if (!id_bitacora) {
    return res.status(400).json({ message: "El id_bitacora es requerido" });
  }

  try {
    const [resultado] = await db.query(
      "SELECT * FROM bitacora WHERE id_bitacora = ?",
      [id_bitacora]
    );

    if (resultado.length === 0) {
      return res
        .status(404)
        .json({
          message:
            "No se encontraron registros para el número de bitacora proporcionado.",
        });
    }

    res
      .status(200)
      .json({ mensaje: "Bitacora visualizada exitosamente", resultado });
  } catch (error) {
    console.log("Error en la visualización de los datos", error);
    res
      .status(500)
      .send({ mensaje: "Error en la visualización de la bitacora" });
  }
};

exports.actualizarBitacora = async (req, res) => {

  const id_bitacora = req.params.idBitacora;

  const { numero_bitacora, observacion, estado_bitacora } = req.body;
  const bitacoraNueva = req.file ? req.file.filename : null;

  if (!id_bitacora) {
    return res.status(400).json({ message: "El id_bitacora es requerido." });
  }

  const fecha_actualizacion = new Date();

  try {
    const consulta = `
            UPDATE bitacora SET numero_bitacora = ?, 
                observacion = ?, 
                estado_bitacora = ?, 
                fecha_ultima_actualizacion = ?, 
                bitacora = ?
            WHERE id_bitacora = ?
        `;
    const datos = [
      numero_bitacora,
      observacion,
      estado_bitacora,
      fecha_actualizacion,
      bitacoraNueva,
      id_bitacora,
    ];

    const [resultado] = await db.query(consulta, datos);

    if (resultado.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró la bitácora para actualizar." });
    }

    res.status(200).json({ message: "Bitácora actualizada exitosamente." });
  } catch (error) {
    console.error("Error en la actualización de los datos", error);
    res
      .status(500)
      .send({ message: "Error en la actualización de la bitácora." });
  }
};

// exports.eliminarBitacora = async (req, res) => {
//   const id_bitacora = req.params.idBitacora;

//   if (!id_bitacora) {
//     return res.status(400).json({ message: "El id_bitacora es requerido." });
//   }

//   try {
//     const [resultado] = await db.query(
//       "DELETE FROM bitacora WHERE id_bitacora = ?",
//       [id_bitacora]
//     );

//     if (resultado.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ message: "No se encontró la bitácora para eliminar." });
//     }

//     res.status(200).json({ message: "Bitácora eliminada exitosamente." });
//   } catch (error) {
//     console.error("Error en la eliminación de los datos", error);
//     res
//       .status(500)
//       .send({ message: "Error en la eliminación de la bitácora." });
//   }
// };