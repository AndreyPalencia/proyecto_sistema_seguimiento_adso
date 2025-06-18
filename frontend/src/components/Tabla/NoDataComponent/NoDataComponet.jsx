import React from 'react';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

const NoDataComponent = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '250px',
        textAlign: 'center',
        padding: '1rem',
        fontSize: '1.2rem',
        marginBottom: '0.5rem',
      }}
    >
      <TableChartOutlinedIcon
        style={{ fontSize: '2.3rem', marginBottom: '1rem' }}
      />
      <p>No hay datos disponibles</p>
    </div>
  );
};

export default NoDataComponent;
