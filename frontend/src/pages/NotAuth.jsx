import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useNavigate } from 'react-router-dom';

/**
 * Componente NotAuth
 * Este componente se utiliza para mostrar un mensaje de "Acceso Denegado" a los usuarios
 * que no tienen los permisos necesarios para ver una página en particular.
 * Proporciona un botón que permite a los usuarios regresar a la página anterior.
  *
 * @returns {JSX.Element} La página renderizada de "Acceso Denegado" con un botón para regresar.
 */
const NotAuth = () => {
  //Hook de navegación para redirigir a otras rutas
  const navigate = useNavigate();

  //Función manejadora para regresar a la página anterior
  const handleGoBack = () => {
    navigate(-1); //Regresa a la página anterior en el historial del navegador
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box>
        <LockPersonIcon sx={{ fontSize: 100, color: 'warning.main' }} />
        <Typography variant="h4" sx={{ mt: 2 }}>
          Acceso Denegado
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>
          No tienes permisos para ver esta página.
        </Typography>
        <Button variant="contained" color="warning" onClick={handleGoBack}>
          Volver
        </Button>
      </Box>
    </Container>
  );
};

export default NotAuth;
