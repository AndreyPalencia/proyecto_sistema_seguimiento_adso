import { useEffect } from 'react';

import { Box, Typography } from '@mui/material';

import { useWatch } from 'react-hook-form';

import TextAreaField from '../../../FormFields/TextAreaField';
import RadioGroupField from '../../../FormFields/RadioGroupField';
import InputField from '../../../FormFields/InputField';

const EvaluacionDesempeno = ({ control, setValue, watch, isEdit = false }) => {
  const reconocimiento = useWatch({
    control,
    name: 'evaluacionFinal.reconocimientosEspeciales',
  });
  
  // Establecer los valores en el formulario una vez que los datos estén disponibles
  useEffect(() => {
    if (!isEdit) {
      setValue('evaluacionFinal.juicioEvaluacion', true);
      setValue('evaluacionFinal.cuidadElaboracion', 'Nombre de ciudad');
      setValue('evaluacionFinal.reconocimientosEspeciales', false);
      setValue('evaluacionFinal.reconocimientosEspecialesLista', '');
      setValue(
        'evaluacionFinal.fechaGeneracionInforme',
        new Date().toISOString().slice(0, 10)
      );
    }
  }, [setValue, watch, isEdit]);

  useEffect(() => {
    if (reconocimiento === false) {
      setValue('evaluacionFinal.reconocimientosEspecialesLista', '');
    }
  }, [reconocimiento, setValue]);

  return (
    <Box
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      {/* Juicio de Evaluación */}
      <Typography variant="h6">Juicio de Evaluación:</Typography>
      <RadioGroupField
        name="evaluacionFinal.juicioEvaluacion"
        control={control}
        defaultValue={true}
        options={[
          { label: 'Aprobado', value: true },
          { label: 'No Aprobado', value: false },
        ]}
      />

      {/* Reconocimientos Especiales */}
      <Typography variant="h6">
        Reconocimientos Especiales sobre el Desempeño:
      </Typography>

      <RadioGroupField
        name="evaluacionFinal.reconocimientosEspeciales"
        control={control}
        defaultValue={false}
        options={[
          { label: 'Sí', value: true },
          { label: 'No', value: false },
        ]}
      />

      {/* Especificar reconocimiento (solo si eligió "Sí") */}
      {reconocimiento === true && (
        <TextAreaField
          label="Especificar cuáles"
          name="evaluacionFinal.reconocimientosEspecialesLista"
          fullWidth
          multiline
          minRows={2}
          control={control}
        />
      )}

      <Typography variant="h6">Luagar de Creación de elaboración:</Typography>
      <InputField
        label="Cuidad de elaboración"
        fullWidth
        multiline
        name="evaluacionFinal.cuidadElaboracion"
        control={control}
      />
    </Box>
  );
};

export default EvaluacionDesempeno;
