import Usuario from './Usuario.js';
import Ficha from './Ficha.js';
import Empresa from './Empresa.js';
import FichaAprendiz from './FichaAprendiz.js';
import Agendamiento from './Agendamiento.js';
import Bitacora from './Bitacora.js';
import Documento from './Documento.js';
import ReporteGFPIF from './ReporteGFPIF.js';
import Notificacion from './Notificacion.js';
import Observacion from './Observacion.js';

/**
 * Configuración de asociaciones en Sequelize.
 * Cada modelo define un método `associate(models)`, que es llamado aquí.
 *
 * 📌 Convención de relaciones:
 * - `belongsTo`: Relación 1:1 o N:1 (modelo que tiene una clave foránea que referencia a una intancia de otro modelo).
 * - `hasMany: Relación 1:N (una instancia de este modelo está asociada con varias instancias del otro modelo).
 */

const models = {
  Usuario,
  Ficha,
  Empresa,
  FichaAprendiz,
  Agendamiento,
  Bitacora,
  Documento,
  ReporteGFPIF,
  Notificacion,
  Observacion,
};

// Si un modelo tiene una función 'associate', la ejecutamos para establecer relaciones
Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

export default { ...models };
