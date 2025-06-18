import { BoxFilter, ButtonFilter } from './GeneralFilterButtons.style';
import React, { useState, useEffect } from 'react';

/**
 * `GeneralFilterButtons`
 *
 * Renderiza un conjunto de botones de filtro generales.
 * Permite seleccionar uno de ellos y notifica al componente padre mediante `handleChangeFilter`.
 *
 * @param {Object} props
 * @param {Object.<string, string>} props.filterButtons - Objeto clave-valor con las opciones de filtro. La clave se muestra en el botón y el valor se usa como `name`.
 * @param {Function} props.handleChangeFilter - Función manejadora que se ejecuta al hacer clic en un botón.
 * @param {string} props.defaultValuefilterSearch - Valor por defecto que debe seleccionarse inicialmente.
 *
 * @example
 * const filters = { Activo: 'active', Inactivo: 'inactive' };
 * <GeneralFilterButtons
 *   filterButtons={filters}
 *   handleChangeFilter={(e) => console.log(e.target.name)}
 *   defaultValuefilterSearch="active"
 * />
 */
const GeneralFilterButtons = ({
  filterButtons,
  handleChangeFilter,
  defaultValuefilterSearch,
}) => {
  //Estado local para almacenar el botón actualmente seleccionado
  const [selectedButton, setSelectedButton] = useState(null);

  /**
   * Manejador para cuando se hace clic en un botón.
   * Actualiza el botón seleccionado y ejecuta la función de filtro.
   *
   * @param {React.MouseEvent} event - Evento de clic del botón.
   * @param {string} optionKey - Clave de la opción seleccionada.
   */
  const handleButtonClick = (event, optionKey) => {
    setSelectedButton(optionKey);
    handleChangeFilter(event); // Se espera que el padre use event.target.name
  };

  //Efecto para seleccionar por defecto el botón si hay un valor predeterminado
  useEffect(() => {
    setSelectedButton(defaultValuefilterSearch);
  }, [defaultValuefilterSearch]);

  return (
    <BoxFilter>
      {Object.entries(filterButtons).map(([key, value]) => (
        <ButtonFilter
          key={key}
          isSelected={selectedButton === key || selectedButton === value} // Pasamos el estado de selección
          name={value} // El nombre de cada botón
          onClick={(event) => handleButtonClick(event, key)} // Pasar el evento completo
        >
          {key} {/* Aquí muestra la clave del botón */}
        </ButtonFilter>
      ))}
    </BoxFilter>
  );
};

export default GeneralFilterButtons;
