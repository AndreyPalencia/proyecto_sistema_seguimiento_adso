import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

/**
 * `CustomAppBar`
 * Estiliza el AppBar para que no tenga sombra y use el fondo del tema.
 * Se centra verticalmente su contenido.
 */
export const CustomAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none', // Elimina la sombra predeterminada
  backgroundColor: theme.palette.background.default, // Usa el color de fondo del tema
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1, 0.2), // Espaciado dinámico
}));

/**
 * `HeaderBox`
 * 
 * Contenedor de elementos dentro del Header.
 * Permite distribuir los componentes al final del AppBar.
 */
export const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end', // Asegura que los elementos vayan al extremo derecho
  gap: theme.spacing(2), // Espaciado dinámico basado en el tema
  flexGrow: 1, // Permite que ocupe el espacio restante
}));

/**
 * Botón con estilos personalizados para el encabezado.
 * Se adapta a los colores del tema y cambia en hover.
 */
export const ButtonHeader = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, // Usa el color secundario del tema
  color: theme.palette.getContrastText(theme.palette.secondary.main), // Asegura contraste de color
  '&:hover': {
    backgroundColor: theme.palette.primary.main, // Usa una variación más oscura en hover
  },
  textTransform: 'none', // Evita que el texto se convierta en mayúsculas
  padding: theme.spacing(1, 2), // Espaciado uniforme
  borderRadius: theme.shape.borderRadius, // Usa el radio de borde predeterminado del tema
}));
