import { useState } from 'react';
import FirmaUsuario from './FirmaUsuario';
import EditInfoModalFile from './EditInfoModal/EditInfoModalFile';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

/**
 * Muestra la firma del usuario y permite editarla haciendo clic sobre ella.
 *
 * @param {Object} props
 * @param {string} props.name - Clave del campo (ej: 'firma')
 * @param {string} props.titulo - Título que se muestra sobre la firma
 * @param {string} props.item - Nombre del archivo de firma (ej: firma1.png)
 * @param {Function} props.fetchUpdate - Función para subir/actualizar la firma
 * @param {boolean} [props.disableClick=false] - Si se desactiva la edición
 */
const InformationPanelFirma = ({
  name,
  titulo,
  item,
  fetchUpdate,
  disableClick = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleModalOpen = () => {
    if (!disableClick) setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <Box
        onClick={handleModalOpen}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          cursor: disableClick ? 'default' : 'pointer',
          padding: theme.spacing(isMobile ? 2 : isTablet ? 2.5 : 2),
          bgcolor: '#fff',
          borderRadius: theme.spacing(1.5),
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
          width: {
            xs: '100%',
            sm: 'fit-content',
            maxWidth: {
              xs: '100%',
              sm: '400px',
              md: '500px',
            },
          },
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': disableClick
            ? {}
            : {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
                backgroundColor: '#f9f9f9',
              },
          minHeight: {
            xs: 48,
            sm: 'auto',
          },
          margin: 2,
        }}
      >
        {/* Contenedor para la imagen con mejor control */}
        <Box
          sx={{
            width: '100%',
            maxWidth: {
              xs: '100%',
              sm: '300px',
              md: '350px',
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // Contenedor con aspectRatio para mantener proporciones
            minHeight: {
              xs: '80px',
              sm: '100px',
              md: '120px',
            },
            '& img': {
              maxWidth: '100%',
              maxHeight: {
                xs: '120px',
                sm: '150px',
                md: '180px',
              },
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 1,
              // Mejora la calidad en pantallas de alta densidad
              imageRendering: 'high-quality',
            },
          }}
        >
          {item?.trim() && <FirmaUsuario nombreArchivo={item} />}
        </Box>
      </Box>

      <EditInfoModalFile
        name={name}
        type="file"
        tag="file"
        titulo={titulo}
        item={item}
        disableClick={disableClick}
        isOpen={isModalOpen}
        onClose={handleModalOpen}
        onSave={fetchUpdate}
      />
    </>
  );
};

export default InformationPanelFirma;
