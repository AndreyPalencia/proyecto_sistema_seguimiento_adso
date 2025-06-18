import { useEffect } from 'react';

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
} from '@mui/material';

import BooleanCheckboxSelector from '../../../../FormFields/BoolenCheckboxSelector';
import TextAreaAutoSizeField from '../../../../FormFields/TextAreaAutoSizeField';

import { formatoSegumientoActitudinales } from './FormatoSeguimiento';
import DateFieldColombia from '../../../../FormFields/DateFieldColombia';
import SelectField from '../../../../FormFields/SelectField';

import { getTodayUtcFromBogota } from '../../../../../utils/utils';

const SeguimientoActitudinalesComportamentales = ({ control, setValue, isEdit = false }) => {
  useEffect(() => {
    if(!isEdit) {
      setValue('infoSeguimiento.infoSeguimientoInforme.tipoInforme', false);
      const currentDate = getTodayUtcFromBogota();
      setValue(
        'infoSeguimiento.infoSeguimientoInforme.inicioPeriodoEvaluado',
        currentDate
      );
      setValue(
        'infoSeguimiento.infoSeguimientoInforme.finalizacionPeriodoEvaluado',
        currentDate
      );
    }
  }, [setValue, isEdit]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 'bold', marginBottom: 2 }}
      >
        SEGUIMIENTO ETAPA PRODUCTIVA: FACTORES ACTITUDINALES Y COMPORTAMENTALES
      </Typography>

      <TableContainer component={Paper}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', margin: 2 }}>
          Información Sobre el informe:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 10px',
            mb: 4,
          }}
        >
          <Box sx={{ width: '300px' }}>
            <SelectField
              name={`infoSeguimiento.infoSeguimientoInforme.tipoInforme`}
              control={control}
              label="Tipo Informe"
              defaultValue={'false'}
              menuOptions={[
                {
                  label: 'Parcial',
                  value: false,
                },
                {
                  label: 'Final',
                  value: true,
                },
              ]}
            />
          </Box>
          <Box sx={{ width: '300px' }}>
            <DateFieldColombia
              name={`infoSeguimiento.infoSeguimientoInforme.inicioPeriodoEvaluado`}
              control={control}
              label="Inicio Periodo Evaluado"
              required
              inputLabel
            />
          </Box>

          <Box sx={{ width: '300px' }}>
            <DateFieldColombia
              name={`infoSeguimiento.infoSeguimientoInforme.finalizacionPeriodoEvaluado`}
              control={control}
              label="Finalizacion Periodo Evaluado"
              required
              inputLabel
            />
          </Box>
        </Box>
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
            {formatoSegumientoActitudinales.map((row, index) => {
              const keys = Object.keys(row.referencia);
              const checkKey = keys.find(
                (k) => typeof row.referencia[k] === 'boolean'
              );
              const obsKey = keys.find(
                (k) => typeof row.referencia[k] === 'string'
              );

              // Obtén la parte del nombre de la variable (ej: 'relacionesInterpersonales')
              const variableName =
                row.referencia[checkKey] !== undefined
                  ? checkKey
                  : obsKey.replace('Observacion', '');

              return (
                <TableRow key={index}>
                  <TableCell>{row.variable}</TableCell>
                  <TableCell>{row.descripcion || 'Sin descripción'}</TableCell>
                  <TableCell>
                    {checkKey && (
                      <BooleanCheckboxSelector
                        name={`infoSeguimiento.factoresEvaluacion.actitudinalesComportamentales.${checkKey}`}
                        control={control}
                        defaultValue={row.referencia[checkKey]}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {obsKey && (
                      <TextAreaAutoSizeField
                        name={`infoSeguimiento.factoresEvaluacion.actitudinalesComportamentales.${obsKey}`}
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
      </TableContainer>
    </Box>
  );
};

export default SeguimientoActitudinalesComportamentales;
