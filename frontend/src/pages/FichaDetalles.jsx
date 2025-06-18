import { useEffect, useState } from 'react';
import { useAlert } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

import { Typography, Box } from '@mui/material';

import { obtenerUsuario } from '../services/Usuarios';
import { obtenerFichaById, modificarFicha } from '../services/Fichas';

import InformationPanel from '../components/Info/InformationPanel';
import SectionInfo from '../components/Info/SectionInfo/SectionInfo';

import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

/**
 * `FichaDetalles`
 *
 * Componente que muestra los detalles de una ficha específica, incluyendo
 * información general, estado, etapa productiva e información sobre el instructor.
 * Además, permite actualizar los datos de la ficha en la base de datos.
 *
 *
 * @returns {JSX.Element} - Retorna el componente con la información detallada de la ficha.
 */

const FichaDetalles = () => {
  //Obetemos el idFicha de la ruta
  const { idFicha } = useParams();
  //Estado para mostrar la información de la ficha
  const [ficha, setFicha] = useState({});
  //Estado para almacenar el nombre de instrucotr
  const [nombreInstructor, setNombreInstructor] = useState('Cargando...');

  const { roleUsuario } = useAuth();

  const isAdmin = roleUsuario === 'admin' ? false : true;
  const isAprendiz = roleUsuario === 'aprendiz' ? true : false;

  const { showAlert } = useAlert();

  /**
   * Función para consultar la ficha y el instructor de la ficha
   *
   * @returns {void}
   */
  const obtenerFichaYInstructor = async () => {
    try {
      //Realizamos la consutal por medio del servicio de Fichas y guardamos en setFicha
      const infoFicha = await obtenerFichaById(idFicha);
      setFicha(infoFicha); // Guardamos la ficha original
      //Obtener el nombre del instructor a cargo
      if (infoFicha.idInstructor) {
        //console.log('infoFicha.idInstructor', infoFicha.idInstructor);
        const instructorData = await obtenerUsuario(infoFicha.idInstructor);
        //console.log('instructorData', instructorData)
        const nombreInstructorData =
          `${instructorData.nombre} ${instructorData.apellido}` ||
          'No disponible';
        setNombreInstructor(nombreInstructorData);
      } else {
        setNombreInstructor('No asignado');
      }
    } catch (error) {
      console.error('Error al obtener la ficha:', error?.message);
      setNombreInstructor('Error al cargar');
    }
  };

  /**
   * Función para realizar la actualizacion de ficha en base de datos
   *
   * @param {Object} updatedFicha - Objeto con los datos actualizados de la ficha.
   * @returns {void}
   */
  const actualizarFichaEnBaseDeDatos = async (updatedFicha) => {
    try {
      const fichaActualizada = await modificarFicha(idFicha, updatedFicha); // Guardamos los cambios en el backend
      //console.log('Actualización exitosa!', fichaActualizada);
      setFicha(fichaActualizada); // Actualizamos el estado ficha con los datos guardados en el backend
      showAlert({
        message: 'Se actualizo con exito la información de la ficha.',
        severity: 'info',
        variant: 'standard',
      });
    } catch (error) {
      console.error('Error al actualizar la ficha:', error, updatedFicha);
      showAlert({
        message: `Error al actualizar la información de la ficha. ${error.message}`,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    obtenerFichaYInstructor();
  }, [idFicha]);

  return (
    <Box className="box-main-info" component="main">
      {/**Titulo General del FichaDetalles */}
      <Typography
        component="h2"
        variant="h5"
        className="typography-title-info"
        fontSize="30px"
        fontWeight="bold"
      >
        Información de ficha
      </Typography>

      {/**Sección de informacioón General de la ficha */}
      <SectionInfo
        titulo="Información de la ficha"
        icono={<DashboardOutlinedIcon className="icon-section-info" />}
      >
        <InformationPanel
          name="numeroFicha"
          type="number"
          titulo="Número de ficha"
          item={ficha.numeroFicha}
          fetchUpdate={actualizarFichaEnBaseDeDatos}
          disableModal={isAprendiz}
        />
        <InformationPanel
          name="nombrePrograma"
          titulo="Nombre del programa"
          item={ficha.nombrePrograma}
          fetchUpdate={actualizarFichaEnBaseDeDatos}
          disableModal={isAprendiz}
        />
        <InformationPanel
          name="terminoPrograma"
          tag="select"
          titulo="Término del programa"
          item={ficha.terminoPrograma}
          menuOpciones={[
            'Tecnologo',
            'Tecnico',
            'Auxiliar',
            'Operario',
            'Especializacion',
          ]}
          isArrayOptions
          inputLabel={true}
          fetchUpdate={actualizarFichaEnBaseDeDatos}
          disableModal={isAprendiz}
        />
        <InformationPanel
          name="estadoFicha"
          tag="select"
          titulo="Estado Ficha"
          inputLabel={true}
          item={ficha?.estadoFicha == 1 ? 'Activo' : 'Inactivo'}
          menuOpciones={['Activo', 'Inactivo']}
          isLast={true}
          isArrayOptions
          fetchUpdate={actualizarFichaEnBaseDeDatos}
          disableModal={isAprendiz}
        />
      </SectionInfo>

      {/**Sección de información Fecha Etapa Productiva*/}
      <SectionInfo
        titulo="Información etapa productiva"
        icono={<ApartmentOutlinedIcon className="icon-section-info" />}
      >
        <InformationPanel
          name="inicioEtapaProductiva"
          tag="date"
          titulo="Inicio etapa productiva"
          item={ficha.inicioEtapaProductiva}
          fetchUpdate={actualizarFichaEnBaseDeDatos}
          disableModal={isAprendiz}
        />
        <InformationPanel
          name="finEtapaProductiva"
          tag="date"
          titulo="Fin etapa productiva"
          item={ficha.finEtapaProductiva}
          isLast={true}
          fetchUpdate={actualizarFichaEnBaseDeDatos}
          disableModal={isAprendiz}
        />
      </SectionInfo>

      {/**Sección de información de instructor */}

      <SectionInfo
        titulo="Información del Instructor"
        icono={<PermIdentityOutlinedIcon className="icon-section-info" />}
      >
        <InformationPanel
          disableModal={isAdmin || isAprendiz}
          disableClick={isAdmin || isAprendiz}
          name="idInstructor"
          titulo="Instructor"
          item={nombreInstructor}
          isLast={true}
        />
      </SectionInfo>

      <SectionInfo
        titulo="Fecha notificación de envío documentos"
        icono={<PermIdentityOutlinedIcon className="icon-section-info" />}
      >
        <InformationPanel
          tag="date"
          disableModal={isAprendiz}
          disableClick={isAprendiz}
          name="fechaNotificacionEnvio"
          titulo="Fecha notificación envio de documentos"
          item={ficha.fechaNotificacionEnvio}
          isLast
          inputLabel
          fetchUpdate={actualizarFichaEnBaseDeDatos}
        />
      </SectionInfo>
    </Box>
  );
};

export default FichaDetalles;
