import { createTheme } from "@mui/material/styles";

/*
* createTheme define un tema personalizado con colores principales y secundarios.
* ThemeProvider: aplica ese tema a todos los componentes que se encuentran dentro de él.
*/

const theme = createTheme({
  palette: {
    primary: {
      main: '#39A900', // Verde principal
      dark: '#007832', // Verde oscuro
      light: '#50E5F9', // Azul claro
      contrastText: '#FFFFFF', // Texto en blanco
    },
    secondary: {
      main: '#00304D', // Azul principal
      dark: '#71277A', // Morado oscuro
      light: '#FDC300', // Amarillo claro
      contrastText: '#FFFFFF', // Texto en blanco
    },
    error: {
      main: '#EC221F', // Rojo de error
    },
    text: {
      primary: '#1C1B1F', // Color principal del texto
      disabled: '#828282', // Texto deshabilitado
    },
    background: {
      default: '#FFFFFF', // Blanco
      paper: '#F7F7F7', // Blanco papel
      black: '#000000', // Negro
    },
    divider: '#E0E0E0', // Color de los divisores
  },
  typography: {
    allVariants: {
      fontFamily: 'Work Sans, sans-serif, Arial, Roboto',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Desactiva el efecto ripple en todos los botones
        disableElevation: true, // Desactiva la sombra en todos los botones
      },
    },
  },
});

export default theme;

