// utils/geolocation.js
export const obtenerUbicacionActual = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(
        new Error('La geolocalización no está soportada por este navegador.')
      );
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
