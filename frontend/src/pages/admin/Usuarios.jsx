import { useEffect, useState } from 'react';
import { useActionsButtonsContext } from '../../context/ActionsButtonsContext';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import { useObtenerUsuarios } from '../../hook/usuarios/useObtenerUsuarios';
import { useEditarEstadoUsuario } from '../../hook/usuarios/useEditarEstadoUsuario';

import { TablaCheckBox } from '../../components/Tabla/Tabla';
import FormUsuario from '../../components/Forms/FormUsuarios/FormUsuario';
import FullScreenLoader from '../../components/Feedback/FullScreenLoader';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const Usuarios = () => {
  // Hook de navegación para redirigir a otras rutas
  const navegation = useNavigate();

  const { loading, usuarios, refetchUsuarios, buscarUsuarios } =
    useObtenerUsuarios();

  const { editarEstadoUsuario, loading: loadingEstadoUsuario } =
    useEditarEstadoUsuario();

  // Obtiene funciones del contexto para manejar botones de acción
  const { updateActionsButtons } = useActionsButtonsContext();

  const [openCrearUsuario, setCrearUsuario] = useState(false);

  const handleCreateUsuario = () => setCrearUsuario((prev) => !prev);

  const [selectIdUsuario, setSelectIdUsuario] = useState(null);

  const [openEditarUsuario, setEditarUsuario] = useState(false);

  const handleUpdateUsuario = () => setEditarUsuario((prev) => !prev);

  const handleUpdateStateUsuario = async (valueCheck, idUsuario) => {
    await editarEstadoUsuario(idUsuario, valueCheck);
    await refetchUsuarios();
  };

  /**
   * Array de objetos que representan los botones de acción para las fichas.
   * Cada botón tiene un ícono, color, posición, acción y tooltip.
   *
   * @type {Array}
   */
  const botonesUsuarios = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: (idUsuario) => {
        setSelectIdUsuario(idUsuario);
        handleUpdateUsuario();
      },
      tooltip: 'Editar',
    },
  ];

  const handleUsuarioSuccess = async () => {
    await refetchUsuarios();
  };

  useEffect(() => {
    //console.log({ loading, usuarios });
    if (!loading && usuarios?.length) {
      updateActionsButtons(botonesUsuarios);
    }
  }, [usuarios, loading]);

  const rowActionsUsuarios = (fila) => {
    if (fila.rol === 'Aprendiz') {
      return [
        {
          icon: OpenInNewIcon,
          action: (idAprendizAdmin) => {
            navegation(`/admin/rol/aprendiz/${idAprendizAdmin}/fichas`);
          },
          tooltip: 'Abir fichas en afiliadas',
          position: 'left',
          color: '#39A900',
          id: 'MainGrid',
        },
        {
          id: 'estadoUsuario',
          type: 'checkbox',
          action: handleUpdateStateUsuario,
          tooltip: 'Activo',
          otherTooltip: 'Desactivado',
        },
      ];
    }

    if (fila.rol === 'Instructor') {
      return [
        {
          icon: OpenInNewIcon,
          action: (idInstructorAdmin) => {
            navegation(`/admin/rol/instructor/${idInstructorAdmin}/fichas`);
          },
          tooltip: 'Abir fichas en seguimiento',
          position: 'left',
          color: '#39A900',
          id: 'MainGrid',
        },
        {
          id: 'estadoUsuario',
          type: 'checkbox',
          action: handleUpdateStateUsuario,
          tooltip: 'Activo',
          otherTooltip: 'Desactivado',
        },
      ];
    }

    if (fila.rol === 'Admin') {
      return [];
    }

    return []; // Si no hay acciones, no se renderiza nada
  };

  const formatCellUsuarios = ({ key, value }) => {
    if (key === 'estadoUsuario') {
      return value === true ? 'Activo' : 'Inactivo';
    }
    return value;
  };
  return (
    <>
      <Typography
        component="h1"
        variant="h5"
        fontWeight="600"
        sx={{ margin: '20px 0 5px 0' }}
      >
        Listado usuarios:
      </Typography>
      {!loading && (
        <TablaCheckBox
          key={`${usuarios.length}`}
          data={usuarios ?? []}
          dataException={['idUsuario']}
          selectedValue={'idUsuario'}
          filters={{
            filter: {
              todos: '',
              Instructores: 'Instructor',
              Aprendices: 'Aprendiz',
            },
            filterSearch: 'rol',
            defaultValuefilterSearch: 'Instructor',
          }}
          gridOptions={{
            title: [`nombre`, 'apellido'],
            subtitle: ['tipoDocumento', 'numeroDocumento'],
          }}
          rowActions={rowActionsUsuarios}
          header={[
            'Tipo Documento',
            'Número Documento',
            'Nombre',
            'Apellido',
            'Telefono',
            'Correo Electrónico',
            'Rol',
            'Estado Usuario',
          ]}
          initialValue={['estadoUsuario']}
          formatCellValue={formatCellUsuarios}
          buttonAction={[
            {
              title: 'Crear Usuario',
              onAction: handleCreateUsuario,
              icon: AddOutlinedIcon,
              size: 30,
            },
          ]}
        />
      )}

      {
        <Dialog
          open={openCrearUsuario}
          onClose={handleCreateUsuario}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
                variant="title"
              >
                Crear Usuario
              </Typography>
              <Tooltip title="Cerrar formulario">
                <IconButton
                  onClick={() => {
                    handleCreateUsuario(); // ⬅️ esto cierra el modal
                  }}
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent>
            <FormUsuario
              rolDefault="instructor"
              onSuccess={handleUsuarioSuccess}
              onClose={handleCreateUsuario}
            ></FormUsuario>
          </DialogContent>
        </Dialog>
      }

      {
        <Dialog
          open={openEditarUsuario}
          onClose={handleUpdateUsuario}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
                variant="title"
              >
                Editar Usuario
              </Typography>
              <Tooltip title="Cerrar formulario">
                <IconButton
                  onClick={() => {
                    setSelectIdUsuario(null);
                    handleUpdateUsuario(); // ⬅️ esto cierra el modal
                  }}
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent>
            <FormUsuario
              rolDefault="instructor"
              onSuccess={handleUsuarioSuccess}
              onClose={() => {
                setSelectIdUsuario(null);
                handleUpdateUsuario();
              }}
              isEdit
              idUsuario={selectIdUsuario}
            />
          </DialogContent>
        </Dialog>
      }
    </>
  );
};
export default Usuarios;
