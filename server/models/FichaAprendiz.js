import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class FichaAprendiz extends Model {
  /**
   *  Método para definir las asociaciones entre modelos
   */
  static associate(models) {
    // Relación N:1 -> Una FichaAprendiz pertenece a un Usuario (Aprendiz).
    this.belongsTo(models.Usuario, {
      foreignKey: 'idUsuario',
    });
    // Relación N:1 -> Una FichaAprendiz pertenece a una Ficha.
    this.belongsTo(models.Ficha, {
      foreignKey: 'idFicha',
    });
    // Relación N:1 -> Un FichaAprendiz pertence a una empresa.
    this.belongsTo(models.Empresa, {
      foreignKey: 'idEmpresa',
    });
    //  Relación 1:N -> Una FichaAprendiz puede tener varios agendamientos.
    this.hasMany(models.Agendamiento, {
      foreignKey: 'idFichaAprendiz',
    });
    // Relación 1:N -> Una FichaAprendiz puede tener varias Bitacoras.
    this.hasMany(models.Bitacora, {
      foreignKey: 'idFichaAprendiz',
    });
    // Relación 1:N -> Una FichaAprendiz puede tener varios Reportes.
    this.hasMany(models.ReporteGFPIF, {
      foreignKey: 'idFichaAprendiz',
    });
    // Relación 1:N -> Una FichaAprendiz puede tener varios Documentos.
    this.hasMany(models.Documento, {
      foreignKey: 'idFichaAprendiz',
    });
    // Relación 1:N -> Una FichaAprendiz puede tener varias Observaciones.
    this.hasMany(models.Observacion, {
      foreignKey: 'idFichaAprendiz',
    });
  }
}

FichaAprendiz.init(
  {
    idFichaAprendiz: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_ficha_aprendiz',
    },
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_usuario',
      validate: {
        notEmpty: {
          msg: 'El campo "idUsuario" es obligatorio.',
        },
        isInt: {
          msg: 'El campo "idUsuario" debe ser un número entero.',
        },
      },
    },
    idFicha: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_ficha',
      validate: {
        notEmpty: {
          msg: 'El campo "idFicha" es obligatorio.',
        },
        isInt: {
          msg: 'El campo "idFicha" debe ser un número entero.',
        },
      },
    },
    idEmpresa: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_empresa',
      validate: {
        notEmpty: {
          msg: 'El campo "idEmpresa" es obligatorio.',
        },
        isInt: {
          msg: 'El campo "idEmpresa" debe ser un número entero.',
        },
      },
    },
    alternativa: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Debe seleccionar una alternativa.',
        },
        isIn: {
          args: [
            [
              'Contrato de Aprendizaje',
              'Pasantía',
              'Proyecto Productivo',
              'Monitoría',
            ],
          ],
          msg: 'La alternativa debe ser una de las siguientes: Contrato de Aprendizaje, Pasantía, Proyecto Productivo o Monitoría.',
        },
      },
    },
    cargoEmpresa: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El cargo en la empresa no puede estar vacío.',
        },
        len: {
          args: [2, 40],
          msg: 'El cargo en la empresa debe tener entre 2 y 40 caracteres.',
        },
      },
      field: 'cargo_empresa',
    },
    jefeInmediato: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Indefinido',
      validate: {
        notEmpty: {
          msg: 'El jefe inmediato no puede estar vacío.',
        },
        len: {
          args: [2, 45],
          msg: 'El nombre del jefe inmediato debe tener entre 2 y 45 caracteres.',
        },
      },
      field: 'jefe_inmediato',
    },
    telefonoJefe: {
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
      field: 'telefono_jefe',
    },
    correoElectronicoJefe: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'El correo electrónico no tiene un formato válido.',
        },
      },
      field: 'correo_electronico_jefe',
    },
    cargoJefe: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El cargo en la empresa no puede estar vacío.',
        },
        len: {
          args: [2, 40],
          msg: 'El cargo en la empresa debe tener entre 2 y 40 caracteres.',
        },
      },
      field: 'cargo_jefe',
    },
  },
  {
    sequelize,
    modelName: 'FichaAprendiz',
    tableName: 'ficha_aprendiz',
    timestamps: false,
    paranoid: false,
  }
);

export default FichaAprendiz;
