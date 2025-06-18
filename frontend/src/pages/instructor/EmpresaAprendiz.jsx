import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAprendices } from '../../context/AprendicesContext';
import { useAlert } from '../../context/AlertContext';

import { Box, Typography } from '@mui/material';

import { modificarEmpresa } from '../../services/Empresa';
import { modificarFichaAprendiz } from '../../services/FichaAprendiz';

import SectionInfo, {
  CollapsibleSection,
} from '../../components/Info/SectionInfo/SectionInfo';
import InformationPanel from '../../components/Info/InformationPanel';
import FormSearchEmpresa from '../../components/Forms/FormEmpresa/FormSearchEmpresa';

import useEmpresaById from '../../hook/empresas/useEmpresaById';

import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const EmpresaAprendiz = () => {
  //Obtenemos el id del aprendiz desde la URL
  const { idAprendiz } = useParams();

  //Estado para almacenar la información de la empresa que pertence el aprendiz
  const [aprendizEmpresa, setAprendizEmpresa] = useState(null);

  //Estado para almacenar el infoFichaAprendiz que contiene los datos tipo contrato, jefe inmediato y cargo
  const [infoFichaAprendiz, setInfoFichaAprendiz] = useState(null);

  //Obtenemos del contexto de aprendices la funciones para selecionar un grupo de propieda del aprendiz
  //y una para actualizar un propiedad de un aprendiz en el contexto y el listado de los aprendices
  const {
    seleccionarAprendizByPropiedad,
    actualizarPropiedadDeAprendiz,
    aprendices,
  } = useAprendices();

  //Permite mostrar alert en la vista
  const { showAlert } = useAlert();

  const idFichaAprendiz = infoFichaAprendiz?.idFichaAprendiz;
  const idEmpresa = infoFichaAprendiz?.idEmpresa;

  //Nuevo estado controlado para la empresa actual
  const [idEmpresaActual, setIdEmpresaActual] = useState(null);

  //Hook personalizado para cargar la empresa
  const { empresa, loading } = useEmpresaById(idEmpresaActual);

  //Funcion que actualiza la info del empresa
  const actualizarEmpresa = async (formEmpresa) => {
    try {
      const updateEmpresa = await modificarEmpresa(idEmpresa, formEmpresa);
      //console.log(updateEmpresa, 'updataEMprs');
      setAprendizEmpresa(updateEmpresa);
      //console.log(aprendizEmpresa);

      showAlert({
        message: 'Se actualizo con exito la empresa.',
        variant: 'standard',
        severity: 'info',
      });
    } catch (error) {
      console.error('Error al actualizar los datos', error);
      showAlert({
        title: 'Error',
        message: `Error al modificar el agendamiento: ${error.message}`,
        severity: 'error',
        variant: 'filled',
      });
    }
  };

  const actualizarInfoAprendizEmpresa = async (formFichaAprendiz) => {
    try {
      const updateFichaAprendiz = await modificarFichaAprendiz(
        idFichaAprendiz,
        formFichaAprendiz
      );
      console.log('updateFicha', updateFichaAprendiz);
      setInfoFichaAprendiz(updateFichaAprendiz);
      actualizarPropiedadDeAprendiz(
        idAprendiz,
        formFichaAprendiz,
        'infoFichaAprendiz'
      );
      //console.log('infoFichaA', infoFichaAprendiz);
      showAlert({
        message:
          'Se actualizo con exito la información sobre practicas del aprendiz.',
        variant: 'standard',
        severity: 'info',
      });
    } catch (error) {
      console.error('Error al actualizar los datos', error);
      showAlert({
        title: 'Error',
        message: `Error al modificar la información sobre practicas del aprendiz. : ${error.message}`,
        severity: 'error',
        variant: 'filled',
      });
    }
  };

  const handleCambioEmpresa = (nuevaEmpresaId) => {
    console.log('handleCambioEmpresa', nuevaEmpresaId);

    // Actualizamos en el contexto global
    actualizarPropiedadDeAprendiz(
      idAprendiz,
      { idEmpresa: nuevaEmpresaId },
      'infoFichaAprendiz'
    );

    showAlert({
      message: `Se actualizó la información del aprendiz respecto a la empresa.`,
      severity: 'info',
      variant: 'standard'
    });

    // Refrescamos localmente la ficha y el ID empresa
    setInfoFichaAprendiz((prev) => ({
      ...prev,
      idEmpresa: nuevaEmpresaId,
    }));

    // Esto forzará que el hook useEmpresaById se dispare de nuevo
    setIdEmpresaActual(nuevaEmpresaId);
  };

  //Esperar a que `seleccionarAprendizByPropiedad` devuelva algo válido
  useEffect(() => {
    if (aprendices.length === 0) return;

    const aprendiz = seleccionarAprendizByPropiedad(
      idAprendiz,
      'infoFichaAprendiz'
    );

    if (aprendiz && aprendiz.idEmpresa) {
      setInfoFichaAprendiz(aprendiz);
      setIdEmpresaActual(aprendiz.idEmpresa);
    }
  }, [aprendices.length, idAprendiz]);

  useEffect(() => {
    if (empresa) {
      setAprendizEmpresa(empresa);
    }
  }, [empresa]);

  // Solo depende de 'empresa', y se actualiza cuando 'empresa' cambia

  return (
    <>
      {loading || !empresa ? (
        <Box
          component="main"
          className="box-main-info"
          sx={{ marginBottom: 2 }}
        >
          <Typography
            component="h2"
            variant="h5"
            className="typography-title-info"
            fontSize="28px"
            fontWeight="bold"
          >
            {loading
              ? 'Cargando...'
              : '  No se pudo obtener la información de la empresa.'}
          </Typography>
        </Box>
      ) : (
        <Box
          component="main"
          className="box-main-info"
          sx={{ marginBottom: 2 }}
        >
          <Typography
            component="h2"
            variant="h5"
            className="typography-title-info"
            fontSize="28px"
            fontWeight="bold"
          >
            Información de la Empresa
          </Typography>

          <CollapsibleSection
            titulo="Selecionar nueva Empresa"
            icono={<SearchRoundedIcon className="icon-section-info" />}
          >
            {
              <FormSearchEmpresa
                onEmpresaActualizar={handleCambioEmpresa}
                idFichaAprendiz={infoFichaAprendiz.idFichaAprendiz}
                idEmpresa={idEmpresa}
              />
            }
          </CollapsibleSection>

          <SectionInfo
            titulo="Información Empresa"
            icono={<BusinessRoundedIcon className="icon-section-info" />}
          >
            <InformationPanel
              name="razonSocial"
              titulo="Nombre de la empresa"
              item={aprendizEmpresa?.razonSocial}
              fetchUpdate={actualizarEmpresa}
            />

            <InformationPanel
              name="nit"
              titulo="NIT de la empresa"
              item={aprendizEmpresa?.nit}
              //type="number"
              fetchUpdate={actualizarEmpresa}
            />
            <InformationPanel
              name="direccion"
              titulo="Dirección de la empresa"
              item={aprendizEmpresa?.direccion}
              fetchUpdate={actualizarEmpresa}
            />
            <InformationPanel
              name="telefono"
              titulo="Telefono de la empresa"
              item={aprendizEmpresa?.telefono}
              type="number"
              fetchUpdate={actualizarEmpresa}
            />
            <InformationPanel
              name="correoElectronico"
              titulo="Correo electrónico de la empresa"
              item={aprendizEmpresa?.correoElectronico}
              isLast={true}
              fetchUpdate={actualizarEmpresa}
            />
          </SectionInfo>

          <SectionInfo
            titulo="Información del practicas"
            icono={<BadgeRoundedIcon className="icon-section-info" />}
          >
            <InformationPanel
              name="alternativa"
              titulo="Alternativa de practicas"
              tag="select"
              item={infoFichaAprendiz?.alternativa}
              menuOpciones={[
                'Contrato de Aprendizaje',
                'Pasantía',
                'Proyecto Productivo',
                'Monitoría',
              ]}
              fetchUpdate={actualizarInfoAprendizEmpresa}
              isArrayOptions
            />
            <InformationPanel
              name="cargoEmpresa"
              titulo="Cargo en la empresa"
              item={infoFichaAprendiz?.cargoEmpresa}
              fetchUpdate={actualizarInfoAprendizEmpresa}
              isLast
            />
          </SectionInfo>
          <SectionInfo
            titulo="Información Jefe Inmediato"
            icono={<InfoOutlinedIcon className="icon-section-info" />}
          >
            <InformationPanel
              name="jefeInmediato"
              titulo="Jefe inmediato"
              item={infoFichaAprendiz?.jefeInmediato}
              fetchUpdate={actualizarInfoAprendizEmpresa}
            />
            <InformationPanel
              name="telefonoJefe"
              titulo="Telefono del Jefe inmediato"
              item={infoFichaAprendiz?.telefonoJefe}
              type="number"
              fetchUpdate={actualizarInfoAprendizEmpresa}
            />
            <InformationPanel
              name="cargoJefe"
              titulo="Cargo del Jefe Inmediato"
              item={infoFichaAprendiz?.cargoJefe}
              fetchUpdate={actualizarInfoAprendizEmpresa}
            />
            <InformationPanel
              name="correoElectronicoJefe"
              titulo="Correo electrónico del Jefe Inmediato"
              item={infoFichaAprendiz?.correoElectronicoJefe}
              isLast={true}
              fetchUpdate={actualizarInfoAprendizEmpresa}
            />
          </SectionInfo>
        </Box>
      )}
    </>
  );
};

export default EmpresaAprendiz;
