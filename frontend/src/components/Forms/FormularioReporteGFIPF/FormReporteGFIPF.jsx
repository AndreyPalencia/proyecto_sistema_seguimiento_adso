import React, { memo, useEffect, useRef, useState } from 'react';
import { useAlert } from '../../../context/AlertContext';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Box,
  Stack,
  Button,
  DialogActions,
  CircularProgress,
  IconButton,
  Typography,
  Tooltip,
  LinearProgress,
} from '@mui/material';

import { useInfoGeneralAprendiz } from '../../../hook/useInfoGeneralAprendiz';

// Importación de los componentes de cada pestaña
import InfoGeneralAprendiz from './InfoGeneralAprendiz/InfoGeneralAprendiz';
import InfoEmpresa from './InfoEmpresa/InfoEmpresa';
import InfoPlaneacion from './InfoEtapProductiva/InfoPlaneacion/InfoPlaneacion';
import SeguimientoActitudinalesComportamentales from './InfoEtapProductiva/InfoSeguimiento/SeguimientoActitudinalesComportamentales';
import SeguimientoTecnico from './InfoEtapProductiva/InfoSeguimiento/SeguimientoTecnico';
import EvaluacionDesempeno from './InfoEvaluacionFinal/InfoEvaluacionFinal';

import { useObtenerReporteGFPIFAprendiz } from '../../../hook/reportesGFPIF/useObtenerReporteGFPIFAprendiz';
import { formatErrorsForAlertGFIPF } from '../../../utils/utils';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formReporteGFIPF } from '../../../schemas/formReporteGFIPF'; // El esquema de validación Zod

import {
  formatoSegumientoActitudinalesSimplificado,
  formatoSegumientoTecnicoSimplificado,
} from './InfoEtapProductiva/InfoSeguimiento/FormatoSeguimiento';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

// Componentes memoizados
const MemoizedInfoGeneralAprendiz = memo(
  InfoGeneralAprendiz,
  (prevProps, nextProps) => {
    return (
      prevProps.idFichaAprendiz === nextProps.idFichaAprendiz &&
      prevProps.aprendiz === nextProps.aprendiz &&
      prevProps.ficha === nextProps.ficha
    );
  }
);

const MemoizedInfoEmpresa = memo(InfoEmpresa);
const MemoizedInfoPlaneacion = memo(InfoPlaneacion);
const MemoizedSeguimientoActitudinalesComportamentales = memo(
  SeguimientoActitudinalesComportamentales
);
const MemoizedSeguimientoTecnico = memo(SeguimientoTecnico);
const MemoizedEvaluacionDesempeno = memo(EvaluacionDesempeno);

