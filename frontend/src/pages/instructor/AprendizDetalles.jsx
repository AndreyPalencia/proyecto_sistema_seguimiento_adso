import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

import { Box, Typography } from '@mui/material';

import { obtenerUsuario } from '../../services/Usuarios';

import InformationPanel from '../../components/Info/InformationPanel';
import SectionInfo from '../../components/Info/SectionInfo/SectionInfo';
import InformationPanelFile from '../../components/Info/InformationPanelField';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';

import { useModificarUsuario } from '../../hook/usuarios/useModificarUsuario';

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
  const { idAprendiz } = useParams();
  const [aprendiz, setAprendiz] = useState({});
  const { roleUsuario } = useAuth();
  const { showAlert } = useAlert();
  const { editarUsuario, loading } = useModificarUsuario();

  // Obtener datos del aprendiz
  const obtenerDatosAprendiz = async () => {
    try {
      const response = await obtenerUsuario(idAprendiz);
      setAprendiz(response);
    } catch (error) {
      console.error('Error al obtener el aprendiz:', error);
      setAprendiz('error al cargar');
    }
  };

  // Actualización genérica del aprendiz
  const fetchUpdateAprendiz = async (updatedAprendiz) => {
    await editarUsuario(idAprendiz, updatedAprendiz);
    await obtenerDatosAprendiz();
  };

  // Actualización específica para la firma
  const handleActualizacionFirma = async (formFirma) => {
    const formData = new FormData();
    formData.append('archivo', formFirma.archivo);
    await editarUsuario(idAprendiz, formData);
    await obtenerDatosAprendiz();
  };

  useEffect(() => {
    obtenerDatosAprendiz();
  }, [idAprendiz]);

  return (
    <Box component="main" className="box-main-info" sx={{ marginBottom: 2 }}>
      <Typography
        component="h2"
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
          titulo="Teléfono"
          item={aprendiz.telefono}
          type="number"
          fetchUpdate={fetchUpdateAprendiz}
        />

        <InformationPanel
          name="correoElectronico"
          titulo="Correo electrónico"
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
