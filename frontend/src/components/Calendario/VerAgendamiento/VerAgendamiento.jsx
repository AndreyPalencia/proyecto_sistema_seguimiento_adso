import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tooltip,
  IconButton,
  DialogActions,
  Stack,
  Button,
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useFichaById } from '../../../hook/useFichaById';
import InputText from '../../FormFields/InputText';
import { convertirEnFechaColombiana } from '../../../utils/utils';

const VerAgendamiento = ({
  aprendizInfo,
  idFicha,
  agendamientoSeleccionado,
  handleAgendamientoSeleccionado,
}) => {
  const { ficha } = useFichaById(idFicha);
  const nombreAprendiz = `${aprendizInfo?.nombre} ${aprendizInfo?.apellido}`;

  if (!agendamientoSeleccionado) return null;

  return (
    <Dialog
      open={Boolean(agendamientoSeleccionado)}
      onClose={() => {
        handleAgendamientoSeleccionado();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}>
            Detalles de Visita
          </Box>
          <Tooltip title="Cerrar">
            <IconButton
              onClick={() => {
                handleAgendamientoSeleccionado();
              }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <InputText
            label="Ficha"
            value={`${ficha?.numeroFicha || ''} - ${
              ficha?.nombrePrograma || ''
            }`}
            fullRow
          />

          <InputText label="Aprendiz" value={nombreAprendiz} fullRow />

          <InputText
            label="Tipo de Visita"
            value={agendamientoSeleccionado.tipoVisita || '-'}
          />
          <InputText
            label="Estado de Visita"
            value={agendamientoSeleccionado.estadoVisita || '-'}
          />

          {agendamientoSeleccionado.tipoVisita === 'Virtual' && (
            <>
              <InputText
                label="Herramienta de Reunión"
                value={agendamientoSeleccionado.herramientaReunion || '-'}
              />
              <InputText
                label="Enlace de Reunión"
                value={agendamientoSeleccionado.enlaceReunion || '-'}
              />
            </>
          )}

          <InputText
            label="Fecha Inicio"
            value={
              convertirEnFechaColombiana(
                agendamientoSeleccionado.fechaInicio
              ) || '-'
            }
          />
          <InputText
            label="Fecha Fin"
            value={
              convertirEnFechaColombiana(agendamientoSeleccionado.fechaFin) ||
              '-'
            }
          />
          <InputText
            label="Número de Visita"
            value={agendamientoSeleccionado.numeroVisita || '-'}
          />
        </Box>

        <DialogActions sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                handleAgendamientoSeleccionado();
              }}
            >
              Cerrar
            </Button>
          </Stack>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default VerAgendamiento;
