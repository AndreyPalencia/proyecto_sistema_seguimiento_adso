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
      unique: {
        msg: 'El NIT ya está registrado.',
      },
      validate: {
        notEmpty: {
          msg: 'El NIT no puede estar vacío.',
        },
        is: {
          args: /^[0-9]{9,15}-[A-Za-z0-9]$/,
          msg: 'El NIT no tiene el formato válido (Ej: 123456789-X).',
        },
      },
    },
    razonSocial: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La razón social no puede estar vacía.',
        },
        len: {
          args: [3, 25],
          msg: 'La razón social debe tener entre 3 y 25 caracteres.',
        },
      },
      field: 'razon_social',
    },
    telefono: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        isNumeric: {
          msg: 'El teléfono solo debe contener números.',
        },
        min: {
          args: [1000000],
          msg: 'El teléfono debe tener al menos 7 dígitos.',
        },
        max: {
          args: [9999999999],
          msg: 'El teléfono no puede tener más de 10 dígitos.',
        },
      },
    },
    correoElectronico: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El correo electrónico no puede estar vacío.',
        },
        isEmail: {
          msg: 'El correo electrónico no tiene un formato válido.',
        },
      },
      field: 'correo_electronico',
    },
    direccion: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La dirección no puede estar vacía.',
        },
        len: {
          args: [5, 150],
          msg: 'La dirección debe tener entre 5 y 150 caracteres.',
        },
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

