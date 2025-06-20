import { useEffect, useState } from 'react';
import { useActionsButtonsContext } from '../../context/ActionsButtonsContext';
import { useAprendices } from '../../context/AprendicesContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import {
  Box,
  Typography,
  Stack,
  IconButton,
  ButtonGroup,
  Tooltip,
} from '@mui/material';

import { useSidebar } from '../../context/SidebarContext';
import { useFichaById } from '../../hook/useFichaById';

import { TablaLista } from '../../components/Tabla/Tabla';
import FormCrearAprendizFicha from '../../components/Forms/FormCrearAprendizFicha/FormCrearAprendizFicha';
import FormReporteGFIPF from '../../components/Forms/FormularioReporteGFIPF/FormReporteGFIPF';
import { useCrearReporteGFPIFAprendiz } from '../../hook/reportesGFPIF/useCrearReporteGFPIFAprendiz';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
//import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { TbReportAnalytics } from 'react-icons/tb';
import { useDescargarDocumentosFicha } from '../../hook/useDescargarDocumentosFicha';

function formatearFecha(fechaStr) {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const fecha = new Date(fechaStr);
  const anio = fecha.getFullYear();
  const mes = meses[fecha.getMonth()];
  const dia = fecha.getDate();

  return `${dia} ${mes} ${anio}`;
}

