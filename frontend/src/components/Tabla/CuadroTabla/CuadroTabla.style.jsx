import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

/**
 * `GridContainer`
 * Contenedor principal del grid con espaciado, fondo y bordes redondeados.
 */
export const GridContainer = styled((Grid))({
  gap: "20px",
  padding: "10px",
  borderRadius: "15px",
  backgroundColor: '#F7F7F7'
});

/**
 * `GridItem`
 * Elemento individual dentro del grid con estilos de tarjeta y efecto hover.
 */
export const GridItem = styled("div")({
  backgroundColor: "#fff",
  height: '250px',
  flexWrap: 'wrap',
  padding: "15px 10px",
  borderRadius: "8px",
  border: "1px solid #e0e0e0",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
  display: 'flex',
  flexDirection: 'column',
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
});

/**
 * `ButtonGroup`
 * Contenedor para agrupar botones con alineación centrada y separación uniforme.
 */
export const ButtonGroup = styled("div")({
  display: "flex",
  justifyContent: "center",
  gap: "3px",
  marginTop: "10px"
});
