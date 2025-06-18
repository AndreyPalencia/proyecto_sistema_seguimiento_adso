import { useState } from 'react';
import { modificarDocumento } from '../../services/Documentos';
import { useAlert } from '../../context/AlertContext';

const useEditarDocumentoAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarDocumento = async (idDocumento, formDataDocumento) => {
    setLoading(true);
    try {
      //console.log(documentosAprendiz, 'datos recibidos');
      let dataToSend;

      if (formDataDocumento.archivo instanceof File) {
        dataToSend = new FormData();
        for (const key in formDataDocumento) {
          if (
            formDataDocumento[key] !== undefined &&
            formDataDocumento[key] !== null
          ) {
            dataToSend.append(key, formDataDocumento[key]);
          }
        }
      } else {
        dataToSend = { ...formDataDocumento };
      }
      await modificarDocumento(idDocumento, dataToSend);

      showAlert({
        message: 'Se actualizó con éxito el documento.',
        severity: 'info',
        variant: 'standard',
      });

      //return updatedDocumento;
    } catch (error) {
      console.error('Error al editar el documento:', error);
      showAlert({
        message: `Error al actualizar el documento. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { editarDocumento, loading };
};

export { useEditarDocumentoAprendiz };
