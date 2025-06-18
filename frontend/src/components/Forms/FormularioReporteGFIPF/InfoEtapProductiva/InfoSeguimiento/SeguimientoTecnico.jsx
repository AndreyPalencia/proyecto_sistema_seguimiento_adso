import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Divider,
} from '@mui/material';

import BooleanCheckboxSelector from '../../../../FormFields/BoolenCheckboxSelector';
import TextAreaAutoSizeField from '../../../../FormFields/TextAreaAutoSizeField';
import TextAreaField from '../../../../FormFields/TextAreaField';

import { formatoSegumientoTecnico } from './FormatoSeguimiento';
import { useEffect } from 'react';

const SeguimientoTecnico = ({ control, setValue, idEdit }) => {
  useEffect(() => {
    if (!idEdit) {
      setValue('infoSeguimiento.observacionesAprendiz', undefined);
      setValue('infoSeguimiento.observacionesEnteConformador', undefined);
    }
  }, [setValue, idEdit]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 'bold', marginBottom: 2 }}
      >
        SEGUIMIENTO ETAPA PRODUCTIVA: FACTORES TÉCNICOS
      </Typography>

      <TableContainer component={Paper}>
        {/* <Typography variant="subtitle2" sx={{ fontWeight: 'bold', margin: 2 }}>
          FACTORES ACTITUDINALES Y COMPORTAMENTALES
        </Typography> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>VARIABLE</strong>
              </TableCell>
              <TableCell>
                <strong>DESCRIPCIÓN</strong>
              </TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '24px',
                  }}
                >
                  <Box>
                    <strong>Satisfactorio</strong>
                  </Box>
                  <Box>
                    <strong>Por mejorar</strong>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <strong>Observación</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formatoSegumientoTecnico.map((row, index) => {
              const keys = Object.keys(row.referencia);
              const checkKey = keys.find(
                (k) => typeof row.referencia[k] === 'boolean'
              );
              const obsKey = keys.find(
                (k) => typeof row.referencia[k] === 'string'
              );

              // Obtén la parte del nombre de la variable (ej: 'relacionesInterpersonales')
              // const variableName =
              //   row.referencia[checkKey] !== undefined
              //     ? checkKey
              //     : obsKey.replace('Observacion', '');

              return (
                <TableRow key={index}>
                  <TableCell>{row.variable}</TableCell>
                  <TableCell>{row.descripcion || 'Sin descripción'}</TableCell>
                  <TableCell>
                    {checkKey && (
                      <BooleanCheckboxSelector
                        name={`infoSeguimiento.factoresEvaluacion.tecnicos.${checkKey}`}
                        control={control}
                        defaultValue={row.referencia[checkKey]}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {obsKey && (
                      <TextAreaAutoSizeField
                        name={`infoSeguimiento.factoresEvaluacion.tecnicos.${obsKey}`}
                        control={control}
                        //defaultValue={row.referencia[obsKey]}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Typography variant="body1" sx={{ fontWeight: 'bold', margin: 2 }}>
          Observaciones:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '0 10px',
            mb: 4,
            gap: 2, // adds spacing between the two text areas
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TextAreaField
              name={`infoSeguimiento.observacionesAprendiz`}
              control={control}
              label="Observacion del Aprendiz"
              minRows={3}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextAreaField
              name={`infoSeguimiento.observacionesEnteConformador`}
              control={control}
              label="Observacion del Ente conformador"
              minRows={3}
              fullWidth
            />
          </Box>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default SeguimientoTecnico;
