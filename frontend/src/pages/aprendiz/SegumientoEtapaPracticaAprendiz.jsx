import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import {
  BoxFilter,
  ButtonFilter,
} from '../../components/Tabla/TablaController/GeneralFilterButtons/GeneralFilterButtons.style.jsx';

import { useFichaById } from '../../hook/useFichaById.js';

import BitacorasAprendiz from './SegumientoAprendiz/BitacorasAprendiz.jsx';
import DocumentosAprendiz from './SegumientoAprendiz/DocumentosAprendiz.jsx';
import FormCrearBitacora from '../../components/Forms/FormBitacora/FormCrearBitacora.jsx';
import FormCrearDocumento from '../../components/Forms/FormDocumento/FormCrearDocumento.jsx';
import FormCrearAgendamientoFicha from '../../components/Forms/FormAgendamiento/FormCrearAgendamientoFicha.jsx';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AgendamientosAprendiz from './SegumientoAprendiz/AgendamientosAprendiz.jsx';
import { useAprendizByRuta } from '../../hook/useAprendizByRuta.js';

const seccionesSeguimiento = ['Bitácoras', 'Documentos', 'Agendamientos'];

const SegumientoEtapaPracticaAprendiz = () => {
  const { idFicha, idAprendizAdmin } = useParams();

  //Estado que almacena la apertura del dialogo de creación
  const [openAgregarBitacora, setAgregarBitacora] = useState(false);
  const [openAgregarDocumento, setAgregarDocumento] = useState(false);
  const [openAgregarAgendamiento, setAgregarAgendamiento] = useState(false);

  //Estado que almacena la nueva
  const [nuevaBitacora, setNuevaBitacora] = useState(null);
  const [nuevaDocumento, setNuevaDocumento] = useState(null);
  const [nuevoAgendamiento, setNuevoAgendamiento] = useState(null);

  //Estado que almacena la data para los formularios
  const [datosFormularioBitacora, setDatosFormularioBitacora] = useState(null);
  const [tiposDocumentoDisponibles, setTiposDocumentoDisponibles] =
    useState(null);

  const [estadoSelecionado, setEstadoSelecionado] = useState('Bitácoras');

  const { aprendizInfo, datosCargados } = useAprendizByRuta();
  const { ficha } = useFichaById(idFicha);

  const idFichaAprendiz = aprendizInfo?.idFichaAprendiz;

  const idInstructor = aprendizInfo?.idInstructor;

  const handleButtonClick = (event, optionKey) => {
    setEstadoSelecionado(optionKey);
  };

  const handleCreateClick = () => {
    if (estadoSelecionado === 'Bitácoras') {
      setAgregarBitacora(true);
    }
    if (estadoSelecionado === 'Documentos') {
      setAgregarDocumento(true);
    }
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
        Seguimiento al aprendiz
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
        </Box>
      </Box>
      {datosCargados && (
        <>
          {estadoSelecionado === 'Bitácoras' && (
            <BitacorasAprendiz
              idFichaAprendiz={idFichaAprendiz}
              ficha={ficha}
              idAprendiz={idAprendizAdmin}
              nuevaBitacora={nuevaBitacora}
              onDatosFormulario={setDatosFormularioBitacora}
            />
          )}
          {estadoSelecionado === 'Documentos' && (
            <DocumentosAprendiz
              idFichaAprendiz={idFichaAprendiz}
              ficha={ficha}
              idAprendiz={idAprendizAdmin}
              nuevoDocumento={nuevaDocumento}
              onTiposDocumentos={setTiposDocumentoDisponibles}
            />
          )}
          {estadoSelecionado === 'Agendamientos' && (
            <AgendamientosAprendiz
              idFichaAprendiz={idFichaAprendiz}
              idFicha={idFicha}
              aprendiz={aprendizInfo}
              nuevoAgendamiento={nuevoAgendamiento}
              ficha={ficha}
            />
          )}
        </>
      )}
      {
        <>
          {estadoSelecionado === 'Bitácoras' && openAgregarBitacora && (
            <FormCrearBitacora
              open={openAgregarBitacora}
              onClose={() => setAgregarBitacora(false)}
              idFichaAprendiz={idFichaAprendiz}
              datosFormulario={datosFormularioBitacora}
              onCrearBitacora={(bitacora) => {
                setNuevaBitacora(bitacora); // guardar la nueva bitácora
                setAgregarBitacora(false); // cerrar el modal
              }}
            />
          )}
          {estadoSelecionado === 'Documentos' && openAgregarDocumento && (
            <FormCrearDocumento
              open={openAgregarDocumento}
              onClose={() => setAgregarDocumento(false)}
              idFichaAprendiz={idFichaAprendiz}
              tiposDisponibles={tiposDocumentoDisponibles}
              onCrearDocumento={(documento) => {
                setNuevaDocumento(documento); // guardar la nueva bitácora
                setAgregarDocumento(false); // cerrar el modal
              }}
            />
          )}
          {estadoSelecionado === 'Agendamientos' && openAgregarAgendamiento && (
            <FormCrearAgendamientoFicha
              open={openAgregarAgendamiento}
              onClose={() => setAgregarAgendamiento(false)}
              idFichaAprendiz={idFichaAprendiz}
              ficha={ficha}
              idInstructor={idInstructor}
              aprendiz={aprendizInfo}
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

export default SegumientoEtapaPracticaAprendiz;
