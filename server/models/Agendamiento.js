import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Agendamiento extends Model {
  /**
   *  Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 ->  Un Agendamiento pertenece a una única FichaAprendiz.
    this.belongsTo(models.FichaAprendiz, {
      foreignKey: 'idFichaAprendiz',
    });
    // Relación N:1 -> Un Agendamiento pertenece a unicó Usuario (Instructor).
    this.belongsTo(models.Usuario, {
      foreignKey: 'idInstructor',
      targetKey: 'idUsuario',
    });
  }
}

Agendamiento.init(
  {
    idAgendamiento: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_agendamiento',
    },
    herramientaReunion: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      field: 'herramienta_reunion',
    },
    enlaceReunion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true,
      },
      field: 'enlace_reunion',
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toString(), // Fecha debe ser futura
        customValidator(value) {
          if (value >= this.getDataValue('fechaFin')) {
            throw new Error(
              'La fecha de inicio debe ser anterior a la fecha de fin'
            );
          }
        },
      },
      field: 'fecha_inicio',
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        customValidator(value) {
          if (value <= this.getDataValue('fechaInicio')) {
            throw new Error(
              'La fecha de fin debe ser posterior a la fecha de inicio'
            );
          }
        },
      },
      field: 'fecha_fin',
    },
    estadoVisita: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: [
          ['Programada', 'Realizada', 'Cancelada', 'Reprogramada', 'Pendiente'],
        ],
      },
      field: 'estado_visita',
    },
    tipoVisita: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isIn: [['Presencial', 'Virtual', 'Telefonica']],
      },
      field: 'tipo_visita',
    },
    numeroVisita: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 3, // Asumiendo máximo 3 visitas
      },
      field: 'numero_visita',
    },
    idFichaAprendiz: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_ficha_aprendiz',
    },
    idInstructor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_instructor',
    },
  },
  {
    sequelize,
    modelName: 'Agendamiento',
    tableName: 'agendamiento',
    timestamps: false,
    paranoid: false,
  }
);

export default Agendamiento;
