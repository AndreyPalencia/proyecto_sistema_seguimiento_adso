import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Notificacion extends Model {
  /**
   * Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 -> Un Notificacion pertence a un unicó Usuario.
    this.belongsTo(models.Usuario, {
      foreignKey: 'idUsuario',
    });
  }
}

Notificacion.init(
  {
    idNotificacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_notificacion',
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Alerta', 'Información', 'Error', 'Éxito', 'Solicitud']],
      },
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    mensaje: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 500],
      },
    },
    fechaCreacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        customValidator(value) {
          const today = new Date().toISOString().split('T')[0];
          if (value > today) {
            throw new Error('La fecha de creacion no puede ser futura.');
          }
        }
      },
      field: 'fecha_creacion',
    },
    estado: {
      type: DataTypes.STRING(45),
      allowNull: true,
      validate: {
        isIn: [['Leida', 'NoLeida', 'Archivada']],
      },
    },
    idUsuario: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_usuario',
    },
  },
  {
    sequelize,
    modelName: 'Notificacion',
    tableName: 'notificacion',
    timestamps: false,
    paranoid: false,
  }
);

export default Notificacion;
