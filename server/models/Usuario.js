import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Usuario extends Model {
  /**
   * Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación 1:N -> Un Usuario (Aprendiz) puede estar asociado a múltiples registros en FichaAprendiz.
    this.hasMany(models.FichaAprendiz, {
      foreignKey: 'idUsuario',
    });
    // Relación 1:N -> Un usuario (Instructor) puede estar asociado a varias fichas.
    this.hasMany(models.Ficha, {
      foreignKey: 'idInstructor',
    });
    // Relación 1:N -> Un usuario (Instructor) puede tener multiples agendamientos.
    this.hasMany(models.Agendamiento, {
      foreignKey: 'idInstructor',
    });
    // Relación 1:N -> Un usuario puede recibir multipes notificaciones.
    this.hasMany(models.Notificacion, {
      foreignKey: 'idUsuario',
    });
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
          msg: 'Tipo de documento inválido. Debe ser CC, CE, TI, PEP o PPT.',
        },
      },
      field: 'tipo_documento',
    },
    numeroDocumento: {
      type: DataTypes.BIGINT.UNSIGNED,
      unique: {
        msg: 'Este número de documento ya está registrado.',
      },
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El número de documento debe ser un número entero.',
        },
        min: {
          args: [100000],
          msg: 'El número de documento debe tener al menos 6 dígitos.',
        },
        max: {
          args: [9999999999],
          msg: 'El número de documento no puede tener más de 10 dígitos.',
        },
      },
      field: 'numero_documento',
    },
    nombre: {
      type: DataTypes.STRING(125),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre no puede estar vacío.',
        },
        len: {
          args: [2, 125],
          msg: 'El nombre debe tener entre 2 y 125 caracteres.',
        },
      },
    },
    apellido: {
      type: DataTypes.STRING(125),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El apellido no puede estar vacío.',
        },
        len: {
          args: [2, 125],
          msg: 'El apellido debe tener entre 2 y 125 caracteres.',
        },
      },
    },
    telefono: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        min: {
          args: [1000000],
          msg: 'El número de teléfono debe tener al menos 7 dígitos.',
        },
        max: {
          args: [9999999999],
          msg: 'El número de teléfono excede el límite permitido.',
        },
      },
    },
    correoElectronico: {
      type: DataTypes.STRING(50),
      unique: {
        msg: 'Este correo electrónico ya está registrado.',
      },
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'El correo electrónico no tiene un formato válido.',
        },
      },
      field: 'correo_electronico',
    },
    firma: {
      type: DataTypes.STRING(255),
      //defaultValue: 'No foto',
      allowNull: true,
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: {
          args: [['admin', 'instructor', 'aprendiz']],
          msg: 'El rol debe ser admin, instructor o aprendiz.',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [8, 255],
          msg: 'La contraseña debe tener al menos 8 caracteres.',
        },
      },
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
