import { useState, useEffect } from 'react';
import { useAlert } from '../../../context/AlertContext';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { descargarDocumento } from '../../../services/Documentos';

import { useDocumentosAprendiz } from '../../../hook/documentos/useDocumentosAprendiz';
import { useEditarDocumentoAprendiz } from '../../../hook/documentos/useEditarDocumentoAprendiz';
import { useEliminarDocumento } from '../../../hook/documentos/useEliminarDocumentoAprendiz';
import { useNotificacionesDefault } from '../../../hook/notificaciones/useNotfiicacionesDefault';

import { TablaListaCheckBox } from '../../../components/Tabla/Tabla';
import FormEditarDocumento from '../../../components/Forms/FormDocumento/FormEditarDocumento';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReplyIcon from '@mui/icons-material/Reply';

const DocumentosAprendiz = ({
  idFichaAprendiz,
  ficha,
  idAprendiz,
  nuevoDocumento = null,
  onTiposDocumentos = null,
}) => {
  const [openEditarDocumento, setEditarDocumento] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);

  const { documentos, loading, refetchDocumentos, tiposDisponibles } =
    useDocumentosAprendiz(idFichaAprendiz);

  const { editarDocumento } = useEditarDocumentoAprendiz();
  const { eliminarDocumento } = useEliminarDocumento();

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

  const handleEliminarDocumentoClick = async (idDocumento) => {
    await eliminarDocumento(idDocumento, refetchDocumentos);
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

  const handleNotificacionSolicitud = async (idDocumento) => {
    const documento = getDocumentoById(idDocumento);
    await notificarSolicitudDocumento(idAprendiz, documento, ficha);
  };

  const botonesDocumento = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: handleEditarDocumentoClick,
      tooltip: 'Editar',
    },
  ];

  useEffect(() => {
    if (!loading && documentos?.length) {
      updateActionsButtons(botonesDocumento);
    }
  }, [documentos, loading]);

  useEffect(() => {
    if (nuevoDocumento) {
      refetchDocumentos();
    }
  }, [nuevoDocumento]);
  useEffect(() => {
    if (tiposDisponibles) {
      onTiposDocumentos(tiposDisponibles);
    }
  }, [tiposDisponibles, onTiposDocumentos]);

  const extraActionsDocumentos = {
    admin: [
      {
        icon: DeleteOutlineOutlinedIcon,
        color: ' #EC221F',
        position: 'center',
        action: handleEliminarDocumentoClick,
        tooltip: 'Eliminar',
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
      {
        id: 'estadoDocumento',
        type: 'checkbox',
        action: handleStateDocumentoClick,
        tooltip: 'Aprobar',
        otherTooltip: 'No aprobada',
      },
    ],

    aprendiz: [
      {
        icon: FileDownloadOutlinedIcon,
        color: ' #39A900',
        position: 'left',
        action: handleDownloadDocumento,
        tooltip: 'Descargar Documento',
      },
      {
        id: 'estadoDocumento',
        type: 'checkbox',
        action: () => {},
        color: `rgb(57, 169, 0)`,
        isDisabled: true,
        tooltip: 'Aprobada',
        otherTooltip: 'No aprobada',
      },
    ],
  };

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
          extraActions={extraActionsDocumentos}
        />
        {openEditarDocumento && (
          <FormEditarDocumento
            open={openEditarDocumento}
            onClose={handleEditarDocumento}
            idFichaAprendiz={idFichaAprendiz}
            documento={documentoSelecionado}
            isAprediz
            onEditarDocumento={handleEditarDocumentoDialog}
          />
        )}
      </>
    )
  );
};

export default DocumentosAprendiz;
