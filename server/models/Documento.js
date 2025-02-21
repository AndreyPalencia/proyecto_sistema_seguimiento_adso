import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/base_datos.js';

class Documento extends Model {
  /**
   *  Método para definir las asociaciones entre modelos.
   */
  static associate(models) {
    // Relación N:1 -> Un Documento pertenece a una única FichaAprendiz.
    this.belongsTo(models.FichaAprendiz, {
      foreignKey: 'idFichaAprendiz',
    });
  }
}

Documento.init(
  {
    idDocumento: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_documento',
    },
    tipoDocumento: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [
          [
            'CartaLaboral',
            'CertificadoTyT',
            'CertificadoRegistroAPE',
            'DocumentoIdentidad',
            'CarnetSENADestruido',
          ],
        ],
      },
      field: 'tipo_documento',
    },
    nombreDocumento: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
      field: 'nombre_documento',
    },
    estadoDocumento: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'estado_documento',
    },
    observacion: {
      type: DataTypes.STRING(500),
      validate: {
        len: [0, 500],
      },
    },
    fechaUltimaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isBefore: new Date().toString(),
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
    modelName: 'Documento',
    tableName: 'documento',
    timestamps: false,
    paranoid: false,
  }
);

export default Documento;
