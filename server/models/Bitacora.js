import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Bitacora extends Model {
  /**
   *  Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 -> Un Bitacora pertenece a una única FichaAprendiz.
    this.belongsTo(models.FichaAprendiz, {
      foreignKey: 'idFichaAprendiz',
    });
  }
}

Bitacora.init(
  {
    idBitacora: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_bitacora',
    },
    numeroBitacora: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'El número de bitácora debe ser mayor o igual a 1.',
        },
        notNull: {
          msg: 'El número de bitácora es obligatorio.',
        },
      },
      field: 'numero_bitacora',
    },
    observacion: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'La observación no debe superar los 1000 caracteres.',
        },
      },
    },
    bitacora: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La bitácora no puede estar vacía.',
        },
        notNull: {
          msg: 'El nombre del archivo de bitácora es obligatorio.',
        },
      },
    },
    estadoBitacora: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'estado_bitacora',
    },
    fechaUltimaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'La fecha de actualización debe ser una fecha válida.',
        },
        isBefore(value) {
          if (new Date(value) >= new Date()) {
            throw new Error('La fecha de actualización no puede ser futura.');
          }
        },
        notNull: {
          msg: 'La fecha de actualización es obligatoria.',
        },
      },
      field: 'fecha_ultima_actualizacion',
    },
    idFichaAprendiz: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El ID de ficha aprendiz es obligatorio.',
        },
        isInt: {
          msg: 'El ID de ficha aprendiz debe ser un número entero.',
        },
      },
      field: 'id_ficha_aprendiz',
    },
  },
  {
    sequelize,
    modelName: 'Bitacora',
    tableName: 'bitacora',
    timestamps: false,
    paranoid: false,
  }
);


export default Bitacora;
