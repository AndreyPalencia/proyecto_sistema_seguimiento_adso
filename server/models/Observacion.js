import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Observacion extends Model {
  /**
   * Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 -> Una Observacion pertence a una única FichaAprendiz.
    this.belongsTo(models.FichaAprendiz, {
      foreignKey: 'idFichaAprendiz',
    });
  }
}

Observacion.init(
  {
    idObservacion: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_observacion',
    },
    observacion: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    mostrarObservacion: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'mostrar_observacion',
    },
    fechaUltimaActualizacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        customValidator(value) {
          const today = new Date().toISOString().split('T')[0];
          if (value > today) {
            throw new Error('La fecha de ultima actualización no puede ser futura.');
          }
        },
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
    modelName: 'Observacion',
    tableName: 'observacion',
    timestamps: false,
    paranoid: false,
  }
);

export default Observacion;
