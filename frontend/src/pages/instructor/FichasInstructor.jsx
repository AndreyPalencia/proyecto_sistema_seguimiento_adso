import { useEffect, useState } from 'react';
import { useActionsButtonsContext } from '../../context/ActionsButtonsContext';
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { Typography } from '@mui/material';

import { TablaGridListSelect } from '../../components/Tabla/Tabla';

import { modificarEstadoFicha } from '../../services/Fichas';
import { useObtenerFichas } from '../../hook/fichas/useObtenerFichas';

import FormCrearFicha from '../../components/Forms/FormFicha/FormCrearFicha';
import FormMultipleReportesGFIPF from '../../components/Forms/FormMultipleReportesGFIPF/FormMultipleReportesGFIPF';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { TbReport } from 'react-icons/tb';

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
const FichasInstructor = () => {
  // Obtiene el ID del instructor desde los parámetros de la URL
  const { idInstructor, idInstructorAdmin } = useParams();

  let idInstructorConsultas = idInstructor || idInstructorAdmin;
  const { roleUsuario } = useAuth();

  // Hook de navegación para redirigir a otras rutas
  const navegacion = useNavigate();

  const { loading, fichas, refetchFichas } = useObtenerFichas(
    idInstructorConsultas
  );

  // Obtiene funciones del contexto para manejar botones de acción
  const { updateActionsButtons } = useActionsButtonsContext();

  const getFichaById = (id) => fichas.find((f) => f.idFicha === id);

  //Obtenemos del contexto de sidebar las fuciones de agregar vistas y el stack de vistas y los ids selecionados
  const { pushSidebarView, setIds, sidebarStack } = useSidebar();

  const [openCrearFicha, setOpenCrearFicha] = useState(false);
  const handleCloseCrearFicha = () => setOpenCrearFicha((prev) => !prev);

  const [openCrearReportesGFIPF, setOpenCrearReportesGFIPF] = useState(false);
  const handleCrearReportesGFIPF = () =>
    setOpenCrearReportesGFIPF((prev) => !prev);

  const handleNuevaFicha = async () => {
    await refetchFichas();
  };

  const handleStateFichaClick = async (valueCheck, idFicha) => {
    const ficha = getFichaById(idFicha);
    if (!ficha) return;

    const estado = {
      estadoFicha: valueCheck,
    };

    await modificarEstadoFicha(idFicha, estado);
    await refetchFichas();
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
      setIds('idFicha', fichaId); // Esto actualiza el aprendiz seleccionado
    }
  };

  /**
   * Array de objetos que representan los botones de acción para las fichas.
   * Cada botón tiene un ícono, color, posición, acción y tooltip.
   *
   * @type {Array}
   */
  const botonesFichas = [
    {
      icon: OpenInNewIcon,
      color: ' #39A900',
      position: 'left',
      action: (idFicha) => {
        if (roleUsuario === 'admin')
          navegacion(
            `/admin/rol/instructor/${idInstructorConsultas}/ficha/${idFicha}/aprendices`
          );
        else
          navegacion(
            `/instructor/${idInstructorConsultas}/ficha/${idFicha}/aprendices`
          );
        //handleClickAprendiz(idFicha); // Llama a la función para manejar el clic en el aprendiz
      },
      tooltip: 'Abrir',
      id: 'MainGrid',
    },
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: (idFicha) => {
        navegacion(
          `/instructor/${idInstructorConsultas}/ficha/${idFicha}/info`
        );
      },
      tooltip: 'Editar',
    },

    {
      id: 'estadoFicha',
      type: 'checkbox',
      action: handleStateFichaClick,
      tooltip: 'Archivar',
      otherTooltip: 'Activar',
      iconCheck: UnarchiveOutlinedIcon,
      checkedIcon: ArchiveOutlinedIcon,
    },
  ];

  /**
   * useEffect que se ejecuta cuando cambia el `idInstructor`.
   * Llama a `fetchFichas` para obtener las fichas y configura los botones de acción.
   */
  // useEffect(() => {
  //   obtenerFichas();
  //   updateActionsButtons(botones);
  // }, [idInstructor]);

  useEffect(() => {
    if (!loading && fichas?.length) {
      updateActionsButtons(botonesFichas);
    }
  }, [fichas, loading]);

  return (
    <>
      <Typography
        component="h1"
        variant="h5"
        fontWeight="600"
        sx={{ margin: '20px 0 5px 0' }}
      >
        Listado Fichas:
      </Typography>
      {!loading && (
        <TablaGridListSelect
          key={`${fichas.length}`}
          data={fichas || []}
          gridOptions={{ title: 'numeroFicha', subtitle: 'nombrePrograma' }}
          dataException={[
            'idFicha',
            'estadoFicha',
            'idInstructor',
            'fechaNotificacionEnvio',
          ]}
          selectedValue={'idFicha'}
          filters={{
            filter: { todas: '', activas: 1, archivadas: 0 },
            filterSearch: 'estadoFicha',
            defaultValuefilterSearch: 1,
          }}
          header={[
            'Número ficha',
            'Nombre programa',
            'Termino programa',
            'Inicio etapa productiva',
            'Fin etapa productiva',
          ]}
          buttonAction={[
            {
              title: 'Crear Ficha',
              onAction: handleCloseCrearFicha,
              icon: AddOutlinedIcon,
              size: 30,
            },
            {
              title: 'Generar GFPIF por Aprendices',
              onAction: handleCrearReportesGFIPF,
              size: 26,
              icon: TbReport,
              iconReact: true,
            },
          ]}
          initialValue={['estadoFicha']}
        />
      )}
      {
        <FormCrearFicha
          onClose={handleCloseCrearFicha}
          open={openCrearFicha}
          onSave={handleNuevaFicha}
        />
      }
      {
        <FormMultipleReportesGFIPF
          open={openCrearReportesGFIPF}
          onClose={handleCrearReportesGFIPF}
        />
      }
    </>
  );
};

export default FichasInstructor;
