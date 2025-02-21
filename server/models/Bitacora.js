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
        min: 1,
      },
      field: 'numero_bitacora',
    },
    observacion: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 1000], // Máximo 1000 caracteres
      },
    },
    bitacora: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: false,
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
        isDate: true,
        isBefore: new Date().toString(), // No puede ser fecha futura
      },
      field: 'fecha_ultima_actualizacion',
    },
    idFichaAprendiz: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
