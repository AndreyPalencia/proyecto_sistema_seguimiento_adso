import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAprendiz } from '../../context/AprendizContext';
import { useParams } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';

import { Box, Typography } from '@mui/material';

import SectionInfo, {
  CollapsibleSection,
} from '../../components/Info/SectionInfo/SectionInfo';
import InformationPanel from '../../components/Info/InformationPanel';
import FormSearchEmpresa from '../../components/Forms/FormEmpresa/FormSearchEmpresa';

import useEmpresaById from '../../hook/empresas/useEmpresaById';
import { useEditarEmpresa } from '../../hook/empresas/useEditarEmpresa';
import { useEditarInfoAprendizEmpresa } from '../../hook/empresas/useEditarInfoAprendizEmpresa';

import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const EmpresaAprendiz = () => {
  const { idAprendizAdmin } = useParams();

  const { roleUsuario } = useAuth();

  const isAdmin = roleUsuario === 'admin';
  //Obtenemos del contexto de aprendices la funciones para selecionar un grupo de propieda del aprendiz
  //y una para actualizar un propiedad de un aprendiz en el contexto y el listado de los aprendices
  const { aprendiz, getPropiedad, actualizarPropiedad, loading } =
    useAprendiz();

  const { editarEmpresa, loading: loadingEditarEmpresa } = useEditarEmpresa();

  const { editarInfoAprendizEmpresa, loading: loadingInfoEmpresaAprendiz } =
    useEditarInfoAprendizEmpresa();

  //Permite mostrar alert en la vista
  const { showAlert } = useAlert();

  //Estado para almacenar la información de la empresa que pertence el aprendiz
  const [aprendizEmpresa, setAprendizEmpresa] = useState(null);

  //Estado para almacenar el infoFichaAprendiz que contiene los datos tipo contrato, jefe inmediato y cargo
  const [infoFichaAprendiz, setInfoFichaAprendiz] = useState(null);

  const [idEmpresaActual, setIdEmpresaActual] = useState(null);

  //Hook personalizado para cargar la empresa
  const { empresa } = useEmpresaById(idEmpresaActual);

  const idFichaAprendiz = infoFichaAprendiz?.idFichaAprendiz;
  const idEmpresa = infoFichaAprendiz?.idEmpresa;

  //Funcion que actualiza la info del empresa
  const actualizarEmpresa = async (formEmpresa) => {
    const updateEmpresa = await editarEmpresa(idEmpresa, formEmpresa);
    if (updateEmpresa) {
      setAprendizEmpresa(updateEmpresa);
    }
  };

  const actualizarInfoAprendizEmpresa = async (formFichaAprendiz) => {
    const updateFichaAprendiz = await editarInfoAprendizEmpresa(
      idFichaAprendiz,
      formFichaAprendiz
    );
    if (updateFichaAprendiz) {
      setInfoFichaAprendiz(updateFichaAprendiz);
      actualizarPropiedad('infoFichaAprendiz', formFichaAprendiz);
    }
  };

  const handleCambioEmpresa = (nuevaEmpresaId) => {
    //console.log('handleCambioEmpresa', nuevaEmpresaId);

    // Actualizamos en el contexto global
    actualizarPropiedad('infoFichaAprendiz', { idEmpresa: nuevaEmpresaId });

    showAlert({
      message: `Se actualizó la información del aprendiz respecto a la empresa.`,
      severity: 'info',
      variant: 'standard',
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
    if (aprendiz === null) return;
    const info = getPropiedad('infoFichaAprendiz');
    setInfoFichaAprendiz(info);
    setIdEmpresaActual(info?.idEmpresa);
  }, [aprendiz, idAprendizAdmin]); // 👈 solo se ejecuta cuando 'aprendiz' cambia

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

          {isAdmin && (
            <CollapsibleSection
              titulo="Selecionar nueva Empresa"
              icono={<SearchRoundedIcon className="icon-section-info" />}
            >
              {
                <FormSearchEmpresa
                  onEmpresaActualizar={handleCambioEmpresa}
                  idFichaAprendiz={idFichaAprendiz}
                  idEmpresa={idEmpresa}
                />
              }
            </CollapsibleSection>
          )}

          <SectionInfo
            titulo="Información Empresa"
            icono={<BusinessRoundedIcon className="icon-section-info" />}
          >
            <InformationPanel
              disableModal={!isAdmin}
              name="razonSocial"
              titulo="Nombre de la empresa"
              item={aprendizEmpresa?.razonSocial}
              fetchUpdate={isAdmin ? actualizarEmpresa : () => {}}
            />

            <InformationPanel
              disableModal={!isAdmin}
              name="nit"
              titulo="NIT de la empresa"
              item={aprendizEmpresa?.nit}
              //type="number"
              fetchUpdate={isAdmin ? actualizarEmpresa : () => {}}
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="direccion"
              titulo="Dirección de la empresa"
              item={aprendizEmpresa?.direccion}
              fetchUpdate={isAdmin ? actualizarEmpresa : () => {}}
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="telefono"
              titulo="Telefono de la empresa"
              item={aprendizEmpresa?.telefono}
              type="number"
              fetchUpdate={isAdmin ? actualizarEmpresa : () => {}}
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="correoElectronico"
              titulo="Correo electrónico de la empresa"
              item={aprendizEmpresa?.correoElectronico}
              isLast={true}
              fetchUpdate={isAdmin ? actualizarEmpresa : () => {}}
            />
          </SectionInfo>

          <SectionInfo
            titulo="Información del practicas"
            icono={<BadgeRoundedIcon className="icon-section-info" />}
          >
            <InformationPanel
              disableModal={!isAdmin}
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
              fetchUpdate={isAdmin ? actualizarInfoAprendizEmpresa : () => {}}
              isArrayOptions
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="cargoEmpresa"
              titulo="Cargo en la empresa"
              item={infoFichaAprendiz?.cargoEmpresa}
              fetchUpdate={isAdmin ? actualizarInfoAprendizEmpresa : () => {}}
              isLast
            />
          </SectionInfo>
          <SectionInfo
            titulo="Información Jefe Inmediato"
            icono={<InfoOutlinedIcon className="icon-section-info" />}
          >
            <InformationPanel
              disableModal={!isAdmin}
              name="jefeInmediato"
              titulo="Jefe inmediato"
              item={infoFichaAprendiz?.jefeInmediato}
              fetchUpdate={isAdmin ? actualizarInfoAprendizEmpresa : () => {}}
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="telefonoJefe"
              titulo="Telefono del Jefe inmediato"
              item={infoFichaAprendiz?.telefonoJefe}
              type="number"
              fetchUpdate={isAdmin ? actualizarInfoAprendizEmpresa : () => {}}
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="cargoJefe"
              titulo="Cargo del Jefe Inmediato"
              item={infoFichaAprendiz?.cargoJefe}
              fetchUpdate={isAdmin ? actualizarInfoAprendizEmpresa : () => {}}
            />
            <InformationPanel
              disableModal={!isAdmin}
              name="correoElectronicoJefe"
              titulo="Correo electrónico del Jefe Inmediato"
              item={infoFichaAprendiz?.correoElectronicoJefe}
              isLast={true}
              fetchUpdate={isAdmin ? actualizarInfoAprendizEmpresa : () => {}}
            />
          </SectionInfo>
        </Box>
      )}
    </>
  );
};

export default EmpresaAprendiz;
