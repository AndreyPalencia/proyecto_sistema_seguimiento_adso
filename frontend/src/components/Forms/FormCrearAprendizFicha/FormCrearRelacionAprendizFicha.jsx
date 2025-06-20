import { useEffect } from 'react';
import { Box, Button, ButtonGroup, Stack, Typography } from '@mui/material';

import { useAprendizFicha } from '../../../context/AprendizFichaContext';

import { useCrearFichaAprendiz } from '../../../hook/fichaAprendiz/useCrearFichaAprendiz';

import InputField from '../../FormFields/InputField';
import SelectField from '../../FormFields/SelectField';
import FullScreenLoader from '../../Feedback/FullScreenLoader';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  formCrearFichaAprendiz,
  alternativas,
} from '../../../schemas/formFichaAprendizSchema';

const FormCrearRelacionAprendizFicha = ({
  onClose,
  onSuccess,
  defaultValues,
  onFormChange,
}) => {
  const { idAprendiz, idFicha, idEmpresa, resetearTodo } = useAprendizFicha();

  const { loading, fetchCrearAprendizFicha } = useCrearFichaAprendiz();

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(formCrearFichaAprendiz),
    mode: 'onChange',
    defaultValues: {
      idUsuario: '',
      idFicha: '',
      idEmpresa: '',
      alternativa: 'Contrato de Aprendizaje',
      cargoEmpresa: '',
      jefeInmediato: '',
      correoElectronicoJefe: '',
      telefonoJefe: '',
      cargoJefe: '',
      ...defaultValues,
    },
  });

  const OnSubmit = async (formData) => {
    //make it async
    const result = await fetchCrearAprendizFicha(formData); // Await the result
    //console.log(result);
    if (result?.success) {
      // Check the success property
      onClose();
      resetearTodo();
      onSuccess();
    }
    // Si result.success es false, no hagas nada, el modal no se cerrará
  };

  useEffect(() => {
    const subscription = watch((value) => {
      onFormChange?.(value); // actualiza el padre
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  useEffect(() => {
    if (idAprendiz && idFicha && idEmpresa) {
      reset({
        ...getValues(),
        idUsuario: idAprendiz,
        idFicha: idFicha,
        idEmpresa: idEmpresa,
        // idUsuario: 72,
        // idFicha: 7,
        // idEmpresa: 14,
      });
    }
  }, [reset, idAprendiz, idFicha, idEmpresa]);

  return (
    <form
      onSubmit={handleSubmit(OnSubmit, (error) => {
        console.error(error);
      })}
    >
      <FullScreenLoader open={loading} />
      <Box
        sx={{
          //minHeight: '672px',
          padding: '0 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Información Alternativa de Empresa
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2.5, // Increased gap for spacing
            mb: 1, // Margin-bottom for the section
            pb: 2,
            pt: 3,
          }}
        >
          {/* Cargo alternativo en la empresa */}
          <Box sx={{ flexBasis: '49%', minWidth: '280px', mb: 2 }}>
            <SelectField
              name="alternativa"
              label="Alternativa de contrato"
              control={control}
              menuOptions={alternativas}
              isArrayOptions
              fullWidth
              inputLabel
            />
          </Box>

          <Box sx={{ flexBasis: '48.5%', minWidth: '280px', mb: 2 }}>
            <InputField
              name="cargoEmpresa"
              label="Cargo en la empresa"
              control={control}
              fullWidth
            />
          </Box>

          <Box sx={{ flexBasis: '49%', minWidth: '280px', mb: 2 }}>
            <InputField
              name="jefeInmediato"
              label="Jefe Inmediato"
              control={control}
              fullWidth
            />
          </Box>

          <Box sx={{ flexBasis: '49%', minWidth: '280px', mb: 2 }}>
            <InputField
              name="cargoJefe"
              control={control}
              label="Cargo Inmediato"
              fullWidth
            />
          </Box>

          <Box sx={{ flexBasis: '49%', minWidth: '280px', mb: 2 }}>
            <InputField
              name="correoElectronicoJefe"
              control={control}
              label="Correo Electrónico Jefe Inmediato"
              fullWidth
            />
          </Box>

          <Box sx={{ flexBasis: '49%', minWidth: '280px', mb: 2 }}>
            <InputField
              type="number"
              name="telefonoJefe"
              control={control}
              label="Teléfono Jefe Inmediato"
              fullWidth
            />
          </Box>
          {/* Action button */}

          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ width: '100%' }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid}
            >
              Guardar
            </Button>
          </Stack>
        </Box>
      </Box>
    </form>
  );
};

export default FormCrearRelacionAprendizFicha;
