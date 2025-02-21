import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Ficha extends Model {
  /**
   *  Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 -> Una Ficha pertenece a un usuario (Instructor).
    this.belongsTo(models.Usuario, {
      foreignKey: 'idInstructor',
      targetKey: 'idUsuario',
    });
    // Relación 1:N -> Una Ficha puede estar asociada a múltiples registros en FichaAprendiz
    this.hasMany(models.FichaAprendiz, {
      foreignKey: 'idFicha',
    });
  }
}

Ficha.init(
  {
    idFicha: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_ficha',
    },
    numeroFicha: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
      allowNull: false,
      field: 'numero_ficha',
      validate: {
        isNumeric: true,
        len: [7, 10], // Formato SENA: 7 dígitos minimo
      },
    },
    nombrePrograma: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombre_programa',
      validate: {
        notEmpty: true,
        len: [5, 50],
      },
    },
    terminoPrograma: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'termino_programa',
      validate: {
        isIn: [
          ['Tecnologo', 'Tecnico', 'Auxiliar', 'Operario', 'Especializacion'],
        ],
      },
    },
    estadoFicha: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'estado_ficha',
    },
    inicioEtapaProductiva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'inicio_etapa_productiva',
      validate: {
        isDate: true,
        customValidator(value) {
          if (value >= this.getDataValue('finEtapaProductiva')) {
            throw new Error(
              'La fecha de inicio debe ser anterior a la fecha de fin'
            );
          }
        },
      },
    },
    finEtapaProductiva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fin_etapa_productiva',
      validate: {
        isDate: true,
        customValidator(value) {
          if (value <= this.getDataValue('inicioEtapaProductiva')) {
            throw new Error(
              'La fecha de fin debe ser posterior a la fecha de inicio'
            );
          }
        },
      },
    },
    idInstructor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_instructor',
    },
  },
  {
    sequelize,
    modelName: 'Ficha',
    tableName: 'ficha',
    timestamps: false,
    paranoid: false,
  }
);

export default Ficha;
