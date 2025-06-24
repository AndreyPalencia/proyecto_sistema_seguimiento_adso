import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import DateTimeFieldColombia from '../../FormFields/DateTimeFieldColombia';
import TextAreaField from '../../FormFields/TextAreaField';
import UploadFileField from '../../FormFields/UploadFileField';

import { tipoDocumentoOptions, getValueFromLabel } from '../../../utils/utils';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formEditarDocumento } from '../../../schemas/formDocumentoSchema';
import SelectField from '../../FormFields/SelectField';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormEditarDocumento = ({
  open,
  onClose,
  idFichaAprendiz,
  documento,
  onEditarDocumento,
}) => {
  // Verificar si el documento existe y tiene las propiedades necesarias
  if (!documento) {
    console.error('No se proporcionó un documento válido');
    return null;
  }

  const { roleUsuario } = useAuth();

  const isAprendiz = roleUsuario === 'aprendiz';
  const isInstructor = roleUsuario === 'instructor';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formEditarDocumento),
    defaultValues: {
      idDocumento: '',
      idFichaAprendiz: idFichaAprendiz || '',
      tipoDocumento: '',
      observacion: '',
      estadoDocumento: false,
      fechaUltimaActualizacion: new Date().toISOString(),
      archivo: null,
    },
  });

  const OnSubmit = async (formData) => {
    try {
      const { idDocumento, ...rest } = formData;
      console.log('Formulario enviado:', formData);
      await onEditarDocumento(idDocumento, rest);
      onClose();
    } catch (error) {
      console.error('Error al editar documento:', error);
    }
  };

  // Resetear el formulario cuando cambie el documento o se abra el modal
  useEffect(() => {
    const { idDocumento, observacion, tipoDocumento, estadoDocumento } =
      documento;

    // Obtener el valor correcto para el select basado en la etiqueta
    const selectValue = getValueFromLabel(documento?.tipoDocumento);
    console.log(
      'Tipo de documento:',
      tipoDocumento,
      'Valor seleccionado:++++++++++++++++++++++++++',
      selectValue,
      'Conso',
      documento
    );

    if (documento) {
      reset({
        idDocumento: idDocumento,
        idFichaAprendiz: idFichaAprendiz,
        observacion: observacion || '',
        estadoDocumento: estadoDocumento || false,
        tipoDocumento: selectValue || '',
        fechaUltimaActualizacion: new Date().toISOString(),
      });
    }
  }, [idFichaAprendiz, reset, open, documento]);

  // Mostrar errores de formulario para depuración
  if (Object.keys(errors).length > 0) {
    console.error('Errores de formulario:', errors);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Editar documento
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <form
        onSubmit={handleSubmit(OnSubmit, (error) => {
          console.error('Error en validación del formulario:', error);
        })}
      >
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ mt: 1, mb: 2 }}
          >
            <SelectField
              name="tipoDocumento"
              label="Tipo de Documento"
              menuOptions={tipoDocumentoOptions || []}
              labelKey="label"
              valueKey="value"
              control={control}
              disabled={true}
            />

            {!isAprendiz && (
              <TextAreaField
                name="observacion"
                label="Observación"
                rows={4}
                control={control}
              />
            )}

            {!isInstructor && (
              <UploadFileField
                name="archivo"
                label="Nuevo documento (archivo)"
                control={control}
              />
            )}

            <DateTimeFieldColombia
              name="fechaUltimaActualizacion"
              label="Fecha de última actualización"
              control={control}
              required={true}
              inputLabel={true}
              disabled={true}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ px: 2, pb: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormEditarDocumento;
