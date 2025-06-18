import { Typography, Divider, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * Estilos para la caja que contiene la información.
 * Se le aplica un borde y un borde redondeado para un mejor diseño visual.
 */
export const BoxInformacion = styled(Box)(({ theme }) => ({
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: '7px',
  padding: '10px 15px',
}));

/**
 * Estilos para la caja que contiene el título.
 * Utiliza display flex para alinear el icono y el título de manera horizontal.
 */
export const BoxTitulo = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1px',
  paddingBottom: '10px',
}));

/**
 * Componente `SectionInfo` que encapsula un título, un icono y contenido.
 * Permite pasar un ícono, un título y los hijos (contenido) como props.
 *
 * @param {Object} param - Props del componente.
 * @param {ReactNode} param.icono - Ícono que se muestra junto al título.
 * @param {string} [param.titulo='Unknow'] - Título de la sección.
 * @param {ReactNode} param.children - Contenido adicional que se pasa dentro de la sección.
 *
 * @returns {JSX.Element} Componente de sección con título e icono.
 */
const SectionInfo = ({ icono, titulo = 'Unknow', children }) => {
  return (
    <>
      {/* Caja que contiene toda la sección de información */}
      <BoxInformacion component="section">
        {/* Caja con título e ícono */}
        <BoxTitulo component="article">
          {/* Botón de icono (generalmente se usará un ícono en cada sección) */}
          <IconButton size="small">{icono}</IconButton>
          {/* Título de la sección */}
          <Typography component="h3" variant="subtitle1" fontWeight="bold">
            {titulo}
          </Typography>
        </BoxTitulo>

        {/* Divider: Línea divisoria entre el título y el contenido */}
        <Divider />

        {/* Los hijos son el contenido que se pasa dentro de esta sección */}
        {children}
      </BoxInformacion>
    </>
  );
};

/**
 * Componente `CollapsibleSection` que incluye dos íconos para activar/desactivar la vista y un estado adicional.
 * Utiliza un estado para controlar la visibilidad y el estado de "start" o "stop".
 *
 * @param {Object} param - Props del componente.
 * @param {ReactNode} param.icono - Ícono que permite activar/desactivar la vista.
 * @param {string} param.titulo - Título que se muestra junto a los íconos.
 * @param {ReactNode} param.children - Contenido que será mostrado u ocultado.
 *
 * @returns {JSX.Element} Componente con el control de visibilidad y estado adicional.
 */
export const CollapsibleSection = ({ icono, titulo, children }) => {
  const [visible, setVisible] = useState(false);

  // Función para alternar la visibilidad
  const toggleVisibility = () => setVisible(!visible);

 return (
   <>
     <BoxInformacion component="section">
       <BoxTitulo
         sx={{ justifyContent: 'space-between' }}
         onClick={toggleVisibility}
       >
         {/* Icono y Título juntos */}
         <div style={{ display: 'flex', alignItems: 'center' }}>
           {/* Icono */}
           <IconButton size="small">{icono}</IconButton>

           {/* Título */}
           <Typography component="h3" variant="subtitle1" fontWeight="bold">
             {titulo}
           </Typography>
         </div>

         {/* Botón para controlar el estado "start/stop" */}
         <IconButton size="small" onClick={toggleVisibility} sx={{ pr: 1 }}>
           {visible ? (
             <KeyboardArrowUpIcon sx={{ fontSize: '30px' }} />
           ) : (
             <KeyboardArrowDownIcon sx={{ fontSize: '30px' }} />
           )}
         </IconButton>
       </BoxTitulo>

       {/* Solo se muestra el contenido si está visible */}
       <Box
         sx={{
           maxHeight: visible ? '500px' : '0', // Controla la altura visible
           overflow: 'hidden', // Esconde el contenido cuando está colapsado
           transition: 'max-height 0.3s ease-out', // Animación de la altura
         }}
       >
         {visible && (
           <>
             <Divider />
             {children}
           </>
         )}
       </Box>
     </BoxInformacion>
   </>
 );
};
export default SectionInfo;
