import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

const colors = [
  "#39A900", // verde
  "#007832", // verde calor
  "#00304D", // azul
  "#50E5F9", // azul claro
  "#71277A", // morado
  "#FDC300", // amarillo

  "#1C1B1F", // color principal del texto
  "#828282", // texto deshabilitado
  "#EC221F", // color de error aplicado a texto

  "#F7F7F7", // blanco_paper
  "#FFFFFF", // blanco

  "#E0E0E0", // bordes

  "#000", // black
  "#FFFFFF", // blanco
  //Por default
  "#1976d2",
  "#42a5f5",
  "#1565c0",
  "#fff",
];

const ColorBox = styled(Box)(({ color }) => ({
  width: "400px",
  height: "400px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color,
  color: "#ffffff",
  fontWeight: "bold",
}));

const TestColors = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, 400px)"
      gap={2}
      p={2}
    >
      {colors.map((color, index) => (
        <ColorBox key={index} color={color}>
          <Typography variant="body1">Color: {color}</Typography>
        </ColorBox>
      ))}
      {colors.map((color, index) => (
        <Typography key={index} style={{ color }}>
          Texto en color: {color}
        </Typography>
      ))}
    </Box>
  );
};

export default TestColors;
