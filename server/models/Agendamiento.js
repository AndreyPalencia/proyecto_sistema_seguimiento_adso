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
      defaultValue: 'Herramienta predeterminada',
      allowNull: true,
      field: 'herramienta_reunion',
    },
    enlaceReunion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'http://ejemplo.com.co',
      validate: {
        //isUrl: true,
      },
      field: 'enlace_reunion',
    },

    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
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
          [
            'Programada',
            'Realizada',
            'Cancelada',
            'Reprogramada',
            'Pendiente',
            'Solicitud',
          ],
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
    hooks: {
      beforeCreate: (agendamiento, options) => {
        // Validate the 'tipoVisita' field for Virtual visit
        if (
          agendamiento.tipoVisita === 'Virtual' &&
          !agendamiento.enlaceReunion
        ) {
          throw new Error(
            'El tipo de visita Virtual debe tener un enlace de reunión'
          );
        }
        // Validate the 'herramientaReunion' field
        if (
          agendamiento.tipoVisita === 'Virtual' &&
          agendamiento.herramientaReunion.trim() === ''
        ) {
          throw new Error('El campo herramientaReunion es obligatorio');
        }
      },

      // After creating a new Agendamiento, you can send a notification, log, etc.
      // afterCreate: async (agendamiento, options) => {
      //   console.log('Nuevo agendamiento creado:', agendamiento);
      //   // Additional actions like sending notifications can be added here
      // },

      // Before updating, you can add any logic before updating an Agendamiento
      beforeUpdate: (agendamiento, options) => {
        // Validate the 'tipoVisita' field for Virtual visit
        if (
          agendamiento.tipoVisita === 'Virtual' &&
          !agendamiento.enlaceReunion
        ) {
          throw new Error(
            'El tipo de visita Virtual debe tener un enlace de reunión'
          );
        }
        // Validate the 'herramientaReunion' field
        if (
          agendamiento.tipoVisita === 'Virtual' &&
          agendamiento.herramientaReunion.trim() === ''
        ) {
          throw new Error('El campo herramientaReunion es obligatorio');
        }
      },
    },
  }
);

export default Agendamiento;
