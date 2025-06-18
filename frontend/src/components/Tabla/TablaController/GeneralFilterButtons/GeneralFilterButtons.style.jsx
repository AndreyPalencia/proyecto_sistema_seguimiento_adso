import { Button, styled, Box } from '@mui/material';

// Estilo para BoxFilter (contiene los botones)
export const BoxFilter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  gap: '10px',
  backgroundColor: 'transparent',
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: '8px',
  padding: '7px 7px',
  margin: '10px 0px 10px 0px',
}));

// Estilo para ButtonFilter (botones individuales)
export const ButtonFilter = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isSelected', // No pasar la prop 'isSelected'
})(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? '#ebebec' : 'transparent', // Fondo blanco si está seleccionado, gris si no
  color: isSelected ? 'green' : ' #000', // Letras verdes si está seleccionado, negras si no
  padding: '4px 8px',
  border: 'none',
  borderRadius: '6px',
  fontWeight: '600',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background-color 0.2s ease-in-out',
  textTransform: 'capitalize',
  '&:hover': {
    backgroundColor: isSelected ? '#ebebec' : '#ebebec', // Efecto hover para ambos casos
  },
  '&:active': {
    backgroundColor: isSelected ? '#ddd' : '#ebebec', // Efecto cuando se hace clic
  },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
