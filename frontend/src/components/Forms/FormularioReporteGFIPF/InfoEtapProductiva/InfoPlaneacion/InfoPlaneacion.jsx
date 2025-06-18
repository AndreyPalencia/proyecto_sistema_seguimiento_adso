import React, { forwardRef, useEffect, useImperativeHandle } from 'react';

import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Typography,
} from '@mui/material';

import InputField from '../../../../FormFields/InputField';
import TextAreaField from '../../../../FormFields/TextAreaField';
import DateFieldColombia from '../../../../FormFields/DateFieldColombia';

import { useFieldArray } from 'react-hook-form';

import { getTodayUtcFromBogota } from '../../../../../utils/utils';

const InfoPlaneacion = forwardRef((props, ref) => {
  const { control, isEdit } = props;
  // Usamos useFieldArray para manejar las actividades como un array
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'infoPlaneacion.actividadesDesarrolladas', // Referencia al campo en el esquema
  });

  // Función para agregar una nueva actividad
  const agregarElemento = () => {
    append({
      actividades: '',
      evidencias: '',
      fecha: getTodayUtcFromBogota(),
      lugar: '',
      observacionesPlaneacion: '',
    });
  };

  useImperativeHandle(ref, () => ({
    agregarElemento,
  }));

  useEffect(() => {
    if (!isEdit) {
      agregarElemento(); // Si no estamos editando, agregamos un campo por defecto
    }
  }, [isEdit]);

  return (
    <>
      <Typography sx={{ padding: '10px' }} component="h5" variant="h6">
        Lista de actividades
      </Typography>
      <Box>
        {/* Iteramos sobre las actividades desarrolladas */}
        <List>
          {fields.map((item, index) => (
            <ListItem
              key={`${item.id} - ${index}`} //`${item.id} - ${index}`
              sx={{
                display: 'flex',
                width: '100%',
                overflow: 'hidden',
                paddingLeft: '12px',
                pb: 3,
                gap: '20px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Box sx={{ width: '350px' }}>
                  <TextAreaField
                    minRows="2"
                    control={control}
                    name={`infoPlaneacion.actividadesDesarrolladas[${index}].actividades`}
                    label="Actividades"
                    required
                  />
                </Box>
                <Box sx={{ width: '350px' }}>
                  <TextAreaField
                    minRows="2"
                    control={control}
                    name={`infoPlaneacion.actividadesDesarrolladas[${index}].evidencias`}
                    label="Evidencias"
                    required
                  />
                </Box>

                <Box sx={{ width: '350px' }}>
                  <TextAreaField
                    minRows="2"
                    name={`infoPlaneacion.actividadesDesarrolladas[${index}].observacionesPlaneacion`}
                    control={control}
                    label="Observaciones"
                  />
                </Box>

                <Box sx={{ width: '200px' }}>
                  <InputField
                    name={`infoPlaneacion.actividadesDesarrolladas[${index}].lugar`}
                    control={control}
                    label="Lugar"
                    required
                  />
                </Box>
                <Box>
                  <DateFieldColombia
                    name={`infoPlaneacion.actividadesDesarrolladas[${index}].fecha`}
                    control={control}
                    label="Fecha"
                    required
                    inputLabel
                  />
                </Box>

                <Button
                  variant="outlined"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  onClick={() => remove(index)}
                  color="error"
                >
                  Eliminar
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
});

export default InfoPlaneacion;
