import { useState, useEffect } from 'react';
import { useAlert } from '../../../context/AlertContext';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { descargarDocumento } from '../../../services/Documentos';

import { useDocumentosAprendiz } from '../../../hook/documentos/useDocumentosAprendiz';
import { useEditarDocumentoAprendiz } from '../../../hook/documentos/useEditarDocumentoAprendiz';

import { TablaListaCheckBox } from '../../../components/Tabla/Tabla';
import FormEditarDocumento from '../../../components/Forms/FormDocumento/FormEditarDocumento';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const DocumentosAprendiz = ({
  idFichaAprendiz,
  nuevoDocumento,
  onTiposDocumentos,
}) => {
  const [openEditarDocumento, setEditarDocumento] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);

  const { documentos, loading, refetchDocumentos, tiposDisponibles } =
    useDocumentosAprendiz(idFichaAprendiz);

  const { editarDocumento } = useEditarDocumentoAprendiz();

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

  const botonesDocumento = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: handleEditarDocumentoClick,
      tooltip: 'Editar',
    },
    {
      id: 'estadoBitacora',
      type: 'checkbox',
      action: () => {},
      color: `rgb(57, 169, 0)`,

      isDisabled: true,
      tooltip: 'Aprobar',
      otherTooltip: 'No aprobada',
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
            isAprediz
            onEditarDocumento={handleEditarDocumentoDialog}
          />
        )}
      </>
    )
  );
};

export default DocumentosAprendiz;
