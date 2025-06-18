import { useParams } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';

import { Box, Typography, Button, Divider } from '@mui/material';

import SelectField from '../components/FormFields/SelectField';
import CheckboxField from '../components/FormFields/CheckboxField';

import { descarReporteFichaGeneral } from '../services/ArchivosGenerados';
import { useFichasTransformadas } from '../hook/useFichasTransformadas';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import formReporteGeneralFichas from '../schemas/formReporteGeneralFichas';

const ReporteGeneralFichas = () => {
  const { idInstructor } = useParams();
  const { fichas } = useFichasTransformadas({ idInstructor });

  const { showAlert } = useAlert();

  const bitacoras = Array.from({ length: 12 }, (_, i) => ({
    label: `Bitácora ${i + 1}`,
    value: i + 1,
  }));

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formReporteGeneralFichas),
    defaultValues: {
      ficha: '',

      aprendiz: {
        nombre: true,
        numeroDocumento: true,
        tipoDocumento: false,
        telefono: false,
        correoElectronico: false,
      },
      empresa: {
        nit: true,
        razonSocial: true,
        telefono: true,
        correoElectronico: true,
        direccion: true,
        jefeInmediato: true,
      },
      reportes: {
        numeroVisitas: '3',
        numeroBitacoras: '12',
        bitacorasAprobadas: true,
        visitasRealizadas: true,
      },
    },
  });

  const onSubmit = async (data) => {
    console.log(data, 'data');
    try {
      await descarReporteFichaGeneral(data);
    } catch (error) {
      console.error('Error al crear el reporte de fichas:', error);
      showAlert({
        message: `Ocurrio un error al crear el reporte: ${error.message}`,
        severity: 'warning',
        variant: 'standard',
      });
    }
  };

  return (
    <Box sx={{ py: '35px' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campo de búsqueda */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            paddingBottom: 3,
          }}
        >
          <Typography sx={{ fontWeight: 'bold', mr: 2 }}>Ficha:</Typography>
          <SelectField
            name="ficha"
            label="Fichas"
            control={control}
            menuOptions={fichas}
            labelKey="nombre"
            valueKey="idFicha"
          />
          {/* {console.log(fichas)} */}
        </Box>

        {/* Información Aprendiz */}
        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
          Información Aprendiz
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mb: 3,
            pb: 8,
            pt: 3,
          }}
        >
          <CheckboxField
            name="aprendiz.nombre"
            label="Nombre del aprendiz"
            control={control}
          />
          <CheckboxField
            name="aprendiz.numeroDocumento"
            label="Número de documento"
            control={control}
          />
          <CheckboxField
            name="aprendiz.tipoDocumento"
            label="Tipo de documento"
            control={control}
          />
          <CheckboxField
            name="aprendiz.telefono"
            label="Teléfono"
            control={control}
          />
          <CheckboxField
            name="aprendiz.correoElectronico"
            label="Correo electrónico"
            control={control}
          />
        </Box>

        {/* Datos de empresa */}
        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
          Datos de empresa
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mb: 3,
            pb: 8,
            pt: 3,
          }}
        >
          <CheckboxField name="empresa.nit" label="Nit" control={control} />
          <CheckboxField
            name="empresa.razonSocial"
            label="Nombre de empresa"
            control={control}
          />
          <CheckboxField
            name="empresa.telefono"
            label="Teléfono"
            control={control}
          />
          <CheckboxField
            name="empresa.correoElectronico"
            label="Correo electrónico"
            control={control}
          />
          <CheckboxField
            name="empresa.direccion"
            label="Dirección"
            control={control}
          />
          <CheckboxField
            name="empresa.jefeInmediato"
            label="Nombre del Jefe"
            control={control}
          />
        </Box>

        {/* Observaciones, visitas y bitácoras */}
        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
          {' '}
          Visitas y bitácoras
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '400px',
              gap: '10px',
            }}
          >
            <Typography sx={{ mr: 1 }}>Visita</Typography>
            <Box sx={{ minWidth: '210px' }}>
              <SelectField
                name="reportes.numeroVisitas"
                label="Visita/Agendamiento"
                control={control}
                menuOptions={[
                  { label: 'Visita 1', value: 1 },
                  { label: 'Visita 2', value: 2 },
                  { label: 'Visita 3', value: 3 },
                ]}
              />
            </Box>
            <Box sx={{ minWidth: '210px' }}>
              <CheckboxField
                name="reportes.visitasRealizadas"
                label="Visitas solo realizadas"
                control={control}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '400px',
              gap: '10px',
            }}
          >
            <Typography sx={{ mr: 1 }}>Bitácoras</Typography>
            <Box sx={{ minWidth: '210px' }}>
              <SelectField
                name="reportes.numeroBitacoras"
                label="Bitácora"
                control={control}
                menuOptions={bitacoras}
              />
            </Box>
            <Box sx={{ minWidth: '210px' }}>
              <CheckboxField
                name="reportes.bitacorasAprobadas"
                label="Bitacoras aprobadas"
                control={control}
              />
            </Box>
          </Box>
        </Box>
        {/* Botón */}
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Generar reporte
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReporteGeneralFichas;
