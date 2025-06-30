import { useEffect, useState } from 'react';
import { obtenerFirmaUsuario } from '../../services/ArchivosGenerados';

const FirmaUsuario = ({ nombreArchivo }) => {
  const [firmaUrl, setFirmaUrl] = useState(null);
  const [error, setError] = useState(null);

  console.log(nombreArchivo);

  const archivo = nombreArchivo?.trim() ? nombreArchivo : 'img_tranparente.png';
  console.log('valor evaluado como archivo:', archivo);

  useEffect(() => {
    const cargarFirma = async () => {
      try {
        const url = await obtenerFirmaUsuario(archivo);
        setFirmaUrl(url);
      } catch (err) {
        console.error('Error al cargar la firma:', err);
        setError('No se pudo cargar la firma');
      }
    };

    cargarFirma();
  }, [archivo]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!firmaUrl) return <p>Cargando firma...</p>;

  return (
    <img src={firmaUrl} alt="Firma del usuario" style={{ maxHeight: 120 }} />
  );
};

export default FirmaUsuario;
