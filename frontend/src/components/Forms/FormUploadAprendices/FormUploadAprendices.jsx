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

import FormUploadFile from '../../FormUploadFile/FormUploadFile';
import { useCreateAprendicesByArchivo } from '../../../hook/fichaAprendiz/useCreateAprendicesByArchivo';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FullScreenLoader from '../../Feedback/FullScreenLoader';
import { useAprendices } from '../../../context/AprendicesContext';
import { TablaLista } from '../../Tabla/Tabla';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

const FormUploadAprendices = ({ open, onCloseFile }) => {
  const { idFicha } = useParams();
  const [fileSelected, setFileSelected] = useState(null);
  const [showResultado, setShowResultado] = useState(false);

  const { obtenerAprendicesByFicha } = useAprendices();

  const { loading, fetchCrearAprendicesArchivo } =
    useCreateAprendicesByArchivo();

  const [datos, setDatos] = useState([]); // Initialize as an empty array

  const { updateActionsButtons } = useActionsButtonsContext();

  const handleFichaAprendices = async () => {
    const response = await fetchCrearAprendicesArchivo(idFicha, fileSelected);
    setDatos(response); // Update the state with the response data

    // Refresca aprendices (assuming this also updates some context state)
    await obtenerAprendicesByFicha(idFicha);

    // Oculta diálogo de carga (this closes the FormUploadFile dialog)
    //onClose();

    // Muestra diálogo de resultados
    // This will trigger a re-render, and by this point, 'datos' should be updated.
    setShowResultado(true);
  };

  const formatCellUsuarios = ({ key, value }) => {
    if (key === 'correoEnviado') {
      return value === true ? 'Correo enviado' : 'No se envio el correo';
    }
    return value;
  };

  useEffect(() => {
    updateActionsButtons([]);
  }, []);

  return (
    <>
      <FullScreenLoader open={loading} />

      {!showResultado && (
        <FormUploadFile
          open={open}
          onClose={onCloseFile}
          titulo="Cargar Aprendices"
          onFileChange={(file) => {
            setFileSelected({ archivo: file });
          }}
          actions={
            <Button
              onClick={handleFichaAprendices}
              color="primary"
              variant="contained"
              disabled={!fileSelected}
            >
              Guardar
            </Button>
          }
        />
      )}

      {/* Diálogo de resultado */}
      {/* The Dialog itself should be controlled by showResultado */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={showResultado} // Control visibility directly with showResultado
        onClose={() => {
          setShowResultado(false), onCloseFile();
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}>
              Aprendices cargados exitosamente
            </Typography>
            <Tooltip title="Cerrar">
              <IconButton onClick={() => setShowResultado(false)}>
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* IMPORTANT: Conditionally render TablaLista only if datos has items */}
          {datos && datos.length > 0 ? (
            <TablaLista
              data={datos || []} // This 'datos' should now contain the data from the API
              dataException={[]}
              selectedValue={'nombreAprendiz'}
              header={[
                'Nombre Aprendiz',
                'Número Documento',
                'Correo Electronico',
                'Nombre Empresa',
                'Nit Empresa',
                'Estado',
                'Motivo',
                'Correo Enviado',
              ]}
              formatCellValue={formatCellUsuarios}
            />
          ) : (
            // Fallback message if datos is empty or null
            <Typography>
              No hay aprendices para mostrar en la tabla de resultados.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormUploadAprendices;