const FormReporteGFIPF = ({
  idFichaAprendiz,
  idReporte,
  open,
  onClose,
  onNuevoReporte,
  onEditarReporte,
  isEdit = false,
  children,
  isAnimationProgress = false,
  isMultiple = false,
}) => {
  // Estado para manejar el índice de la pestaña seleccionada
  const [selectedTab, setSelectedTab] = useState(0);

  const { ficha, aprendiz, empresa, infoFichaAprendiz, loading } =
    useInfoGeneralAprendiz({
      idFichaAprendiz,
    });

  const {
    reporte,
    loading: loadingReporte,
    fetchReporteGFPIF,
  } = useObtenerReporteGFPIFAprendiz();

  const refPlaneacion = useRef();

  const handleAgregarDesdePadre = () => {
    if (refPlaneacion.current) {
      refPlaneacion.current.agregarElemento();
    }
  };

  // Manejador de cambio de pestaña
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { showAlert } = useAlert();

  // Inicialización de react-hook-form
  //const {handleSumitd, erros, setValue watch}
  const methods = useForm({
    resolver: zodResolver(formReporteGFIPF),
    defaultValues:
      isEdit && reporte
        ? reporte
        : {
            infoGeneral: {},
            infoAprendiz: {},
            infoEmpresa: {},
            infoPlaneacion: {
              actividadesDesarrolladas: [],
            },
            infoSeguimiento: {
              infoSeguimientoInforme: {
                tipoInforme: false,
              },
              factoresEvaluacion: {
                actitudinalesComportamentales:
                  formatoSegumientoActitudinalesSimplificado,
                tecnicos: formatoSegumientoTecnicoSimplificado,
              },
              observacionesEnteConformador: undefined,
              observacionesAprendiz: undefined,
            },
            evaluacionFinal: {},
            infoInstructor: {},
          },
  });

  const onSubmit = async (data) => {
    //console.log(data); // Aquí llega el formulario completo
    if (isEdit) {
      console.log(isEdit, data);
      await onEditarReporte(data);
    } else {
      await onNuevoReporte(data);
    }
    if (!isMultiple) {
      onClose();
    }
  };

  const handleShowErrors = (errors) => {
    const message = formatErrorsForAlertGFIPF(errors);
    showAlert({
      message,
      title: 'Validation Errors',
      severity: 'error',
      variant: 'filled',
    });
  };

  useEffect(() => {
    if (open && isEdit && idReporte) {
      fetchReporteGFPIF(idReporte);
    }
  }, [open, isEdit, idReporte]);

  useEffect(() => {
    // reset form fields or internal state
    methods.reset(); // <- this is a function that clears your internal form state
  }, [idFichaAprendiz]);

  useEffect(() => {
    if (reporte) {
      methods.reset(reporte.datosReporteJSON); // Asumiendo que `datosReporteJSON` tiene el formato del formulario
    }
  }, [reporte]);

  if (loading || (isEdit && loadingReporte)) {
    if (isAnimationProgress) {
      return (
        <Box sx={{ minHeight: '600px', minWidth: '500px', pt: 2, pb: 2 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Cargando datos del aprendiz...
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    !loading && (
      <FormProvider {...methods}>
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
          <DialogTitle>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
                variant="title"
              >
                {`${isEdit ? 'Editar' : 'Crear'} Informe Reporte GFPIF:`}
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
              aria-label="Formulario Reporte GFPIF"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Información General" value={0} />
              <Tab label="Empresa" value={1} />
              <Tab label="Información Planeación" value={2} />
              <Tab label="Información Seguimiento: Parte I" value={3} />
              <Tab label="Información Seguimiento: Parte II" value={4} />
              <Tab label="Evaluación Final" value={5} />
            </Tabs>

            {/* Contenido de cada pestaña */}
            <Box hidden={selectedTab !== 0}>
              <MemoizedInfoGeneralAprendiz
                setValue={methods.setValue}
                idFichaAprendiz={idFichaAprendiz}
                aprendiz={aprendiz}
                ficha={ficha}
                control={methods.control}
                isEdit={isEdit}
              />
            </Box>
            <Box hidden={selectedTab !== 1}>
              <MemoizedInfoEmpresa
                empresa={empresa}
                infoFichaAprendiz={infoFichaAprendiz}
                isEdit={isEdit}
              />
            </Box>
            <Box hidden={selectedTab !== 2}>
              <MemoizedInfoPlaneacion
                ref={refPlaneacion}
                control={methods.control}
                isEdit={isEdit}
              />
            </Box>

            <Box hidden={selectedTab !== 3}>
              <MemoizedSeguimientoActitudinalesComportamentales
                control={methods.control}
                setValue={methods.setValue}
                isEdit={isEdit}
              />
            </Box>
            <Box hidden={selectedTab !== 4}>
              <MemoizedSeguimientoTecnico
                control={methods.control}
                setValue={methods.setValue}
                isEdit={isEdit}
              />
            </Box>
            <Box hidden={selectedTab !== 5}>
              <MemoizedEvaluacionDesempeno
                control={methods.control}
                setValue={methods.setValue}
                watch={methods.watch}
                isEdit={isEdit}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: '100%',
                justifyContent: selectedTab === 2 ? 'space-between' : 'end',
                pl: 4,
                pr: 2,
                pb: 4,
              }}
            >
              {selectedTab === 2 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleAgregarDesdePadre}
                >
                  Agregar Actividad
                </Button>
              )}

              <Stack direction="row" spacing={2}>
                {children}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={methods.handleSubmit(onSubmit, (errors) => {
                    handleShowErrors(errors);
                  })}
                >
                  Guardar reporte
                </Button>
              </Stack>
            </Stack>
          </DialogActions>
        </Dialog>
      </FormProvider>
    )
  );
};

export default FormReporteGFIPF;
