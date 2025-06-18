import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAprendiz } from '../../context/AprendizContext';

import { Box, Typography } from '@mui/material';

import SectionInfo from '../../components/Info/SectionInfo/SectionInfo';
import InformationPanel from '../../components/Info/InformationPanel';

import useEmpresaById from '../../hook/empresas/useEmpresaById';

import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const EmpresaAprendiz = () => {
  //Obtenemos el id del aprendiz desde la URL
  const { idAprendiz } = useParams();

  //Estado para almacenar la información de la empresa que pertence el aprendiz
  const [aprendizEmpresa, setAprendizEmpresa] = useState(null);

  //Estado para almacenar el infoFichaAprendiz que contiene los datos tipo contrato, jefe inmediato y cargo
  const [infoFichaAprendiz, setInfoFichaAprendiz] = useState(null);

  const [idEmpresaActual, setIdEmpresaActual] = useState(null);

  //Obtenemos del contexto de aprendices la funciones para selecionar un grupo de propieda del aprendiz
  //y una para actualizar un propiedad de un aprendiz en el contexto y el listado de los aprendices
  const { aprendiz, getPropiedad, loading } = useAprendiz();

  //Hook personalizado para cargar la empresa
  const { empresa } = useEmpresaById(idEmpresaActual);

  //Esperar a que `seleccionarAprendizByPropiedad` devuelva algo válido
  useEffect(() => {
    if (aprendiz === null) return;
    const info = getPropiedad('infoFichaAprendiz');
    setInfoFichaAprendiz(info);
    setIdEmpresaActual(info?.idEmpresa);
  }, [aprendiz]); // 👈 solo se ejecuta cuando 'aprendiz' cambia

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

          <SectionInfo
            titulo="Información Empresa"
            icono={<BusinessRoundedIcon className="icon-section-info" />}
          >
            <InformationPanel
              disableModal
              name="razonSocial"
              titulo="Nombre de la empresa"
              item={aprendizEmpresa?.razonSocial}
              fetchUpdate={() => {}}
            />

            <InformationPanel
              disableModal
              name="nit"
              titulo="NIT de la empresa"
              item={aprendizEmpresa?.nit}
              //type="number"
              fetchUpdate={() => {}}
            />
            <InformationPanel
              disableModal
              name="direccion"
              titulo="Dirección de la empresa"
              item={aprendizEmpresa?.direccion}
              fetchUpdate={() => {}}
            />
            <InformationPanel
              disableModal
              name="telefono"
              titulo="Telefono de la empresa"
              item={aprendizEmpresa?.telefono}
              type="number"
              fetchUpdate={() => {}}
            />
            <InformationPanel
              disableModal
              name="correoElectronico"
              titulo="Correo electrónico de la empresa"
              item={aprendizEmpresa?.correoElectronico}
              isLast={true}
              fetchUpdate={() => {}}
            />
          </SectionInfo>

          <SectionInfo
            titulo="Información del practicas"
            icono={<BadgeRoundedIcon className="icon-section-info" />}
          >
            <InformationPanel
              disableModal
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
              isArrayOptions
            />
            <InformationPanel
              disableModal
              name="cargoEmpresa"
              titulo="Cargo en la empresa"
              item={infoFichaAprendiz?.cargoEmpresa}
              fetchUpdate={() => {}}
              isLast
            />
          </SectionInfo>
          <SectionInfo
            titulo="Información Jefe Inmediato"
            icono={<InfoOutlinedIcon className="icon-section-info" />}
          >
            <InformationPanel
              disableModal
              name="jefeInmediato"
              titulo="Jefe inmediato"
              item={infoFichaAprendiz?.jefeInmediato}
              fetchUpdate={() => {}}
            />
            <InformationPanel
              disableModal
              name="telefonoJefe"
              titulo="Telefono del Jefe inmediato"
              item={infoFichaAprendiz?.telefonoJefe}
              type="number"
              fetchUpdate={() => {}}
            />
            <InformationPanel
              disableModal
              name="cargoJefe"
              titulo="Cargo del Jefe Inmediato"
              item={infoFichaAprendiz?.cargoJefe}
              fetchUpdate={() => {}}
            />
            <InformationPanel
              disableModal
              name="correoElectronicoJefe"
              titulo="Correo electrónico del Jefe Inmediato"
              item={infoFichaAprendiz?.correoElectronicoJefe}
              isLast={true}
              fetchUpdate={() => {}}
            />
          </SectionInfo>
        </Box>
      )}
    </>
  );
};

export default EmpresaAprendiz;
