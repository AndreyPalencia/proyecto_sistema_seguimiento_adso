// Importa la conexión a la base de datos desde el archivo db.js

const conexion = require("../config/base_datos");

// Función para crear un nuevo agendamiento
const agendamientosController = {
  crearAgendamiento: async (req, res) => {
    const {
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      estado_visita,
      tipo_visita,
      numero_visita,
      id_ficha_aprendiz,
      id_instructor,
    } = req.body;

    if (
      !herramienta_reunion ||
      !enlace_reunion ||
      !fecha_inicio ||
      !fecha_fin ||
      !estado_visita ||
      !tipo_visita ||
      !numero_visita ||
      !id_ficha_aprendiz ||
      !id_instructor
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    try {
      const [result] = await conexion.query(
        `INSERT INTO agendamiento (herramienta_reunion, enlace_reunion, fecha_inicio, fecha_fin, estado_visita, tipo_visita, numero_visita, id_ficha_aprendiz, id_instructor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          herramienta_reunion,
          enlace_reunion,
          fecha_inicio,
          fecha_fin,
          estado_visita,
          tipo_visita,
          numero_visita,
          id_ficha_aprendiz,
          id_instructor,
        ]
      );
      res.status(201).json({ message: " Agendamiento creado exitosamente! " });
    } catch (error) {
      console.error("Error al crear el agendamiento:", error);
      res.status(500).json({ message: "Error al crear agendamiento" });
    }
  },

  obtenerAgendamientos: async (req, res) => {
    try {
      const [agendamiento] = await conexion.query("SELECT * FROM agendamiento");

      res.status(200).json(agendamiento);
    } catch (error) {
      console.error("Error al obtener los agendamientos:", error);
      res.status(500).json({ message: "Error al obtener agendamientos" });
    }
  },

  obtenerAgendamientoEspecifico: async (req, res) => {
    const idAgendamiento = req.params.idAgendamiento;

    if (!idAgendamiento) {
      return res
        .status(400)
        .json({ message: "Id de agendamiento es requerido" });
    }

    try {
      const [agendamiento] = await conexion.query(
        "SELECT * FROM agendamiento WHERE id_agendamiento = ?",
        [idAgendamiento]
      );

      if (agendamiento.length === 0) {
        return res.status(404).json({ message: "Agendamiento no encontrado" });
      }

      res.status(200).json(agendamiento[0]);
    } catch (error) {
      console.error("Error al obtener el agendamiento:", error);
      res.status(500).json({ message: "Error al obtener agendamiento" });
    }
  },

  modificarAgendamiento: async (req, res) => {
    const idAgendamiento = req.params.idAgendamiento;
    const {
      herramienta_reunion,
      enlace_reunion,
      fecha_inicio,
      fecha_fin,
      estado_visita,
      tipo_visita,
      numero_visita,
      id_ficha_aprendiz,
      id_instructor,
    } = req.body;

    try {
      const [result] = await conexion.query(
        `UPDATE agendamiento SET herramienta_reunion = ?, enlace_reunion = ?, fecha_inicio = ?, fecha_fin = ?, estado_visita = ?, tipo_visita = ?, numero_visita = ?, id_ficha_aprendiz = ?, id_instructor = ? WHERE id_agendamiento = ?`,
        [
          herramienta_reunion,
          enlace_reunion,
          fecha_inicio,
          fecha_fin,
          estado_visita,
          tipo_visita,
          numero_visita,
          id_ficha_aprendiz,
          id_instructor,
          idAgendamiento,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Agendamiento no encontrado" });
      }

      res.status(200).json({
        message: "Agendamiento modificado exitosamente",
        agendamiento: {
          id_agendamiento: idAgendamiento,
          herramienta_reunion,
          enlace_reunion,
          fecha_inicio,
          fecha_fin,
          estado_visita,
          tipo_visita,
          numero_visita,
          id_ficha_aprendiz,
          id_instructor,
        },
      });
    } catch (error) {
      console.error("Error al modificar el agendamiento:", error);
      res.status(500).json({ message: "Error al modificar agendamiento" });
    }
  },

  eliminarAgendamiento: async (req, res) => {
    const idAgendamiento = req.params.idAgendamiento;

    try {
      const [result] = await conexion.query(
        `DELETE FROM agendamiento WHERE id_agendamiento = ?`,
        [idAgendamiento]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Agendamiento no encontrado" });
      }

      res.status(200).json({ message: "Agendamiento eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar el agendamiento:", error);
      res.status(500).json({ message: "Error al eliminar agendamiento" });
    }
  },

  actualizarEstadoVisita: async (req, res) => {
    const idAgendamiento = req.params.idAgendamiento;
    const { estado_visita } = req.body;

    if (!estado_visita) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar el nuevo estado de la visita" });
    }

    try {
      const [result] = await conexion.query(
        `UPDATE agendamiento SET estado_visita = ? WHERE id_agendamiento = ?`,
        [estado_visita, idAgendamiento]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Agendamiento no encontrado" });
      }

      res.status(200).json({
        message: "Estado de la visita actualizado exitosamente",
        estado_visita,
      });
    } catch (error) {
      console.error("Error al actualizar el estado de la visita:", error);
      res
        .status(500)
        .json({ message: "Error al actualizar el estado de la visita" });
    }
  },
};

module.exports = agendamientosController;
