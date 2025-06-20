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
      unique: {
        msg: 'El número de ficha debe ser único.',
      },
      allowNull: false,
      field: 'numero_ficha',
      validate: {
        isNumeric: {
          msg: 'El número de ficha debe contener solo números.',
        },
        len: {
          args: [7, 10],
          msg: 'El número de ficha debe tener entre 7 y 10 dígitos.',
        },
      },
    },
    nombrePrograma: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nombre_programa',
      validate: {
        notEmpty: {
          msg: 'El nombre del programa no puede estar vacío.',
        },
        len: {
          args: [5, 50],
          msg: 'El nombre del programa debe tener entre 5 y 50 caracteres.',
        },
      },
    },
    terminoPrograma: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'termino_programa',
      validate: {
        isIn: {
          args: [
            ['Tecnólogo', 'Técnico', 'Auxiliar', 'Operario', 'Especialización'],
          ],
          msg: 'El término del programa debe ser uno de: Tecnólogo, Técnico, Auxiliar, Operario o Especialización.',
        },
      },
    },
    estadoFicha: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'estado_ficha',
    },
    inicioEtapaProductiva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'inicio_etapa_productiva',
      validate: {
        isDate: {
          msg: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD).',
        },
      },
    },
    finEtapaProductiva: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'fin_etapa_productiva',
      validate: {
        isDate: {
          msg: 'La fecha de fin debe tener un formato válido (YYYY-MM-DD).',
        },
      },
    },
    idInstructor: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'id_instructor',
    },
    fechaNotificacionEnvio: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment:
        'Fecha en la que se notificó al aprendiz que los archivos fueron enviados a administración',
      field: 'fecha_notificacion_envio',
    },
  },
  {
    sequelize,
    modelName: 'Ficha',
    tableName: 'ficha',
    timestamps: false,
    paranoid: false,
    hooks: {
      beforeSave: async (ficha, options) => {
        //console.log('📌 Entró al hook beforeSave');

        const existingFicha = await Ficha.findOne({
          where: {
            numeroFicha: ficha.numeroFicha,
            idFicha: { [sequelize.Sequelize.Op.ne]: ficha.idFicha },
          },
        });

        if (existingFicha) {
          //console.log('⚠️ Número de ficha duplicado detectado');
          throw new Error('Ya existe una ficha con este número.');
        }

        const inicio = ficha.getDataValue('inicioEtapaProductiva');
        const fin = ficha.getDataValue('finEtapaProductiva');

        //console.log('📅 Fecha inicio:', inicio);
        //console.log('📅 Fecha fin:', fin);

        if (inicio && fin) {
          const dInicio = new Date(inicio);
          const dFin = new Date(fin);

          //console.log('🧮 Comparando fechas...');
          if (dInicio.getTime() >= dFin.getTime()) {
            //console.log('❌ Fecha inválida: inicio >= fin');
            throw new Error(
              'La fecha de inicio debe ser anterior a la fecha de fin.'
            );
          } else {
            //console.log('✅ Fecha válida: inicio < fin');
          }
        }
      },
    },
  }
);

// (optional) If you also want to validate on update
export default Ficha;
