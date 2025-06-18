import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';

import { TablaLista } from '../../../components/Tabla/Tabla';

import { descargarReportesGFIPF } from '../../../services/ReportesGPFPIF';
import { useCrearReporteGFPIFAprendiz } from '../../../hook/reportesGFPIF/useCrearReporteGFPIFAprendiz';
import { useEliminarReporteGFPIFAprendiz } from '../../../hook/reportesGFPIF/useEliminarReporteGFPIFAprendiz';
import { useEditarReporteGFPIFAprendiz } from '../../../hook/reportesGFPIF/useEditarReporteGFPIFAprendiz';
import { useReportesGFPIFAprendiz } from '../../../hook/reportesGFPIF/useReportesGFPIFAprendiz';
import { useAprendicesByRuta } from '../../../hook/useAprendicesByRuta';

import FormReporteGFIPF from '../../../components/Forms/FormularioReporteGFIPF/FormReporteGFIPF';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FormEditarReporteGFIPF from '../../../../trash/FormEditarReporteGFIPF';

const ReportesInstructorGFPIF = () => {
  const { idAprendiz, idFicha } = useParams();
  const [openCrearReporte, setCrearReporte] = useState(false);
  const [openEditarReporte, setOpenEditarReporte] = useState(false);
  const [reporteSelecionado, setReporteSelecionado] = useState(null);

  const { updateActionsButtons } = useActionsButtonsContext();

  const { aprendiz } = useAprendicesByRuta(idAprendiz);
  const idFichaAprendiz = aprendiz?.idFichaAprendiz;

  const { loading, reportes, refetchReportesGFPIF } = useReportesGFPIFAprendiz({
    idFichaAprendiz,
  });

  const getReporteId = (id) => reportes.find((rep) => rep.idReporte === id);

  const { loading: loadingNuevoReportes, fetchCrearReportesGFPIF } =
    useCrearReporteGFPIFAprendiz();

  const { loading: loadingEliminarReporte, fetchEliminarReporte } =
    useEliminarReporteGFPIFAprendiz();

  const { loading: loadingEditarReporte, fetchEditarReporte } =
    useEditarReporteGFPIFAprendiz();

  const handleCrearReporte = () => setCrearReporte((prev) => !prev);

  const handleCloseFormulario = () => {
    setOpenEditarReporte(false);
    setCrearReporte(false);
    setReporteSelecionado(null);
  };

  const handleNuevoReporte = async (formData) => {
    await fetchCrearReportesGFPIF(idFichaAprendiz, formData);
    if (!loadingNuevoReportes) {
      await refetchReportesGFPIF();
    }
  };

  const handleEliminarReporte = async (idReporte) => {
    await fetchEliminarReporte(idReporte, refetchReportesGFPIF);
    if (!loadingEliminarReporte) {
      await refetchReportesGFPIF();
    }
  };

  const handleModificarReporte = async (formData) => {
    //console.log(formData, 'edicion desde fetxh', reporteSelecionado);
    await fetchEditarReporte(reporteSelecionado, formData);
    if (!loadingEditarReporte) {
      await refetchReportesGFPIF();
    }
  };

  const handleEditarReporteClick = (reporteId) => {
    const { idReporte } = getReporteId(reporteId);
    if (!idReporte) return;

    setReporteSelecionado(idReporte);
    setOpenEditarReporte(true); // directly open the form
  };

  const handleDownloadReportesGFPIF = async (idReporte) => {
    await descargarReportesGFIPF(idFicha, idFichaAprendiz, idReporte);
  };
  useEffect(() => {
    if (!loading && reportes?.length) {
      updateActionsButtons(botonesReportes);
    }
  }, [loading, reportes]);

  const botonesReportes = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: handleEditarReporteClick,
      tooltip: 'Editar',
    },
    {
      icon: FileDownloadOutlinedIcon,
      color: ' #39A900',
      position: 'left',
      action: handleDownloadReportesGFPIF,
      tooltip: 'Descargar Documento',
    },
    {
      icon: DeleteOutlineOutlinedIcon,
      color: ' #EC221F',
      position: 'center',
      action: handleEliminarReporte,
      tooltip: 'Eliminar',
    },
  ];

  return (
    <Box component="main" className="box-main-info" sx={{ marginBottom: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          className="typography-title-info"
          fontSize="28px"
          fontWeight="bold"
        >
          Reportes GFPI F
        </Typography>

        {/* Aquí va el botón adicional */}
        <Tooltip title="Agregar reporte">
          <IconButton
            variant="contained"
            color="primary"
            onClick={handleCrearReporte} // define esta función según tu lógica
          >
            <AddOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 1, mt: -3 }} />
      {!loading && (
        <>
          <TablaLista
            data={reportes || []}
            dataException={['idFichaAprendiz']}
            selectedValue={'idReporte'}
            header={[
              'Id Reporte',
              'Nombre del reporte',
              'Fecha de ultima actulización ',
              'Tipo reporte',
            ]}
          />
          {(openCrearReporte || openEditarReporte) && (
            <FormReporteGFIPF
              idFichaAprendiz={idFichaAprendiz}
              idFicha={idFicha}
              idAprendiz={idAprendiz}
              open={openCrearReporte || openEditarReporte}
              onClose={handleCloseFormulario}
              onNuevoReporte={handleNuevoReporte}
              onEditarReporte={handleModificarReporte}
              idReporte={reporteSelecionado}
              isEdit={openEditarReporte}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default ReportesInstructorGFPIF;
