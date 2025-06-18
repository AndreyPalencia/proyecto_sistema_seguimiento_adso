import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Estilo para el título de la información.
 * Aumenta el tamaño de la fuente y pone el texto en negrita.
 */
export const TypographyTitleInfo = styled(Typography)(() => ({
  fontWeight: 'bold',
  fontSize: '30px',
  textAlign: 'start',
}));

/**
 * Estilos para el contenedor main.
 */

export const BoxMainInfo = styled(Box)(() => ({
  padding: '10px 10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}));