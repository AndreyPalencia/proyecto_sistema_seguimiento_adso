import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

import { Box, Typography } from '@mui/material';

import { obtenerUsuario, modificarUsuario } from '../../services/Usuarios';

import InformationPanel from '../../components/Info/InformationPanel';
import SectionInfo from '../../components/Info/SectionInfo/SectionInfo';
import InformationPanelFile from '../../components/Info/InformationPanelField';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';

/**
 * `AprendizDetalles`
 *
 * Componente que muestra los detalles de un aprendiz específico, incluyendo
 * su información personal, de contacto, firma y estado.
 * Además, permite actualizar los datos del aprendiz en la base de datos.
 *
 * @returns {JSX.Element} Retorna el componente con la información detallada del aprendiz.
 */
const AprendizDetalles = () => {
  //Obtenemos el id del aprendiz desde la URL
  const { idAprendiz } = useParams();
  //Estado para almacenar la información del aprendiz
  const [aprendiz, setAprendiz] = useState({});

  const { showAlert } = useAlert();

  const { roleUsuario } = useAuth();

  /**
   * Función asincrónica para obtener los datos del aprendiz desde la API.
   *
   * @returns {void}
   */
  const obtenerDatosAprendiz = async () => {
    try {
      const response = await obtenerUsuario(idAprendiz);
      setAprendiz(response);
      //console.log(response);
    } catch (error) {
      console.error('Error al obtener la ficha:', error);
      setAprendiz('error al cargar');
    }
  };

  /**
   * Función asincrónica para actualizar los datos del aprendiz en la base de datos.
   * Si el objeto contiene un archivo, se maneja con FormData para la actualización.
   *
   * @param {Object} updatedAprendiz - Objeto con los datos actualizados del aprendiz.
   * @returns {void}
   */
  const fetchUpdateAprendiz = async (updatedAprendiz) => {
    try {
      //Cualquier otro dato se actualiza despues del if validación
      const aprendizActualizado = await modificarUsuario(
        idAprendiz,
        updatedAprendiz
      );
      //console.log('actualizacion exitosa', aprendizActualizado);
      setAprendiz(aprendizActualizado);
      showAlert({
        message:
          'Se actualizo de forma exitosa el la información del aprendiz.',
        serverity: 'info',
        variant: 'standard',
      });
      obtenerDatosAprendiz();
    } catch (error) {
      console.error('Error al actualizar el aprendiz:', error, updatedAprendiz);
      showAlert({
        message: `Ocurrio un error al actualizar la información del aprendiz. ${error.message}`,
        serverity: 'error',
        variant: 'standard',
      });
    }
  };

  const handleActualizacionFirma = async (formFirma) => {
    try {
      // { archivo } = archivoFirma;
      const formData = new FormData();
      formData.append('archivo', formFirma.archivo);

      const respuesta = await modificarUsuario(idAprendiz, formData);
      setAprendiz(respuesta);
      showAlert({
        message: 'Se actualizo de forma exitosa la firma del aprendiz.',
        serverity: 'info',
        variant: 'standard',
      });
      obtenerDatosAprendiz();
    } catch (error) {
      console.error('Error al actualizar la firma del aprendiz:', error);
      showAlert({
        message: `Error al actualizar la firma del aprendiz: ${error.message}`,
        severity: 'error',
      });
    }
  };

  //useEffect que se ejecuta cuando cambia el idAprendiz
  useEffect(() => {
    obtenerDatosAprendiz();
  }, [idAprendiz]);

  return (
    <Box component="main" className="box-main-info" sx={{ marginBottom: 2 }}>
      <Typography
        ccomponent="h2"
        variant="h5"
        className="typography-title-info"
        fontSize="28px"
        fontWeight="bold"
      >
        Información de Aprendiz
      </Typography>
      <SectionInfo
        titulo="Información del Aprendiz"
        icono={<AccountCircleOutlinedIcon className="icon-section-info" />}
      >
        <InformationPanel
          name="nombre"
          titulo="Nombre del aprendiz"
          item={aprendiz.nombre}
          fetchUpdate={fetchUpdateAprendiz}
        />

        <InformationPanel
          name="apellido"
          titulo="Apellidos del aprendiz"
          item={aprendiz.apellido}
          fetchUpdate={fetchUpdateAprendiz}
        />

        <InformationPanel
          name="tipoDocumento"
          tag="select"
          titulo="Tipo de documento"
          item={aprendiz.tipoDocumento}
          menuOpciones={[
            { label: 'Cédula de Ciudadanía', value: 'CC' },
            { label: 'Tarjeta de Identidad', value: 'TI' },
            { label: 'Cédula de Extranjería', value: 'CE' },
            { label: 'PEP', value: 'PEP' },
            { label: 'PPT', value: 'PPT' },
          ]}
          fetchUpdate={fetchUpdateAprendiz}
        />

        <InformationPanel
          name="numeroDocumento"
          titulo="Documento del aprendiz"
          item={aprendiz.numeroDocumento}
          isLast={true}
          type="number"
          fetchUpdate={fetchUpdateAprendiz}
        />
      </SectionInfo>

      <SectionInfo
        titulo="Informacion de Contacto"
        icono={<AlternateEmailIcon className="icon-section-info" />}
      >
        <InformationPanel
          name="telefono"
          titulo="Telefono"
          item={aprendiz.telefono}
          type="number"
          fetchUpdate={fetchUpdateAprendiz}
        />

        <InformationPanel
          name="correoElectronico"
          titulo="Correo electronico"
          item={aprendiz.correoElectronico}
          isLast={true}
          fetchUpdate={fetchUpdateAprendiz}
        />
      </SectionInfo>

      <SectionInfo
        titulo="Firma"
        icono={<BorderColorIcon className="icon-section-info" />}
      >
        <InformationPanelFile
          name="firma"
          titulo="Firma"
          item={aprendiz.firma}
          isLast={true}
          fetchUpdate={handleActualizacionFirma}
        />
      </SectionInfo>

      <SectionInfo
        titulo="Estado Aprendiz"
        icono={
          aprendiz.estadoUsuario == 1 ? (
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
          disableModal={roleUsuario !== 'admin'}
          titulo="Estado Usuario"
          item={aprendiz.estadoUsuario == 1 ? 'Activo' : 'Inactivo'}
          menuOpciones={['Activo', 'Inactivo']}
          isArrayOptions={true}
          isLast={true}
          fetchUpdate={fetchUpdateAprendiz}
        />
      </SectionInfo>
    </Box>
  );
};

export default AprendizDetalles;
