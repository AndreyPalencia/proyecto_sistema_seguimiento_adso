import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, ButtonGroup } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const NotFound = () => {
  //Hook de navegación para redirigir a otras rutas
  const navigate = useNavigate();
  //Obtenemos el idUsuario y roleUsuario del contexto de autenticación
  const { idUsuario, roleUsuario } = useAuth();

  //Función manejadora para regresar al inicio (comentada temporalmente)
  const handleGoHome = () => {
    if (roleUsuario === 'admin') {
      navigate(`/${roleUsuario}`);
    } else if (idUsuario && roleUsuario) {
      navigate(`/${roleUsuario}/${idUsuario}`); // Redirige a la página de inicio
    } else {
      navigate('/auth/login'); // Redirige a la página de inicio
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Redirige a la página de inicio
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box>
        <SentimentVeryDissatisfiedIcon
          sx={{ fontSize: 100, color: 'primary.main' }}
        />
        <Typography variant="h2" sx={{ mt: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </Typography>
        {idUsuario && roleUsuario ? (
          <ButtonGroup variant="text" sx={{ gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleGoHome}>
              Volver al inicio
            </Button>
            <Button variant="contained" color="primary" onClick={handleGoBack}>
              Volver a la vista anterior
            </Button>
          </ButtonGroup>
        ) : (
          <Button variant="contained" color="primary" onClick={handleGoHome}>
            Iniciar sesión
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default NotFound;
