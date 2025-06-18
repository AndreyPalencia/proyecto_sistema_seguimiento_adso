import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import FormUploadFile from '../../FormUploadFile/FormUploadFile';

/**
 *
 * `EditInfoModalFile`
 *
 * Componente modal que permite cargar un único archivo a través del componente FormUploadFile.
 * Al seleccionar un archivo, se habilita la acción para guardar los cambios.
 *
 * @param {Object} props - Props del componente.
 * @param {string} props.titulo - Título que se muestra en el diálogo de carga.
 * @param {boolean} props.isOpen - Determina si el modal está abierto.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el modal.
 * @param {Function} props.onSave - Función que se ejecuta al guardar el archivo seleccionado.
 *        Recibe un objeto con la propiedad `archivo` que contiene el archivo cargado.
 *
 * @example
 * <EditInfoModalFile
 *   titulo="Subir archivo"
 *   isOpen={modalAbierto}
 *   onClose={handleCerrar}
 *   onSave={(data) => console.log(data.archivo)}
 * />
 */
const EditInfoModalFile = ({ titulo, isOpen, onClose, onSave }) => {
  const [fileSelected, setFileSelected] = useState(null);

  /**
   * Maneja la acción de guardar el archivo seleccionado.
   * Si no hay archivo seleccionado, no realiza ninguna acción.
   */
  const handleActualizarFile = () => {
    if (!fileSelected) return;
    onSave({ archivo: fileSelected.archivo });
    onClose();
  };

  /**
   * Efecto que limpia el estado del archivo seleccionado
   * cuando el modal se cierra.
   */
  useEffect(() => {
    if (!isOpen) {
      setFileSelected(null);
    }
  }, [isOpen]);

  return (
    <FormUploadFile
      key={isOpen ? 'open' : 'closed'}
      titulo={titulo}
      open={isOpen}
      onClose={onClose}
      onFileChange={(file) => {
        console.log('Archivo seleccionado:', file);
        setFileSelected({ archivo: file });
      }}
      actions={
        <Button
          onClick={handleActualizarFile}
          color="primary"
          variant="contained"
          disabled={!fileSelected}
        >
          Guardar
        </Button>
      }
    />
  );
};

export default EditInfoModalFile;
