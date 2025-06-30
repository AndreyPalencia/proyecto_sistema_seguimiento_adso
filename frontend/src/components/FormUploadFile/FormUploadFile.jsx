import {
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

/**
 * `FormUploadFile`
 *
 * Este componente renderiza un formulario dentro de un diálogo modal que permite a los usuarios subir un archivo.
 * El archivo se selecciona mediante un botón que abre el selector de archivos, y una vez seleccionado el archivo, se muestra el nombre del archivo.
 *
 * **Restricción:** El componente solo permite seleccionar un archivo a la vez, por lo tanto, cada vez que el usuario selecciona un nuevo archivo,
 *                  este sobrescribe el archivo anterior almacenado en el estado. Siempre se mantiene el archivo más reciente seleccionado.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.open - Controla si el diálogo está abierto o cerrado. Si es true, el diálogo es visible.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el diálogo.
 * @param {string} props.titulo - Título que se muestra en la parte superior del formulario dentro del diálogo modal.
 * @param {React.ReactNode} [props.children] - Contenido adicional que se renderiza dentro del formulario. Este es un contenido opcional.
 * @param {React.ReactNode} [props.actions] - Elementos de acción (por ejemplo, botones) que se muestran en la parte inferior del diálogo. Este es un contenido opcional.
 * @param {Function} [props.onFileChange] - Función que se llama cuando se selecciona un archivo. Recibe el archivo como argumento.
 *
 * @returns {JSX.Element} El componente del formulario de carga de archivo renderizado en un diálogo modal.
 */

const FormUploadFile = ({
  open,
  onClose,
  titulo,
  children,
  actions,
  onFileChange,
}) => {
  //Estado que almacena el archivo seleccionado por el usuario
  const [selectedFile, setSelectedFile] = useState(null);

  /**
   * `handleFileChange`
   *
   * Función encargada de manejar el cambio en la selección del archivo. Cuando el usuario selecciona un archivo,
   * esta función actualiza el estado con el archivo seleccionado y llama a la función `onFileChange` (si está definida).
   *
   * @param {Object} event - El evento de cambio del input de tipo archivo.
   */
  const handleFileChange = (event) => {
    //console.log('Archivo seleccionado:', event.target.files);
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileChange?.(file); // Llama a la función onFileChange con el archivo seleccionado
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pb={5}
        >
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="h6"
          >
            {titulo}
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton
              onClick={() => {
                onClose();
              }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 4 }}
      >
        {children}

        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Seleccionar archivo
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {selectedFile && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ wordBreak: 'break-word', mt: 1 }}
            >
              Archivo seleccionado: {selectedFile.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cerrar
        </Button>
        {actions}
      </DialogActions>
    </Dialog>
  );
};

export default FormUploadFile;
