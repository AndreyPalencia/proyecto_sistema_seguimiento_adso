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
    })
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
    },
    idFicha: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_ficha',
    },
    idEmpresa: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_empresa',
    },
    alternativa: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        isIn: [
          [
            'Contrato de Aprendizaje',
            'Pasantía',
            'Proyecto Productivo',
            'Monitoría',
          ],
        ],
      },
    },
    cargoEmpresa: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 40],
      },
      field: 'cargo_empresa',
    },
    jefeInmediato: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'Indefinido',
      validate: {
        len: [2, 45],
      },
      field: 'jefe_inmediato',
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
