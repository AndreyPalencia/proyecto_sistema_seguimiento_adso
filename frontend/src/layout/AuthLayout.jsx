import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';

/**
 * Componente `AuthLayout`
 *
 * Este componente define una estructura de diseño para la autenticación, donde se muestra un formulario y una imagen de fondo.
 * Dependiendo del tamaño de pantalla, el formulario y la imagen se ajustan en su disposición.
 *
 * @returns {JSX.Element} Componente con la disposición de formulario e imagen de fondo.
 */
const AuthLayout = () => {
  return (
    <Container
      maxWidth={false} // Ocupa toda la pantalla
      disableGutters
      sx={{
        height: '100vh',
        display: 'grid',
        overflow: 'hidden',
        position: 'relative',
        gridTemplateColumns: {
          xs: '1fr', // Pantallas pequeñas, ocupa todo el ancho
          sm: '1fr', // Igual en tabletas
          md: '40vw 60vw', // En pantallas medianas/grandes, divide en 40% y 60%
        },
      }}
    >
      {/* SECCIÓN DEL FORMULARIO */}
      <Grid
        container
        sx={{
          height: '100%',
          padding: '10px 26px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          component="article"
          sx={{
            width: {
              xs: '100%',
              sm: '80%',
              md: '80%',
            },
            height: 'auto',
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: { xs: '0px 4px 10px rgba(0, 0, 0, 0.2)', md: 'none' },
          }}
        >
          <Outlet /> {/* Aquí se renderiza el Login u otros componentes */}
        </Box>
      </Grid>

      {/* SECCIÓN DE IMAGEN */}
      <Grid
        container
        sx={{
          position: { xs: 'absolute', md: 'relative' },
          height: '100%',
          display: 'flex',
          flexGrow: 1,
          zIndex: { xs: -1, md: 1 },
          backgroundImage:
            'linear-gradient(0deg, rgba(33, 44, 77, 0.5) 0%, rgba(33, 44, 77, 0.5) 100%)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            //borderRadius: '24px 0px 0px 24px',
          }}
        >
          <img
            src="/sena-aprendizaje.jpg"
            alt="Fondo de autenticación"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Grid>
    </Container>
  );
};

export default AuthLayout;
