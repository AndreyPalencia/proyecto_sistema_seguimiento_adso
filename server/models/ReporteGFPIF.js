import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class ReporteGFPIF extends Model {
  /**
   * Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 -> Un Reporte pertence a una única FichaAprendiz.
    this.belongsTo(models.FichaAprendiz, {
      foreignKey: 'idFichaAprendiz',
    });
  }
}

ReporteGFPIF.init(
  {
    idReporte: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_reporte',
    },
    nombreReporte: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 60],
      },
      field: 'nombre_reporte',
    },
    fechaUltimaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore(value) {
          if (new Date(value) >= new Date()) {
            throw new Error('La fecha de actualización no puede ser futura.');
          }
        },
      },
      field: 'fecha_ultima_actualizacion',
    },
    tipoReporte: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [7, 30],
      },
      field: 'tipo_reporte',
    },
    idFichaAprendiz: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_ficha_aprendiz',
    },
  },
  {
    sequelize,
    modelName: 'Reporte',
    tableName: 'reporte',
    timestamps: false,
    paranoid: false,
  }
);

export default ReporteGFPIF;
