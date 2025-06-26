import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';

import { Box, Typography } from '@mui/material';

import { obtenerUsuario, modificarUsuario } from '../services/Usuarios';

//import InformationPanelFile from '../components/Info/InformationPanelField';
import InformationPanelFirma from '../components/Info/InformationPanelFirma';
import InfoCard from '../components/Info/InfoCard/InfoCard';
import InformationPanel from '../components/Info/InformationPanel';
import SectionInfo from '../components/Info/SectionInfo/SectionInfo';
import FormCambiarPassword from '../components/Forms/FormPassWord/FormCambiarPassword';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useLocation, useParams } from 'react-router-dom';

/**
 * `UsuarioDetalles`
 *
 * Componente que muestra los detalles de un usuario específico, incluyendo
 * su información básica, de contacto y firma. Además, permite actualizar los datos
 * del usuario en la base de datos.
 *
 * @example
 * // Uso básico del componente FichaDetalles
 * <FichaDetalles />
 *
 * @returns {JSX.Element} Retorna el componente con la información detallada del usuario.
 *
 * Nota: No se definido aun como se tratra la contraseña, por lo que se muestra como '.........'
 */
const UsuarioDetalles = () => {
  //Obtemos el idUsuario de la ruta
  const { idUsuario: idAuth, roleUsuario } = useAuth();

  const { idAprendizAdmin, idInstructorAdmin } = useParams();

  const location = useLocation();

  // Detectar si estamos viendo otro perfil (como admin)
  const isAdminViewingOtherUser =
    roleUsuario === 'admin' && (idAprendizAdmin || idInstructorAdmin);

  const isPerfilPropio = location.pathname.endsWith('/info-usuario');

  // ID del usuario que se va a consultar
  const idUsuario = idInstructorAdmin || idAprendizAdmin || idAuth;

  //Estado para mostrar la información del aprendiz
  const [infoUsuario, setInfoUsuario] = useState(null);

  const [cambiarPassword, setCambiarPassword] = useState(false);

  const { showAlert } = useAlert();

  const isAprendiz = roleUsuario === 'aprendiz' ? true : false;
  const isAdmin = roleUsuario === 'admin' ? true : false;

  const handleCambiarPassword = () => setCambiarPassword((prev) => !prev);
  /**
   * Función asincrónica para obtener los datos del aprendiz.
   * Realiza una consulta a la API para obtener los datos del usuario.
   *
   * @returns {void}
   */
  const obtenerInfoUsuario = async () => {
    try {
      const response = await obtenerUsuario(idUsuario);
      setInfoUsuario(response);
      //console.log(response);
    } catch (error) {
      console.error('Error al obtener la ficha:', error);
      setInfoUsuario({});
    }
  };

  /**
   * Función para actualizar los datos del usuario en la base de datos.
   * Si se proporciona un archivo, se maneja con `FormData` para la actualización.
   *
   * @param {Object} updateUsuario - Objeto con los datos actualizados del usuario.
   * @returns {void}
   */
  const handleActualizacionInfoUsurio = async (updateUsuario) => {
    //console.log(updateUsuario);
    try {
      const aprendizActualizado = await modificarUsuario(
        idUsuario,
        updateUsuario
      );
      //console.log('actualizacion exitosa', aprendizActualizado);
      setInfoUsuario(aprendizActualizado);
      showAlert({
        message: 'Se actualizo de forma exitosa el la información del usuario.',
        serverity: 'info',
        variant: 'standard',
      });
      obtenerInfoUsuario();
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      showAlert({
        message: `Error al actulizar la información del Usuario. ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleActualizacionFirma = async (formFirma) => {
    try {
      // { archivo } = archivoFirma;
      const formData = new FormData();
      formData.append('archivo', formFirma.archivo);

      const respuesta = await modificarUsuario(idUsuario, formData);
      setInfoUsuario(respuesta);
      showAlert({
        message: 'La firma del usuario fue actualizada exitosamente.',
        severity: 'info',
        variant: 'standard',
      });
      obtenerInfoUsuario();
    } catch (error) {
      console.error('Error al actualizar la firma del usuario:', error);
      showAlert({
        message: `Error al actualizar la firma del usuario: ${error.message}`,
        severity: 'error',
      });
    }
  };

  //Efecto que se ejecuta al cargar el componente o cuando cambia el idUsuario.
  useEffect(() => {
    obtenerInfoUsuario();
  }, [idUsuario]);

  return (
    <Box component="main" className="box-main-info" sx={{ marginBottom: 2 }}>
      <Typography
        ccomponent="h2"
        variant="h5"
        className="typography-title-info"
        fontSize="28px"
        fontWeight="bold"
      >
        {isPerfilPropio
          ? 'Información de Usuario'
          : idAprendizAdmin
          ? 'Información del perfil aprendiz'
          : 'Información del perfil instructor'}
      </Typography>{' '}
      {isAdminViewingOtherUser && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
          Estás visualizando el perfil de un{' '}
          {idAprendizAdmin ? 'aprendiz' : 'instructor'} como administrador.
        </Typography>
      )}
      <SectionInfo
        titulo="Información del usuario"
        icono={<AccountCircleOutlinedIcon className="icon-section-info" />}
      >
        <InformationPanel
          name="nombre"
          titulo="Nombre del usuario"
          item={infoUsuario?.nombre}
          fetchUpdate={handleActualizacionInfoUsurio}
        />

        <InformationPanel
          name="apellido"
          titulo="Apellidos del usuario"
          item={infoUsuario?.apellido}
          fetchUpdate={handleActualizacionInfoUsurio}
        />

        <InformationPanel
          name="tipoDocumento"
          tag="select"
          titulo="Tipo de documento"
          item={infoUsuario?.tipoDocumento}
          disableModal={isAprendiz}
          menuOpciones={[
            { label: 'Cédula de Ciudadanía', value: 'CC' },
            { label: 'Tarjeta de Identidad', value: 'TI' },
            { label: 'Cédula de Extranjería', value: 'CE' },
            { label: 'PEP', value: 'PEP' },
            { label: 'PPT', value: 'PPT' },
          ]}
          fetchUpdate={handleActualizacionInfoUsurio}
        />

        <InformationPanel
          disableModal={isAprendiz}
          name="numeroDocumento"
          titulo="Documento del usuario"
          item={infoUsuario?.numeroDocumento}
          type="number"
          fetchUpdate={handleActualizacionInfoUsurio}
        />
        <InfoCard
          titulo="Constraseña"
          item={'..................'}
          onToggleDialog={handleCambiarPassword}
          isLast
        />
      </SectionInfo>
      <SectionInfo
        titulo="Información de contacto"
        icono={<AlternateEmailIcon className="icon-section-info" />}
      >
        <InformationPanel
          name="telefono"
          titulo="Telefono"
          item={infoUsuario?.telefono}
          type="number"
          fetchUpdate={handleActualizacionInfoUsurio}
        />

        <InformationPanel
          name="correoElectronico"
          titulo="Correo Electrónico"
          item={infoUsuario?.correoElectronico}
          isLast={true}
          fetchUpdate={handleActualizacionInfoUsurio}
        />
      </SectionInfo>
      <SectionInfo
        titulo="Firma"
        icono={<BorderColorIcon className="icon-section-info" />}
      >

        <InformationPanelFirma
          name="firma"
          titulo="Firma"
          item={infoUsuario?.firma}
          fetchUpdate={handleActualizacionFirma}
        />
      </SectionInfo>
      <SectionInfo
        titulo="Estado usuario"
        icono={
          infoUsuario?.estadoUsuario == 1 ? (
            <CheckCircleOutlineIcon
              className="icon-section-info"
              sx={{ color: 'green' }}
            />
          ) : (
            <HighlightOffOutlinedIcon
              className="icon-section-info"
              sx={{ color: 'red' }}
            />
          )
        }
      >
        <InformationPanel
          name="estadoUsuario"
          tag="select"
          titulo="Estado Usuario"
          disableModal={!isAdmin}
          item={infoUsuario?.estadoUsuario == 1 ? 'Activo' : 'Inactivo'}
          menuOpciones={['Activo', 'Inactivo']}
          isArrayOptions={true}
          isLast={true}
          fetchUpdate={handleActualizacionInfoUsurio}
        />
      </SectionInfo>
      {cambiarPassword && (
        <FormCambiarPassword
          open={cambiarPassword}
          onClose={handleCambiarPassword}
        />
      )}
    </Box>
  );
};

export default UsuarioDetalles;
