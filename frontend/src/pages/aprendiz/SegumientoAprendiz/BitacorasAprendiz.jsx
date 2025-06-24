import { useState, useEffect, useCallback } from 'react';
import { useAlert } from '../../../context/AlertContext';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { descargarBitacora } from '../../../services/Bitacoras';
import { useEliminarBitacora } from '../../../hook/bitacoras/useEliminarBitacoraAprendiz';

import { useBitacorasAprendiz } from '../../../hook/bitacoras/useBitacorasAprendiz';
import { useEditarBitacora } from '../../../hook/bitacoras/useEditarBitacoraAprendiz';
import { useNotificacionesDefault } from '../../../hook/notificaciones/useNotfiicacionesDefault';

import { TablaListaCheckBox } from '../../../components/Tabla/Tabla';
import FormEditarBitacora from '../../../components/Forms/FormBitacora/FormEditarBitacora';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const BitacorasAprendiz = ({
  idFichaAprendiz,
  ficha,
  idAprendiz,
  nuevaBitacora = null,
  onDatosFormulario = null,
}) => {
  const [openEditarBitacora, setEditarBitacora] = useState(false);
  const [bitacoraSeleccionada, setBitacoraSeleccionada] = useState(null);

  // Hook para obtener bitácoras
  const { bitacoras, loading, refetchBitacoras, datosFormulario } =
    useBitacorasAprendiz(idFichaAprendiz);

  // Hook para editar una bitácora
  const { editarBitacora } = useEditarBitacora();

  const { eliminarBitacora } = useEliminarBitacora();

  const { notificarSolicitudNuevaBitacora } = useNotificacionesDefault();


  // Contextos para alertas y botones de acción
  const { showAlert } = useAlert();
  const { updateActionsButtons } = useActionsButtonsContext();

  const getBitacoraById = (id) => bitacoras.find((b) => b.idBitacora === id);

  const handleEditarBitacora = () => setEditarBitacora((prev) => !prev);

  const handleEditarBitacoraClick = (idBitacora) => {
    const seleccionada = getBitacoraById(idBitacora);
    if (!seleccionada) return;
    setBitacoraSeleccionada(seleccionada);
    handleEditarBitacora();
  };

  const handleEditarBitacoraDialog = async (idBitacora, bitacoraEditada) => {
    await editarBitacora(idBitacora, bitacoraEditada);
    await refetchBitacoras();
  };

  const handleStateBitacoraClick = async (valueCheck, idBitacora) => {
    const bitacora = getBitacoraById(idBitacora);
    if (!bitacora) return;

    const bitacoraEditada = {
      ...bitacora,
      estadoBitacora: valueCheck,
    };

    await editarBitacora(idBitacora, bitacoraEditada);
    await refetchBitacoras();
  };

  const handleDonwloadBitacora = async (idBitacora) => {
    const bitacora = getBitacoraById(idBitacora);
    const nombreBitacoraFile = bitacora?.bitacora ?? null;

    if (!nombreBitacoraFile) {
      showAlert({
        message:
          'No se encontró el archivo para esta bitácora. Inténtelo de nuevo.',
        severity: 'warning',
      });
      return;
    }

    await descargarBitacora(nombreBitacoraFile);
  };

  const handleNotificacionSolicitud = async (idBitacora) => {
    const bitacora = getBitacoraById(idBitacora);
    await notificarSolicitudNuevaBitacora(idAprendiz, bitacora, ficha);
  };

  const handleEliminarBitacoraClick = async (idBitacora) => {
    await eliminarBitacora(idBitacora, refetchBitacoras);
  };

  const botonesBitacora = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: handleEditarBitacoraClick,
      tooltip: 'Editar',
    },
  ];

  useEffect(() => {
    if (!loading && bitacoras?.length) {
      updateActionsButtons(botonesBitacora);
    }
  }, [bitacoras, loading]);

  useEffect(() => {
    if (nuevaBitacora) {
      refetchBitacoras(); // actualiza todo con datos frescos
    }
  }, [nuevaBitacora]);

  useEffect(() => {
    if (datosFormulario) {
      onDatosFormulario(datosFormulario); // lo subes al padre
    }
  }, [datosFormulario]);

  const extraActionsBitaras = {
    admin: [
      {
        icon: DeleteOutlineOutlinedIcon,
        color: ' #EC221F',
        position: 'center',
        action: handleEliminarBitacoraClick,
        tooltip: 'Eliminar bitácora',
      },
      {
        icon: ReplyIcon,
        color: ' #29737D',
        position: 'center',
        action: handleNotificacionSolicitud,
        tooltip: 'Solicitar nuevamente la bitácora',
      },
      {
        icon: FileDownloadOutlinedIcon,
        color: ' #39A900',
        position: 'left',
        action: handleDonwloadBitacora,
        tooltip: 'Descargar',
      },
      {
        id: 'estadoBitacora',
        type: 'checkbox',
        action: handleStateBitacoraClick,
        color: `rgb(57, 169, 0)`,
        tooltip: 'Aprobada',
        otherTooltip: 'No aprobada',
      },
    ],
    aprendiz: [
      {
        icon: FileDownloadOutlinedIcon,
        color: ' #39A900',
        position: 'left',
        action: handleDonwloadBitacora,
        tooltip: 'Descargar',
      },
      {
        id: 'estadoBitacora',
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
          key={bitacoras.length}
          data={bitacoras || []}
          dataException={['estadoBitacora', 'idFichaAprendiz', 'idBitacora']}
          selectedValue={'idBitacora'}
          initialValue={['estadoBitacora']}
          header={[
            'Número Bitácora',
            'Observación',
            'Bitácora',
            'Fecha de ultima altulización',
          ]}
          extraActions={extraActionsBitaras}
        />
        {openEditarBitacora && (
          <FormEditarBitacora
            open={openEditarBitacora}
            onClose={handleEditarBitacora}
            idFichaAprendiz={idFichaAprendiz}
            bitacora={bitacoraSeleccionada}
            onEditarBitacora={handleEditarBitacoraDialog}
          />
        )}
      </>
    )
  );
};

export default BitacorasAprendiz;
