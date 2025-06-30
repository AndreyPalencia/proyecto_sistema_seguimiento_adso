import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

import { Button, Box, Stack } from '@mui/material';

import InputField from '../../FormFields/InputField';
import SelectField from '../../FormFields/SelectField';
import UploadFileField from '../../FormFields/UploadFileField';
import FullScreenLoader from '../../Feedback/FullScreenLoader';

import { useCrearUsuario } from '../../../hook/usuarios/useCrearUsuario';
import { useModificarUsuario } from '../../../hook/usuarios/useModificarUsuario';
import { useObtenerUsuarioById } from '../../../hook/usuarios/useObtenerUsuarioById';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import formUsuarios from '../../../schemas/formUsuarios';
import { getChangedFields, toTitleCaseWithSpaces } from '../../../utils/utils';

/**
 * @param {string} tipo - 'usuario' | 'aprendiz' | 'instructor' | etc.
 * @param {Function} onSuccess - callback with idUsuario
 */
const FormUsuario = ({
  rolDefault = 'instructor',
  onSuccess,
  onClose,
  isEdit = false,
  idUsuario = null,
  children,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(formUsuarios),
    mode: 'onChange',
    defaultValues: {
      tipoDocumento: '',
      numeroDocumento: '',
      nombre: '',
      apellido: '',
      telefono: '',
      correoElectronico: '',
      archivo: undefined,
      rol: '',
      estadoUsuario: true,
    },
  });

  const { roleUsuario } = useAuth();

  const { fetchCrearUsuario, loading: loadingCrearUsuario } = useCrearUsuario();

  const { editarUsuario, loading } = useModificarUsuario();

  const { usuario, loading: loadingUsuario } = useObtenerUsuarioById(idUsuario);

  const { showAlert } = useAlert();

  const [originalUsuario, setOriginalUsuario] = useState(null);

  const onSubmit = async (data) => {
    const { nombre, apellido, ...rest } = data;

    const nombreFormateado = toTitleCaseWithSpaces(data?.nombre);
    const apellidoFormateado = toTitleCaseWithSpaces(data?.apellido);

    const formData = {
      nombre: nombreFormateado ?? nombre,
      apellido: apellidoFormateado ?? apellido,
      ...rest,
    };
    if (isEdit) {
      const editedFields = getChangedFields(formData, originalUsuario);

      if (Object.keys(editedFields).length === 0) {
        showAlert({
          severity: 'info',
          message: 'No se han realizado cambios para actualizar.',
          variant: 'standard',
        });
        return;
      }

      await editarUsuario(idUsuario, editedFields);
      if (typeof onSuccess === 'function') {
        await onSuccess(idUsuario);
      }
      onClose();
    } else {
      const res = await fetchCrearUsuario(formData);
      if (typeof onSuccess === 'function') {
        await onSuccess(res.idUsuario);
      }
      onClose();
      reset(); // Reset only on creation
    }
  };

  useEffect(() => {
    reset((prev) => ({
      ...prev,
      tipoDocumento: 'CC',
      rol: rolDefault,
    }));
  }, [reset, rolDefault]);

  useEffect(() => {
    if (isEdit && usuario) {
      reset({
        tipoDocumento: usuario.tipoDocumento || 'CC',
        numeroDocumento: usuario.numeroDocumento || '',
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        telefono: usuario.telefono || '',
        correoElectronico: usuario.correoElectronico || '',
        archivo: undefined,
        rol: usuario.rol || rolDefault,
        estadoUsuario: usuario.estadoUsuario ?? true,
      });
      setOriginalUsuario(usuario); // Save the original for comparison
    }
  }, [isEdit, usuario, reset, rolDefault]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (error) => {
        console.log(error);
      })}
    >
      <FullScreenLoader open={loadingCrearUsuario} />
      <Box sx={{ width: '100%', padding: '20px 10px 5px 0' }}>
        <Box sx={{ mb: 2 }}>
          <SelectField
            name="tipoDocumento"
            control={control}
            label="Tipo de Documento"
            fullWidth
            menuOptions={[
              { label: 'Cédula de Ciudadanía', value: 'CC' },
              { label: 'Tarjeta de Identidad', value: 'TI' },
              { label: 'Cédula de Extranjería', value: 'CE' },
              { label: 'PEP', value: 'PEP' },
              { label: 'PPT', value: 'PPT' },
            ]}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <InputField
            name="numeroDocumento"
            control={control}
            label="Número de Documento"
            fullWidth
            type="number"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <InputField
            name="nombre"
            control={control}
            label="Nombre"
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <InputField
            name="apellido"
            control={control}
            label="Apellido"
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <InputField
            name="telefono"
            control={control}
            label="Teléfono"
            fullWidth
            type="number"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <InputField
            name="correoElectronico"
            control={control}
            label="Correo Electrónico"
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <UploadFileField name="archivo" label="Firma" control={control} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <SelectField
            name="rol"
            control={control}
            label="Rol"
            fullWidth
            menuOptions={[
              { label: 'Instructor', value: 'instructor' },
              { label: 'Aprendiz', value: 'aprendiz' },
            ]}
            disabled={roleUsuario === 'admin' ? false : true}
          />
        </Box>
      </Box>

      <Stack
        spacing={2}
        direction="row"
        sx={{ gap: '10px', justifyContent: 'flex-end' }}
      >
        {children}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ margin: '2rem 0 1rem 0' }}
          disabled={!isValid}
        >
          {isEdit ? 'Actualizar Usuario' : 'Guardar Usuario'}
        </Button>
      </Stack>
    </form>
  );
};

export default FormUsuario;
