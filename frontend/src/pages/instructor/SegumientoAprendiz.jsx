import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  BoxFilter,
  ButtonFilter,
} from '../../components/Tabla/TablaController/GeneralFilterButtons/GeneralFilterButtons.style';

import { useAprendicesByRuta } from '../../hook/useAprendicesByRuta';
import { useFichaById } from '../../hook/useFichaById';

import BitacorasInstructor from './SegumientoAprendiz/BitacorasInstructor';
import DocumentosInstructor from './SegumientoAprendiz/DocumentosInstructor';
import FormCrearBitacora from '../../components/Forms/FormBitacora/FormCrearBitacora';
import FormCrearDocumento from '../../components/Forms/FormDocumento/FormCrearDocumento';
import FormCrearAgendamientoFicha from '../../components/Forms/FormAgendamiento/FormCrearAgendamientoFicha';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AgendamientosInstructor from './SegumientoAprendiz/AgendamientosInstructor';

const seccionesSeguimiento = ['Bitácoras', 'Documentos', 'Agendamientos'];

const SegumientoAprendiz = () => {
  const { idAprendiz, idFicha, idInstructor } = useParams();

  //Estado que almacena la apertura del dialogo de creación de un bitácora
  const [openAgregarAgendamiento, setAgregarAgendamiento] = useState(false);

  //Estado que almacena la nuevo registro
  const [nuevoAgendamiento, setNuevoAgendamiento] = useState(null);

  const [estadoSelecionado, setEstadoSelecionado] = useState('Bitácoras');

  const { aprendiz, datosCargados } = useAprendicesByRuta(idAprendiz);
  const { ficha } = useFichaById(idFicha);

  const idFichaAprendiz = aprendiz?.idFichaAprendiz;

  const handleButtonClick = (event, optionKey) => {
    setEstadoSelecionado(optionKey);
  };

  const handleCreateClick = () => {
    if (estadoSelecionado === 'Agendamientos') {
      setAgregarAgendamiento(true);
    }
  };

  return (
    <Box component="main" className="box-main-info" sx={{ marginBottom: 2 }}>
      <Typography
        ccomponent="h2"
        variant="h5"
        className="typography-title-info"
        fontSize="28px"
        fontWeight="bold"
      >
        Segumiento al aprendiz
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Alinea a la izquierda
          alignItems: 'center',
          gap: 2,
          overflowX: 'auto', // Permite desbordamiento horizontal
          whiteSpace: 'nowrap', // No permite que el contenido se divida en varias líneas
        }}
      >
        <BoxFilter sx={{ gap: '10px' }}>
          {seccionesSeguimiento.map((key, index) => {
            return (
              <ButtonFilter
                key={key}
                isSelected={estadoSelecionado === key ? true : false} // Pasamos el estado de selección
                name={'value'} // El nombre de cada botón
                onClick={(event) => handleButtonClick(event, key)} // Pasar el evento completo
              >
                {key} {/* Aquí muestra la clave del botón */}
              </ButtonFilter>
            );
          })}
        </BoxFilter>
        <Box>
          {estadoSelecionado === 'Agendamientos' && (
            <Tooltip
              aria-label={`${estadoSelecionado}`}
              title={`Agregar ${estadoSelecionado.slice(0, -1)}`}
            >
              <IconButton
                variant="contained"
                color="primary"
                onClick={handleCreateClick}
              >
                <AddOutlinedIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      {datosCargados && (
        <>
          {estadoSelecionado === 'Bitácoras' && (
            <BitacorasInstructor
              idFichaAprendiz={idFichaAprendiz}
              ficha={ficha}
              idAprendiz={idAprendiz}
            />
          )}
          {estadoSelecionado === 'Documentos' && (
            <DocumentosInstructor
              idFichaAprendiz={idFichaAprendiz}
              ficha={ficha}
              idAprendiz={idAprendiz}
            />
          )}
          {estadoSelecionado === 'Agendamientos' && (
            <AgendamientosInstructor
              idFichaAprendiz={idFichaAprendiz}
              idFicha={idFicha}
              aprendiz={aprendiz}
              nuevoAgendamiento={nuevoAgendamiento}
              ficha={ficha}
            />
          )}
        </>
      )}
      {
        <>
          {estadoSelecionado === 'Agendamientos' && openAgregarAgendamiento && (
            <FormCrearAgendamientoFicha
              open={openAgregarAgendamiento}
              onClose={() => setAgregarAgendamiento(false)}
              idFichaAprendiz={idFichaAprendiz}
              ficha={ficha}
              aprendiz={aprendiz}
              idInstructor={idInstructor}
              onAgendamientoCrear={(agendamiento) => {
                setNuevoAgendamiento(agendamiento);
                setAgregarAgendamiento(false);
              }}
            />
          )}
        </>
      }
    </Box>
  );
};

export default SegumientoAprendiz;
