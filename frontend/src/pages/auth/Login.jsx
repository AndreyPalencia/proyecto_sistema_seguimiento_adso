import {
  Typography,
  DialogContent,
  Box,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { useAuth } from '../../context/AuthContext';

import { iniciarSesion } from '../../services/Auth';

import InputField from '../../components/FormFields/InputField';
import SelectField from '../../components/FormFields/SelectField';

import formUserLogin from '../../schemas/formUserLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formUserLogin),
    defaultValues: {
      rol: 'aprendiz',
      tipoDocumento: 'CC',
    },
  });

  const navigate = useNavigate();

  const { showAlert } = useAlert();
  const { validarUsuario } = useAuth();

  const handleLogin = async (formData) => {
    try {
      const response = await iniciarSesion(formData);
      if (!response.success)
        return showAlert({
          message: `Error al iniciar sesión.`,
          severity: 'warning',
          variant: 'standard',
        });

      const userData = await validarUsuario();

      if (!userData.success) {
        showAlert({
          message: `Error al validar el usuario: ${userData.error}`,
          severity: 'error',
          variant: 'standard',
        });
        return;
      }

      // Usar los datos devueltos, no los estados de contexto
      if (userData.rol === 'admin') navigate(`/admin`);
      else if (userData.rol === 'instructor')
        navigate(`/instructor/${userData.idUsuario}`);
      else if (userData.rol === 'aprendiz')
        navigate(`/aprendiz/${userData.idUsuario}`);
      else {
        showAlert({
          message: `Rol no reconocido: ${userData.rol}`,
          severity: 'error',
          variant: 'standard',
        });
        return;
      }

      // showAlert({
      //   message: 'Inicio sesión exitoso',
      //   severity: 'success',
      //   variant: 'standard',
      // });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showAlert({
        message: `Error al iniciar sesión: ${
          error?.message || 'Revise bien todos los campos.'
        }`,
        severity: 'warning',
        variant: 'standard',
      });
    }
  };

  const onSubmit = (data) => {
    handleLogin(data);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box>
            <img
              src="/logoSena.png"
              style={{
                width: 180,
              }}
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ color: 'black', margin: '15px' }}>
              Bienvenido Al SAEP
            </Typography>
            <Grid container spacing={4}>
              <Grid size={12}>
                <SelectField
                  name="rol"
                  label="Rol"
                  menuOptions={[
                    { label: 'Administrador', value: 'admin' },
                    { label: 'Instructor', value: 'instructor' },
                    { label: 'Aprendiz', value: 'aprendiz' },
                  ]}
                  control={control}
                  startIcon={<AssignmentIndIcon size="small" />}
                  variant="outlined"
                />
              </Grid>

              <Grid size={12}>
                <SelectField
                  name="tipoDocumento"
                  label="Tipo documento"
                  menuOptions={[
                    { label: 'Cédula de Ciudadanía', value: 'CC' },
                    { label: 'Tarjeta de Identidad', value: 'TI' },
                    { label: 'Cédula de Extranjería', value: 'CE' },
                    { label: 'PEP', value: 'PEP' },
                    { label: 'PPT', value: 'PPT' },
                  ]}
                  control={control}
                  startIcon={<BadgeIcon size="small" />}
                  variant="outlined"
                />
              </Grid>

              <Grid size={12}>
                <InputField
                  name="numeroDocumento"
                  label="Número documento"
                  startIcon={<PersonIcon size="small" />}
                  control={control}
                  type="number"
                  variant="outlined"
                />
              </Grid>

              <Grid size={12}>
                <InputField
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  control={control}
                  variant="outlined"
                  startIcon={<KeyIcon />}
                  endIcon={
                    <IconButton edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  onClickIcon={() => setShowPassword(!showPassword)}
                />
              </Grid>

              <Grid size={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'black',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'darkblue',
                      },
                    }}
                    onClick={() => navigate('/auth/reset-password/request')}
                  >
                    ¿Olvidó su contraseña?
                  </Typography>
                </Box>
              </Grid>

              <Grid size={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '10px 0',
                      fontSize: '16px',
                      borderRadius: '8px',
                      '&:hover': { backgroundColor: '#218838' },
                    }}
                  >
                    INGRESAR
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Box>
    </>
  );
};

export default Login;