const AprendicesFichas = () => {
  //Obtenemos el idFicha de los parámetros de la URL
  const { idFicha, idInstructor, idInstructorAdmin } = useParams();

  let idInstructorConsulta = idInstructor || idInstructorAdmin;
  //Obtenemos idUsuario y roleUsuario del contexto de autenticación
  const [openCrearReporte, setCrearReporte] = useState(false);

  const navigate = useNavigate();
  //Obtenemos la funcion para actualizar por lista los botones del contexto de botones de acción
  const { updateActionsButtons } = useActionsButtonsContext();
  //Obtenemos la función para actualizar el título del contexto de título

  //Obtenemos del contexto de aprendices las funciones para realziar un consulta de los aprendices a base de datos
  //la funcion para obtener solo la informacion del aprendiz y el estado de carga de la petición
  const { obtenerAprendicesByFicha, aprendicesInfo, loading } = useAprendices();
  //Obtenemos del contexto de sidebar las fución de agregar ids

  const { loading: loadingNuevoReportes, fetchCrearReportesGFPIF } =
    useCrearReporteGFPIFAprendiz();

  const [reloadAprendices, setReloadAprendices] = useState(false);

  const { setIds } = useSidebar();

  const { roleUsuario } = useAuth();

  const { ficha, loading: loadingFicha } = useFichaById(idFicha);
  const { descargarDocumentosFicha } = useDescargarDocumentosFicha();

  const [openCrearAprendiz, setOpenCrearAprendiz] = useState(false);
  const handleCrearReporte = () => setCrearReporte((prev) => !prev);

  const [selectedIdFichaAprendiz, setSelectedIdFichaAprendiz] = useState(null);
  const [selectedIdAprendiz, setSelectedIdAprendiz] = useState(null);

  const handleSuccessCrearAprendiz = () => {
    setReloadAprendices((prev) => !prev); // Fuerza recarga de aprendices
    setOpenCrearAprendiz(false); // Cierra el modal
  };

  const handleCrearAprendiz = () => {
    setOpenCrearAprendiz((prev) => !prev);
  };

  // Manejar clic en un aprendiz
  const handleClickAprendiz = (idAprendiz) => {
    // Establecer el ID del aprendiz seleccionado
    setIds('idAprendiz', idAprendiz);
    // Navegar a la página del aprendiz
    if (roleUsuario === 'admin')
      navigate(
        `/admin/rol/instructor/${idInstructorConsulta}/ficha/${idFicha}/aprendiz/${idAprendiz}/seguimiento`
      );
    else
      navigate(
        `/instructor/${idInstructorConsulta}/ficha/${idFicha}/aprendiz/${idAprendiz}/seguimiento`
      );
  };

  const handleReporteAprendiz = (idAprendiz) => {
    const aprendizEncontrado = aprendicesInfo().find(
      (apr) => apr.idAprendiz === idAprendiz
    );
    if (!aprendizEncontrado) return;

    const { idFichaAprendiz } = aprendizEncontrado;

    setSelectedIdFichaAprendiz(idFichaAprendiz);
    setSelectedIdAprendiz(idAprendiz);
    setCrearReporte(true); // Open the report form modal
  };

  const handleNuevoReporte = async (formData) => {
    await fetchCrearReportesGFPIF(selectedIdFichaAprendiz, formData);
    if (!loadingNuevoReportes) {
      setSelectedIdAprendiz(null);
    }
  };

  const handleDownloadArchivos = async () => {
    await descargarDocumentosFicha(idFicha);
  };
  /**
   * Array de objetos que representan los botones de acción para las fichas.
   * Cada botón tiene un ícono, color, posición, acción y tooltip.
   *
   * @type {Array}
   */
  const botonesFicha = [
    {
      icon: OpenInNewIcon,
      color: ' #39A900',
      position: 'center',
      action: (idAprendiz) => {
        handleClickAprendiz(idAprendiz); // Esto actualiza el aprendiz seleccionado
      },
      tooltip: 'Abrir seguimiento',
    },
    {
      icon: DrawOutlinedIcon,
      color: '#29737D',
      position: 'left',
      action: (idAprendiz) => {
        navigate(
          `/instructor/${idInstructorConsulta}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`
        );
      },
      tooltip: 'Editar',
    },
    {
      icon: TbReportAnalytics,
      color: ' #39A900',
      position: 'left',
      action: handleReporteAprendiz,
      tooltip: 'Generar reporte GFPIF',
    },
  ];

  // Configura botones cuando cargue la página
  useEffect(() => {
    obtenerAprendicesByFicha(idFicha);
    updateActionsButtons(botonesFicha);
  }, [idFicha, ficha, reloadAprendices]); // ← Aquí añadimos reloadAprendices

  return (
    <Box
      component="main"
      className="box-main-info"
      sx={{ marginBottom: 2, marginTop: 1 }}
    >
      {/* Title + Date */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography component="h2" variant="h5" fontWeight="600" sx={{ mt: 2 }}>
          {!loadingFicha && `${ficha?.nombrePrograma} - ${ficha?.numeroFicha}`}
        </Typography>
        <ButtonGroup sx={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Agregar Usuario">
            <IconButton
              fontSize="59px"
              aria-label="Agregar Usuario"
              onClick={handleCrearAprendiz}
            >
              <PersonAddAlt1Icon sx={{ fontSize: 26, color: ' #39A900' }} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="Cargar aprendices">
            <IconButton aria-label="Cargar aprendices ">
              <UploadFileIcon sx={{ fontSize: 26, color: ' #39A900' }} />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Descargar">
            <IconButton
              aria-label="Descargar documentos"
              onClick={handleDownloadArchivos}
            >
              <FileDownloadOutlinedIcon
                sx={{ fontSize: 26, color: ' #39A900' }}
              />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Stack>
      {/* Aprendices Table */}
      {loading ? (
        <Typography>Cargando aprendices...</Typography>
      ) : (
        <TablaLista
          data={aprendicesInfo() || []}
          dataException={[
            'idUsuario',
            'password',
            'estadoUsuario',
            'idAprendiz',
            'rol',
            'idFicha',
            'idFichaAprendiz',
          ]}
          selectedValue={'idUsuario'}
          header={[
            'Tipo documento',
            'Número documento',
            'Nombre',
            'Apellido',
            'Telefono',
            'Correo Electrónico',
            'Firma',
          ]}
        />
      )}
      {openCrearAprendiz && (
        <FormCrearAprendizFicha
          idFicha={idFicha}
          open={openCrearAprendiz}
          onClose={handleCrearAprendiz}
          onSuccess={handleSuccessCrearAprendiz}
        />
      )}

      {openCrearReporte && (
        <FormReporteGFIPF
          idFichaAprendiz={selectedIdFichaAprendiz}
          idFicha={idFicha}
          idAprendiz={selectedIdAprendiz}
          open={openCrearReporte}
          onClose={handleCrearReporte}
          onNuevoReporte={handleNuevoReporte}
        />
      )}
    </Box>
  );
};

export default AprendicesFichas;
