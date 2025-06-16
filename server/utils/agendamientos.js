/**
 * Transforma un objeto de agendamiento proveniente de Sequelize a un objeto plano,
 * extrayendo el `idFicha` desde la relación anidada `FichaAprendiz.Ficha` y
 * eliminando la propiedad `FichaAprendiz` para limpiar la respuesta.
 *
 * Esta función es útil para estructurar la respuesta del backend cuando no se desea
 * exponer toda la información relacionada con la ficha del aprendiz, pero se requiere
 * el `idFicha` de forma directa.
 *
 * @param {Object} agendamiento - Instancia del modelo Agendamiento obtenida mediante Sequelize.
 * @returns {Object} Objeto plano con la estructura transformada, incluyendo `idFicha` y sin `FichaAprendiz`.
 *
 * @example
 * // Supongamos que `agendamiento` es una instancia de Sequelize
 * const resultado = transformarAgendamiento(agendamiento);
 * console.log(resultado);
 * // {
 * //   idAgendamiento: 1,
 * //   fecha_inicio: "2025-04-09",
 * //   idFicha: 45,
 * //   ...
 * // }
 */
export const transformarAgendamiento = (agendamiento) => {
  // Si es instancia Sequelize, conviértelo, si ya es objeto plano, úsalo tal cual
  const plain =
    typeof agendamiento.toJSON === 'function'
      ? agendamiento.toJSON()
      : agendamiento;

  if (plain.FichaAprendiz && plain.FichaAprendiz.Ficha) {
    plain.idFicha = plain.FichaAprendiz.Ficha.idFicha;
  }

  delete plain.FichaAprendiz;
  delete plain.Usuario;

  return plain;
};

