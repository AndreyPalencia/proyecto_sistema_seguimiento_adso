import { useEffect } from 'react';
import { useAlert } from '../../../context/AlertContext';
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

import { crearDocumento } from '../../../services/Documentos';

import SelectField from '../../FormFields/SelectField';
import DateTimeFieldColombia from '../../FormFields/DateTimeFieldColombia';
import TextAreaField from '../../FormFields/TextAreaField';
import UploadFileField from '../../FormFields/UploadFileField';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCrearDocumento } from '../../../schemas/formDocumentoSchema';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormCrearDocumento = ({
  open,
  onClose,
  idFichaAprendiz,
  tiposDisponibles,
  onCrearDocumento,
}) => {
  //console.log(tiposDisponibles);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(
      formCrearDocumento(tiposDisponibles?.opcionesDocumentos || [])
    ), // Fallback to empty array if not available

    defaultValues: {
      idFichaAprendiz: idFichaAprendiz,
      tipoDocumento: tiposDisponibles?.opcionesDocumentos?.[0] || '', // Use safe fallback
      observacion: '',
      estadoDocumento: false,
      fechaUltimaActualizacion: '',
      archivo: null,
    },
  });

  const { showAlert } = useAlert();

  const { roleUsuario } = useAuth();

  const isAprendiz = roleUsuario === 'aprendiz';
  const isInstructor = roleUsuario === 'instructor';

  const handleCrearDocumento = async (formData) => {
    try {
      let dataToSend;

      if (formData.archivo instanceof File) {
        dataToSend = new FormData();
        for (const key in formData) {
          if (formData[key] !== undefined && formData[key] !== null) {
            dataToSend.append(key, formData[key]);
          }
        }
      } else {
        dataToSend = { ...formData };
      }
      const documento = await crearDocumento(dataToSend);
      onCrearDocumento(documento);
      showAlert({
        message: 'Se ha creado exitosamente un nuevo documento.',
        severity: 'success',
        variant: 'standard',
      });
    } catch (error) {
      console.error('Error al crear una documento.', error);
      showAlert({
        message: `Error al crear una documento. ${error.message} `,
        severity: 'error',
      });
    }
  };

  const OnSubmit = async (formData) => {
    await handleCrearDocumento(formData);
    onClose();
  };

  useEffect(() => {
    reset({
      idFichaAprendiz: idFichaAprendiz,
      estadoDocumento: false,
      tipoDocumento: tiposDisponibles?.opcionesDocumentos?.[0] || '', // Default to first option if available
      fechaUltimaActualizacion: new Date().toISOString(),
    });
  }, [idFichaAprendiz, reset, open, tiposDisponibles]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Crear documento
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
          console.error(error);
        })}
      >
        <DialogContent>
          {tiposDisponibles?.total >= tiposDisponibles.max ? (
            <Box color="" fontWeight="">
              Ya se han subido todos documentos necesarios. No puedes agregar
              más.
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{ mt: 1, mb: 2 }}
            >
              <SelectField
                name="tipoDocumento"
                label="Tipo de Documento"
                menuOptions={tiposDisponibles?.tiposDisponiblesOpciones || []} // Ensure options are available
                valueKey="value"
                labelKey="label"
                control={control}
              />

              {(!isAprendiz && !isInstructor) && (
                <TextAreaField
                  name="observacion"
                  label="Observación"
                  rows={4}
                  control={control}
                />
              )}

              <UploadFileField
                name="archivo"
                label="Nuevo documento (archivo)"
                control={control}
              />

              <DateTimeFieldColombia
                name="fechaUltimaActualizacion"
                label="Fecha de última actualización"
                control={control}
                required={true}
                inputLabel={true}
                disabled={true}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ px: 2, pb: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={tiposDisponibles?.total >= tiposDisponibles.max}
            >
              Agregar
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormCrearDocumento;
