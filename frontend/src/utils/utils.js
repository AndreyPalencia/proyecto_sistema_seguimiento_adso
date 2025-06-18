import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const COLOMBIA_TIMEZONE = 'America/Bogota';

//interpretarComoFechaColombiana
export const convertirEnFechaColombiana = (fecha) => {
  if (!fecha) return '';

  const fechaParseada = dayjs(fecha);
  // Check if the date is valid, if not, return the original input
  if (!fechaParseada.isValid()) {
    return fecha;
  }

  // Format and return as is, assuming input is Colombia time already
  return fechaParseada.format('YYYY-MM-DD hh:mm:ss A'); // 12-hour with AM/PM
};

export const formatoDocumento = {
  CartaLaboral: 'Carta Laboral',
  CertificadoTyT: 'Certificado TyT',
  CertificadoRegistroAPE: 'Certificado de Registro APE',
  DocumentoIdentidad: 'Documento de Identidad',
  CarnetSENADestruido: 'Carnet del SENA Destruido',
};

export const tipoDocumentoOptions = [
  { label: 'Carta Laboral', value: 'CartaLaboral' },
  { label: 'Certificado TyT', value: 'CertificadoTyT' },
  { label: 'Certificado de Registro APE', value: 'CertificadoRegistroAPE' },
  { label: 'Documento de Identidad', value: 'DocumentoIdentidad' },
  { label: 'Carnet SENA Destruido', value: 'CarnetSENADestruido' },
];

/**
 * Obtiene el valor correspondiente a una etiqueta en tipoDocumentoOptions
 * @param {string} label - La etiqueta a buscar
 * @returns {string} - El valor correspondiente o cadena vacía si no se encuentra
 */
export function getValueFromLabel(label) {
  //console.log(label, '+++++++++++++----------');
  // Si label no es una cadena o está vacía, retornar cadena vacía
  if (!label || typeof label !== 'string') {
    console.warn('getValueFromLabel recibió un valor no válido:', label);
    return { label, mensaje: 'Nada' };
  }

  // Buscar en las opciones
  const found = tipoDocumentoOptions.find(
    (option) => option.label === label || option.value === label
  );

  if (found) {
    return found.value;
  } else {
    console.warn(`No se encontró el valor para la etiqueta "${label}"`);
    return '';
  }
}

/**
 * Obtiene la etiqueta correspondiente a un valor en tipoDocumentoOptions
 * @param {string} value - El valor a buscar
 * @returns {string} - La etiqueta correspondiente o cadena vacía si no se encuentra
 */
export function getLabelFromValue(value) {
  // Si value no es una cadena o está vacía, retornar cadena vacía
  if (!value || typeof value !== 'string') {
    console.warn('getLabelFromValue recibió un valor no válido:', value);
    return '';
  }

  // Buscar en las opciones
  const found = tipoDocumentoOptions.find((option) => option.value === value);

  if (found) {
    return found.label;
  } else {
    console.warn(`No se encontró la etiqueta para el valor "${value}"`);
    return '';
  }
}

export const formatErrorsForAlertGFIPF = (errors) => {
  const result = {};

  const traverse = (obj, parentKey = null) => {
    if (!obj || typeof obj !== 'object') return;

    Object.entries(obj).forEach(([key, value]) => {
      if (value?.message) {
        if (parentKey) {
          if (!result[parentKey]) result[parentKey] = new Map();
          result[parentKey].set(key.toUpperCase(), value.message);
        } else {
          if (!result[key.toUpperCase()]) result[key.toUpperCase()] = new Map();
          result[key.toUpperCase()].set(key.toUpperCase(), value.message);
        }
      } else if (Array.isArray(value)) {
        if (parentKey) {
          if (!result[parentKey]) result[parentKey] = new Map();
          result[parentKey].set(key.toUpperCase(), '(array with errors)');
        } else {
          if (!result[key.toUpperCase()]) result[key.toUpperCase()] = new Map();
          result[key.toUpperCase()].set(
            key.toUpperCase(),
            '(array with errors)'
          );
        }
        value.forEach((item) => traverse(item, key.toUpperCase()));
      } else if (typeof value === 'object') {
        traverse(value, key.toUpperCase());
      }
    });
  };

  traverse(errors);

  let message = '';
  for (const [parent, fields] of Object.entries(result)) {
    message += `En ${parent} los campos:\n`;
    for (const [field, msg] of fields.entries()) {
      message += `  - ${field}: ${msg}\n`;
    }
    message += '\n';
  }

  return message.trim();
};

/**
 * Returns today's date as a UTC date string (YYYY-MM-DD),
 * based on the current date in the 'America/Bogota' timezone.
 *
 * This means: get "today" in Bogotá time,
 * then convert to UTC and format as 'YYYY-MM-DD'.
 *
 * Use this when you want to reset or set a date field
 * that stores UTC dates but shows Bogotá local date correctly.
 */
export function getTodayUtcFromBogota() {
  const hoyBogota = dayjs().tz('America/Bogota').format('YYYY-MM-DD');
  return hoyBogota;
}

export function toUtcIsoFromBogota(date) {
  return dayjs(date).tz('America/Bogota').utc().format('YYYY-MM-DDTHH:mm');
}

export function getDatePlusMonthsFromBogota(months) {
  return dayjs().tz('America/Bogota').add(months, 'month').format('YYYY-MM-DD');
}

export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function isNonEmptyObject(obj) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.keys(obj).length > 0
  );
}

/**
 * Compares two objects and returns a new object with only the changed fields.
 *
 * @param {Object} current - The new form values (e.g., from react-hook-form).
 * @param {Object} original - The original object to compare against.
 * @returns {Object} - An object with only the fields that changed.
 */
export function getChangedFields(current, original) {
  const changed = {};

  for (const key in current) {
    const currentValue = current[key];
    const originalValue = original?.[key];

    const isFile = key === 'archivo';

    // Skip undefined files (not selected)
    if (isFile && currentValue === undefined) continue;

    if (currentValue !== originalValue) {
      changed[key] = currentValue;
    }
  }

  return changed;
}
