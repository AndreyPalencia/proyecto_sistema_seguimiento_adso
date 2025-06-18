import { useEffect, useState } from 'react';
import { useAprendizFicha } from '../../../context/AprendizFichaContext';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import FormAprendiz from './FormAprendiz/FormAprendiz';
import FormEmpresaAprendiz from './FormEmpresaAprendiz/FormEmpresaAprendiz';
import { useCheckbox } from '../../../context/CheckboxContext';

import FormCrearRelacionAprendizFicha from './FormCrearRelacionAprendizFicha';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormCrearAprendizFicha = ({ idFicha, open, onClose, onSuccess }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const [formRelacionData, setFormRelacionData] = useState({});

  const { idAprendiz, idEmpresa, setFichaSeleccionada, resetearTodo } =
    useAprendizFicha();

  const { clearSelection } = useCheckbox();

  // Manejador de cambio de pestaña con bloqueo
  const handleTabChange = (event, newValue) => {
    // Evitar navegación si el aprendiz aún no ha sido creado
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (idFicha) {
      setFichaSeleccionada(idFicha);
    }
  }, [idFicha, setFichaSeleccionada]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        clearSelection();
        resetearTodo();
      }}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Agregar Usuario:
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Formulario Crear Aprendiz"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Crear/Buscar Usuario" />
          <Tab label="Seleccionar empresa" />
          <Tab label="Información de practica" />
          {/* <Tab label="Seleccionar empresa" disabled={!idAprendiz} /> */}
        </Tabs>

        {/* Tab 0: Formulario de creación del aprendiz */}
        {selectedTab === 0 && (
          <Box sx={{ paddingTop: '10px' }}>
            <FormAprendiz />
          </Box>
        )}

        {/* Tab 1: Seleccionar empresa (solo si idAprendiz existe) */}
        {selectedTab ===1 && (
          <Box sx={{ paddingTop: '10px' }}>
            {/* Aquí puedes poner el componente para seleccionar empresa */}
            <FormEmpresaAprendiz />
          </Box>
        )}
        {selectedTab === 2 && ( // && idAprendiz && (
            <Box sx={{ paddingTop: '10px' }}>
              {/* Aquí puedes poner el componente para seleccionar empresa */}
              <FormCrearRelacionAprendizFicha
                onClose={onClose}
                onSuccess={onSuccess}
                defaultValues={formRelacionData}
                onFormChange={setFormRelacionData}
              />
            </Box>
          )}
      </DialogContent>
    </Dialog>
  );
};

export default FormCrearAprendizFicha;
