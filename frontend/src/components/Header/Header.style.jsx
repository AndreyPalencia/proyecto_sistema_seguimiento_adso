import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";

// Personalización de estilos para el AppBar
export const CustomAppBar = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  background: theme.palette.background.default,
  justifyContent: "center",
}));

// Personalización de Box para layout
export const HeaderBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  gap: "10px",
  flexGrow: 1,
}));

// Personalización de Button para el hover
export const ButtonHeader = styled(Button)(({ theme }) => ({
  background: theme.palette.secondary.main,
  "&:hover": {
    background: "#41657B",
  },
}));
