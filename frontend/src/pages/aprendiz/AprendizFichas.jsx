import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useActionsButtonsContext } from '../../context/ActionsButtonsContext';
import { useAprendiz } from '../../context/AprendizContext';

import { Box, Typography } from '@mui/material';

import { getFichasByIdAprendizAndState } from '../../services/Fichas';

import { TablaViewGrid } from '../../components/Tabla/Tabla';

//import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FormCrearFicha from '../../components/Forms/FormFicha/FormCrearFicha';
import SchoolIcon from '@mui/icons-material/School';

// import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
// import { modificarEstadoFicha } from '../../services/Fichas';
// import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';

/**
 * `FichasInstructor`
 *
 * Componente que muestra un listado de fichas asociadas a un instructor.
 * Permite cambiar entre vista de lista o cuadrícula, y proporciona botones de acción
 * para editar las fichas o mostrar más información.
 *
 *
 * @returns {JSX.Element} - Devuelve el listado de fichas en formato lista o cuadrícula, dependiendo de la selección.
 */
const AprendizFichas = () => {
  // Obtiene el ID del instructor desde los parámetros de la URL
  const { idAprendiz, idFicha } = useParams();

  // Estado para almacenar la lista de fichas del instructor
  const [fichas, setFichas] = useState([]);

  // Hook de navegación para redirigir a otras rutas
  const navegacion = useNavigate();

  const { aprendiz, loading, obtenerAprendiz } = useAprendiz();

  // Obtiene funciones del contexto para manejar botones de acción
  const { updateActionsButtons } = useActionsButtonsContext();

  //Obtenemos del contexto de sidebar las fuciones de agregar vistas y el stack de vistas y los ids selecionados
  const { pushSidebarView, setIds, sidebarStack } = useSidebar();

  const [openCrearFicha, setOpenCrearFicha] = useState(false);

  const handleCloseCrearFicha = () => setOpenCrearFicha((prev) => !prev);

  const handleNuevaFicha = (nuevaFicha) => {
    setFichas((prev) => [...prev, nuevaFicha]);
    obtenerFichas();
  };

  /**
   * Función asíncrona para obtener las fichas del instructor.
   * Llama al servicio `getFichasByInstructor` y actualiza el estado con los datos obtenidos.
   *
   * @returns {void}
   */
  const obtenerFichas = async () => {
    try {
      // Llamada al servicio para obtener las fichas del instructor
      const fichasList = await getFichasByIdAprendizAndState(idAprendiz, 1);
      // Actualiza el estado con las fichas obtenidas
      setFichas(fichasList);
    } catch (error) {
      // Manejo de errores en la solicitud
      console.error(error);
    }
  };

  /**
   * Función para manejar el clic en una ficha.
   * Redirige a la pagina de de los aprendices pertenecientes a la ficha seleccionada.
   *
   * @param {string|number} fichaId - ID de la ficha seleccionada.
   */
  const handleClickAprendiz = (fichaId) => {
    if (!sidebarStack.includes('ficha')) {
      pushSidebarView('ficha'); // Esto abre el submenu en el sidebar
      setIds('fichaId', fichaId); // Esto actualiza el aprendiz seleccionado
    }
  };

  /**
   * Array de objetos que representan los botones de acción para las fichas.
   * Cada botón tiene un ícono, color, posición, acción y tooltip.
   *
   * @type {Array}
   */
  const botones = [
    {
      icon: OpenInNewIcon,
      color: ' #39A900',
      position: 'left',
      action: async (idFicha) => {
        await obtenerAprendiz(idFicha, idAprendiz);
        navegacion(`/aprendiz/${idAprendiz}/ficha/${idFicha}/seguimiento`);
        handleClickAprendiz(idFicha); // Llama a la función para manejar el clic en el aprendiz
      },
      tooltip: 'Abrir',
      id: 'MainGrid',
    },
  ];

  /**
   * useEffect que se ejecuta cuando cambia el `idInstructor`.
   * Llama a `fetchFichas` para obtener las fichas y configura los botones de acción.
   */
  useEffect(() => {
    obtenerFichas();
    updateActionsButtons(botones);
  }, [idAprendiz]);

  return (
    <Box
      component="main"
      className="box-main-info"
      sx={{ marginBottom: 2, mt: 2 }}
    >
      <Box
        sx={{
          width: '100%',
          border: '1px solid #E0E0E0',
          padding: '20px 20px',
          borderRadius: '7px',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          gap: '20px',
        }}
      >
        {/* Título de bienvenida */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'first',
            flexDirection: 'column',
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontSize: '28px',
              fontWeight: '500',
            }}
          >
            Bienvenido a la plataforma{' '}
            <b>Sistema de Seguimiento al Aprendiz en Etapa Práctica - SAEP</b>
          </Typography>
        </Box>

        {/* Ícono o imagen decorativa */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            padding: '20px',
          }}
        >
          {/* Si prefieres una imagen, reemplaza el SchoolIcon por una etiqueta <img /> */}
          <SchoolIcon sx={{ fontSize: 70, color: '#1976d2' }} />
          {/* Ejemplo con imagen: */}
          {/* <img src="/ruta/logo.png" alt="Logo" style={{ height: 60 }} /> */}
        </Box>
      </Box>

      <TablaViewGrid
        data={fichas}
        gridOptions={{ title: 'numeroFicha', subtitle: 'nombrePrograma' }}
        dataException={['idFicha', 'estadoFicha', 'idInstructor']}
        selectedValue={'idFicha'}
        header={[
          'Numero ficha',
          'Nombre programa',
          'Termino programa',
          'Inicio etapa productiva',
          'Fin etapa productiva',
        ]}
        actionAdd={{ title: 'Crear Ficha', onAction: () => {} }}
      />
      {
        <FormCrearFicha
          onClose={handleCloseCrearFicha}
          open={openCrearFicha}
          onSave={handleNuevaFicha}
        />
      }
    </Box>
  );
};

export default AprendizFichas;
