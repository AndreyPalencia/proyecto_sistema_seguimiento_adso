import InfoCard from './InfoCard/InfoCard';
import EditInfoModalFile from './EditInfoModal/EditInfoModalFile';
import { useState } from 'react';

/**
 * `InformationPanelFile`
 *
 * Este componente muestra un panel de información (InfoCard) con datos relacionados con un archivo,
 * que puede ser editado a través de un modal emergente (EditInfoModalFile).
 * El modal permite al usuario editar los datos del archivo mostrado en el panel.
 * El comportamiento de apertura del modal se controla mediante la propiedad `disableClick`.
 *
 * Dependiendo de las propiedades del componente, el modal mostrará un campo para la carga de archivos y
 * otras interacciones relacionadas.
 *
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.name - Nombre del panel de información, utilizado como identificador (requerido).
 * @param {string} [props.type='text'] - Tipo de dato que se mostrará en el modal de edición.
 *        Este campo puede determinar el tipo de entrada, por ejemplo, 'text', 'file', etc. (opcional, por defecto 'text').
 * @param {string} [props.tag=''] - Tipo de campo que se renderiza en el modal dependiendo del `type`.
 *        Por ejemplo, 'text', 'select', 'date', etc. (opcional, por defecto cadena vacía).
 * @param {string} props.titulo - Título del panel de información, visible tanto en el panel como en el modal (requerido).
 * @param {string|number} props.item - El ítem que se mostrará en el panel de información y en el modal (requerido).
 *        Puede ser un objeto o una cadena.
 * @param {boolean} [props.isLast=false] - Indica si este es el último panel en una lista (opcional, por defecto `false`).
 * @param {boolean} [props.disableClick=false] - Si es `true`, desactiva la interacción del usuario con el panel y el botón de guardar en el modal (opcional, por defecto `false`).
 * @param {Function} props.fetchUpdate - Función que se invoca para actualizar los datos del panel de información y del modal.
 *        Esta función recibe el valor actualizado de la información (requerido).
 *
 * @example
 * <InformationPanelFile
 *   name="PanelArchivo"
 *   type="file"
 *   titulo="Subir Documento"
 *   item="documento1.pdf"
 *   isLast={true}
 *   disableClick={false}
 *   fetchUpdate={actualizarArchivo}
 * />
 *
 * @returns {JSX.Element} El componente `InformationPanelFile` con sus respectivas interacciones.
 */
const InformationPanelFile = ({
  name,
  type = 'text',
  tag = '',
  titulo,
  item = '',
  isLast = false,
  disableClick = false,
  fetchUpdate,
  imageSrc,
}) => {
  //Estado para manejar la apertura del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Función manejar el estado cambio de isModalOpen
  const handleModalOpen = () => {
    console.log(isModalOpen);
    setIsModalOpen((open) => !open);
  };

  return (
    <>
      <InfoCard
        titulo={titulo}
        item={item}
        isLast={isLast}
        onToggleDialog={handleModalOpen}
        imageSrc={imageSrc}
      />
      <EditInfoModalFile
        name={name}
        type={type}
        titulo={titulo}
        item={item}
        tag={tag}
        disableClick={disableClick}
        isOpen={isModalOpen}
        onClose={handleModalOpen}
        onSave={fetchUpdate}
      />
    </>
  );
};

export default InformationPanelFile;
