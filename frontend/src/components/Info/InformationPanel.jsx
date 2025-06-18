import InfoCard from './InfoCard/InfoCard';
import EditInfoModal from './EditInfoModal/EditInfoModal';
import { useState } from 'react';

/**
 * Componente `InformationPanel`
 *
 * Este componente muestra un panel de información (InfoCard) con datos, que puede ser editado a través de un modal emergente (EditInfoModal).
 * El modal permite al usuario editar los datos mostrados en el panel, y su comportamiento se controla mediante propiedades como `disableClick`.
 *
 * Dependiendo del valor de la propiedad `type`, el modal renderiza un tipo específico de campo para la edición de datos (por ejemplo, un campo de texto, un selector o un campo de fecha).
 *
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.name - Nombre del panel de información, utilizado como identificador (requerido).
 * @param {string} [props.type='text'] - Tipo de dato que se mostrará en el modal de edición. Dependiendo de este valor, se renderiza un tipo diferente de campo (opcional, por defecto 'text').
 * @param {string} [props.tag=''] - Tipo de campo que se renderiza en el modal dependiendo del `type`. Por ejemplo, 'text', 'select', 'date', etc. (opcional, por defecto cadena vacía).
 * @param {string} props.titulo - Título del panel de información, visible tanto en el panel como en el modal (requerido).
 * @param {string|number} props.item - El ítem que se mostrará en el panel de información y en el modal (requerido). Puede ser un objeto o una cadena.
 * @param {boolean} [props.inputLabel=false] - Si es `true`, el label se comporta como `InputLabel` con shrink.
 * @param {Array<string>} [props.menuOpciones=[]] - Opciones del menú que se mostrarán en un menú desplegable en el modal (opcional).
 * @param {boolean} [props.isLast=false] - Indica si este es el último panel en una lista (opcional, por defecto `false`).
 * @param {boolean} [props.disabled=false] - Desactiva el campo si es `true`.
 * @param {boolean} [props.disableClick=false] - Si es `true`, deshabilita la interacción del usuario con el panel y el botón de guardar en el modal (opcional, por defecto `false`).
 * @param {Function} props.fetchUpdate - Función que se invoca para actualizar los datos del panel de información y del modal (requerido). Esta función recibe el valor actualizado de la información.
 *
 * @example
 * <InformationPanel
 *   name="Panel 1"
 *   type="select"
 *   titulo="Panel de Información"
 *   item='opcionUno'
 *   menuOpciones={['opcionUno', 'opcionDos']}
 *   isLast={true}
 *   disableClick={false}
 *   fetchUpdate={algunaFetchFunction}
 * />
 *
 * @returns {JSX.Element} El componente InformationPanel con sus respectivas interacciones.
 */
const InformationPanel = ({
  name,
  type = 'text',
  tag = '',
  titulo,
  item = '',
  inputLabel = false,
  menuOpciones = [],
  isLast = false,
  disabled = false,
  disableClick = false,
  disableModal = false,
  isArrayOptions,
  labelKey,
  valueKey,
  fetchUpdate,
}) => {
  //Estado para manejar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Función para alternar el estado de apertura/cierre del modal.
   * Se ejecuta cuando el usuario interactúa con el `InfoCard` o el modal.
   */
  const handleModalOpen = () => {
    //console.log(isModalOpen);
    if (disableModal) return;
    setIsModalOpen((open) => !open);
  };

  return (
    <>
      <InfoCard
        titulo={titulo}
        item={item}
        isLast={isLast}
        onToggleDialog={handleModalOpen}
      />
      <EditInfoModal
        name={name}
        type={type}
        titulo={titulo}
        item={item}
        tag={tag}
        inputLabel={inputLabel}
        menuOpciones={menuOpciones}
        disabled={disabled}
        disableClick={disableClick}
        isOpen={isModalOpen}
        onClose={handleModalOpen}
        onSave={fetchUpdate}
        isArrayOptions={isArrayOptions}
        labelKey={labelKey}
        valueKey={valueKey}
      />
    </>
  );
};

export default InformationPanel;
