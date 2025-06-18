import { useState, useEffect } from 'react';
import { useAlert } from '../../../context/AlertContext';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { descargarDocumento } from '../../../services/Documentos';

import { useDocumentosAprendiz } from '../../../hook/documentos/useDocumentosAprendiz';
import { useEliminarDocumento } from '../../../hook/documentos/useEliminarDocumentoAprendiz';
import { useEditarDocumentoAprendiz } from '../../../hook/documentos/useEditarDocumentoAprendiz';
import { useNotificacionesDefault } from '../../../hook/notificaciones/useNotfiicacionesDefault';

import { TablaListaCheckBox } from '../../../components/Tabla/Tabla';
import FormEditarDocumento from '../../../components/Forms/FormDocumento/FormEditarDocumento';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReplyIcon from '@mui/icons-material/Reply';

const DocumentosInstructor = ({ idFichaAprendiz, ficha, idAprendiz }) => {
  const [openEditarDocumento, setEditarDocumento] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);

  const { documentos, loading, refetchDocumentos, tiposDisponibles } =
    useDocumentosAprendiz(idFichaAprendiz);

  const { editarDocumento } = useEditarDocumentoAprendiz();

  const { notificarSolicitudDocumento } = useNotificacionesDefault();

  const { showAlert } = useAlert();
  const { updateActionsButtons } = useActionsButtonsContext();

  const getDocumentoById = (id) =>
    documentos.find((doc) => doc.idDocumento === id);

  const handleEditarDocumento = () => setEditarDocumento((prev) => !prev);

  const handleEditarDocumentoClick = (idDocumento) => {
    const seleccionado = getDocumentoById(idDocumento);
    if (!seleccionado) return;
    setDocumentoSelecionado(seleccionado);
    handleEditarDocumento();
  };

  const handleEditarDocumentoDialog = async (idDocumento, documentoEditado) => {
    await editarDocumento(idDocumento, documentoEditado);
    await refetchDocumentos();
  };

  const handleDownloadDocumento = async (idDocumento) => {
    const documento = getDocumentoById(idDocumento);
    const fileName = documento?.['nombreDocumento'] ?? null;

    if (!fileName) {
      showAlert({
        message:
          'No se encontró el archivo para este documento. Intentelo de nuevo.',
        severity: 'warning',
      });
      return;
    }

    await descargarDocumento(fileName);
  };

  const handleStateDocumentoClick = async (valueCheck, idDocumento) => {
    const { tipoDocumento, ...documento } = getDocumentoById(idDocumento);
    if (!documento) return;
    const documentoEditado = {
      ...documento,
      estadoDocumento: valueCheck,
    };
    await editarDocumento(idDocumento, documentoEditado);
    await refetchDocumentos();
  };

  const handleNotificacionSolicitud = (idDocumento) => {
    const documento = getDocumentoById(idDocumento);
    notificarSolicitudDocumento(idAprendiz, documento, ficha);
  };

  const botonesDocumento = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: handleEditarDocumentoClick,
      tooltip: 'Editar',
    },
    {
      id: 'estadoDocumento',
      type: 'checkbox',
      action: handleStateDocumentoClick,
      tooltip: 'Aprobar',
      otherTooltip: 'No aprobada',
    },
    {
      icon: ReplyIcon,
      color: ' #29737D',
      position: 'center',
      action: handleNotificacionSolicitud,
      tooltip: 'Solicitar nuevamente el documento',
    },
    {
      icon: FileDownloadOutlinedIcon,
      color: ' #39A900',
      position: 'left',
      action: handleDownloadDocumento,
      tooltip: 'Descargar Documento',
    },
  ];

  useEffect(() => {
    if (!loading && documentos?.length) {
      updateActionsButtons(botonesDocumento);
    }
  }, [documentos, loading]);

  return (
    !loading && (
      <>
        <TablaListaCheckBox
          key={documentos.length}
          data={documentos || []}
          dataException={['idFichaAprendiz', 'estadoDocumento']}
          selectedValue={'idDocumento'}
          header={[
            'Id documento',
            'Tipo de documento',
            'Observación',
            'Nombre del documento',
            'Fecha de ultima actulización ',
          ]}
          initialValue={['estadoDocumento']}
        />
        {openEditarDocumento && (
          <FormEditarDocumento
            open={openEditarDocumento}
            onClose={handleEditarDocumento}
            idFichaAprendiz={idFichaAprendiz}
            documento={documentoSelecionado}
            tiposDisponibles={tiposDisponibles}
            onEditarDocumento={handleEditarDocumentoDialog}
            isInstructor
          />
        )}
      </>
    )
  );
};

export default DocumentosInstructor;
