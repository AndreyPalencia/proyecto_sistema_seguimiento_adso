import axios from 'axios';
const { GOOGLE_API_KEY } = process.env;

// Exporta snapToRoad para que pueda ser usada directamente
export const snapToRoad = async ({ lat, lng }) => {
  // <-- Añadir `export`
  if (!lat || !lng) {
    throw new Error('Coordenadas inválidas para SnapToRoad');
  }

  const url = `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&key=${GOOGLE_API_KEY}`;

  const { data } = await axios.get(url);

  if (!data.snappedPoints || data.snappedPoints.length === 0) {
    throw new Error('No se pudo ajustar la ubicación a una vía cercana');
  }

  const location = data.snappedPoints[0].location;

  return {
    lat: location.latitude,
    lng: location.longitude,
  };
};

export const getAddressFromCoords = async ({ lat, lng }) => {
  if (!lat || !lng) {
    throw new Error('Coordenadas inválidas');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

  const { data } = await axios.get(url);

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(
      data.error_message || 'No se pudo convertir las coordenadas a dirección'
    );
  }

  return data.results[0].formatted_address; // dirección legible
};

// getAddressFromCoordsConSnap ahora puede usar la versión exportada de snapToRoad
export const getAddressFromCoordsConSnap = async (coords) => {
  const puntoAjustado = await snapToRoad(coords); // Usa la función exportada
  return await getAddressFromCoords(puntoAjustado);
};

export const generarLinkGoogleMaps = ({
  origin,
  destination,
  waypoints = [],
}) => {
  const encodeCoord = (punto) => {
    if (typeof punto === 'string') return punto; // dirección ya formateada
    if (typeof punto === 'object' && punto.lat && punto.lng) {
      return `${punto.lat},${punto.lng}`;
    }
    throw new Error('Waypoint inválido');
  };

  const baseUrl = 'https://www.google.com/maps/dir/?api=1';

  const originStr = encodeURIComponent(encodeCoord(origin));
  const destinationStr = encodeURIComponent(encodeCoord(destination));
  const waypointsStr = waypoints
    .map(encodeCoord)
    .map(encodeURIComponent)
    .join('|');

  const url = `${baseUrl}&origin=${originStr}&destination=${destinationStr}${
    waypoints.length ? `&waypoints=${waypointsStr}` : ''
  }&travelmode=driving`;

  return url;
};
