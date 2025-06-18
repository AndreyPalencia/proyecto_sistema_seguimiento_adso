import { Button, styled, Box, IconButton } from '@mui/material';

export const BoxFilter = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1px',
  justifyContent: 'center',
  alignItems: 'center',
  width: '140px',
  backgroundColor: 'transparent',
  padding: '5px',
  borderRadius: '8px',
  border: '1px solid #E0E0E0',
}));

export const BoxAgregar = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1px',
  justifyContent: 'center',
  alignItems: 'center',
  width: '140px',
  padding: '5px',
}));

export const ViewChangeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isTablaList',
})(({ theme, isTablaList }) => ({
  backgroundColor: isTablaList ? '#ebebec' : 'transparent',
  padding: '0px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  width: '20px',
  height: '35px',
}));

// export const IconButtonAdd = styled(IconButton)(({ theme }) => ({
//   backgroundColor: 'transparent',
//   color: 'rgba(28, 27, 31, 0.42)', // gris suave
//   fontSize: '1rem', // tamaño del botón (si afecta)
//   '& .MuiSvgIcon-root': {
//     fontSize: '30px', // tamaño del ícono
//   },
//   '&:hover .MuiSvgIcon-root': {
//     color: theme.palette.primary.main, // color primario en hover
//   },
// }));
