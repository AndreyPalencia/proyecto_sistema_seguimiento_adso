import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Usuario extends Model {
  static associate(models) {
    //Definir
  }
}

Usuario.init(
  {
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_usuario',
    },
    tipoDocumento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: {
          args: [['CC', 'CE', 'TI', 'PEP', 'PPT']],
          msg: 'TIpo de documento invalido.',
        },
      },
      field: 'tipo_documento',
    },
    numeroDocumento: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      allowNull: false,
      validate: {
        isInt: true,
      },
      field: 'numero_documento',
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
    correoElectronico: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      field: 'correo_electronico',
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
    estadoUsuario: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'estado_usuario',
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
