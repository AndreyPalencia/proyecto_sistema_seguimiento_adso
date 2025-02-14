import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Usuario extends Model {
  static associate(models) {
    //Definir
  }
}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo_documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CC', 'CE', 'TI', 'PEP', 'PPT']],
          msg: 'TIpo de documento invalido.',
        },
      },
    },
    numero_documento: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    nombre: {
      type: DataTypes.STRING(125),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 125],
      },
    },
    apellido: {
      type: DataTypes.STRING(125),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 125],
      },
    },
    telefono: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        isInt: true,
        // len: [7, 10], // Teléfono fijo o celular Colombia
      },
    },
    correo_electronico: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    firma: {
      type: DataTypes.STRING(255),
      defaultValue: 'No foto',
      allowNull: true,
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [['admin', 'instructor', 'aprendiz']],
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    estado_usuario: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario',
    timestamps: false,
    paranoid: false,
  }
);

export default Usuario;
