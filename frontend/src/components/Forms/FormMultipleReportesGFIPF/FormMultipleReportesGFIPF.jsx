import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckbox } from '../../../context/CheckboxContext';

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import FormSearchEmpreseSelect from './FormSearchEmpreseSelect';
import FormSearchAprendiz from './FormSelectAprendices';
import ReportesSecuencialesGFIPF from './ReportesSecuencialesGFIPF';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormMultipleReportesGFIPF = ({ open, onClose }) => {
  const { idInstructor } = useParams();
  const [idEmpresa, setIdEmpresa] = useState(null);

  const { selectedIds, clearSelection } = useCheckbox();

  const [iniciandoReportes, setIniciandoReportes] = useState(false);

  const handleEmpresaSeleccionada = (nuevaEmpresa) => {
    // console.log('Empresa seleccionada:', nuevaEmpresa);
    setIdEmpresa(nuevaEmpresa);
  };

  const cleanAprendices = () => {
    clearSelection();
    handleEmpresaSeleccionada(null);
  };

  const onCloseFormulario = () => {
    clearSelection();
    handleEmpresaSeleccionada(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setIdEmpresa(null);
        clearSelection();
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
            {!idEmpresa ? 'Selecionar empresa:' : 'Selecionar aprendices:'}
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!iniciandoReportes ? (
          <>
            {/* Tus formularios de selección */}
            {idEmpresa ? (
              <FormSearchAprendiz
                idEmpresa={idEmpresa}
                idInstructor={idInstructor}
                onCloseFormulario={onCloseFormulario}
                setIniciandoReportes={setIniciandoReportes}
                handleEmpresaSeleccionada={handleEmpresaSeleccionada}
              />
            ) : (
              <FormSearchEmpreseSelect
                handleEmpresaSeleccionada={setIdEmpresa} // función para actualizar el estado
                selectedEmpresa={idEmpresa} // estado actual
              />
            )}
          </>
        ) : (
          <ReportesSecuencialesGFIPF
            idsFichaAprendices={selectedIds}
            cleanAprendices={cleanAprendices}
            onCloseGlobal={() => {
              onCloseFormulario();
              setIniciandoReportes(false); // Una vez que los reportes han finalizado, oculta el progreso
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormMultipleReportesGFIPF;
