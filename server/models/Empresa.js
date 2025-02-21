import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Empresa extends Model {
  /**
   *  Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    //Relación 1:N ->  Una Empresa puede estar asociada a múltiples registros en FichaAprendiz.
    this.hasMany(models.FichaAprendiz, {
      foreignKey: 'idEmpresa',
    });
  }
}

Empresa.init(
  {
    idEmpresa: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_empresa',
    },
    nit: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: {
          args: /^[0-9]{9,15}-[A-Za-z0-9]$/,
          msg: 'El NIT no tiene el formato válido',
        },
      },
    },
    razonSocial: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 25],
      },
      field: 'razon_social',
    },
    telefono: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 1000000, // 7 dígitos mínimo (para teléfono fijo)
        max: 9999999999,
      },
    },
    correoElectronico: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: true,
      },
      field: 'correo_electronico',
    },
    direccion: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 150],
      },
    },
  },
  {
    sequelize,
    modelName: 'Empresa',
    tableName: 'empresa',
    timestamps: false,
    paranoid: false,
  }
);

export default Empresa;
