import axios from 'axios';
import {
  generarLinkGoogleMaps,
  snapToRoad,
  getAddressFromCoordsConSnap,
  getAddressFromCoords,
} from '../services/googleMaps.js';

const { GOOGLE_API_KEY } = process.env;

const formatLocation = (loc) => {
  if (typeof loc === 'string') return loc;
  if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
    return `${loc.lat},${loc.lng}`;
  }
  throw new Error('Invalid location format');
};

export const getOptimizedRoute = async ({
  origin, // Este es el {lat, lng} original
  destination,
  waypoints = [],
}) => {
  if (
    !origin ||
    typeof origin.lat !== 'number' ||
    typeof origin.lng !== 'number'
  ) {
    throw new Error('Origen no válido');
  }

  if (!destination) {
    throw new Error('Destino no válido');
  }

  // Paso 1: Ajustar el origen a la carretera y obtener su dirección
  // Esto es útil para el 'origin' del link de Google Maps y para mostrar al usuario
  const snappedOriginCoords = await getAddressFromCoordsConSnap(origin); // Esta función ya hace snap y geocodifica
  // La función getAddressFromCoordsConSnap devuelve la dirección, no las coordenadas ajustadas.
  // Necesitamos las coordenadas ajustadas para pasarlas a la API de Directions.
  // Vamos a modificar getAddressFromCoordsConSnap o crear una nueva función para obtener solo las coordenadas ajustadas.

  // --- CAMBIO CLAVE AQUÍ ---
  // En lugar de pasar la dirección geocodificada a la API de Directions,
  // pasaremos las coordenadas ajustadas directamente.
  // Para esto, necesitamos que `getAddressFromCoordsConSnap` devuelva las coordenadas ajustadas,
  // o que tengamos una función separada para `snapToRoad` que devuelva solo las coordenadas.

  // Asumiendo que `getAddressFromCoordsConSnap` se modifica para devolver `{ address: string, lat: number, lng: number }`
  // o que tenemos una función `snapToRoadCoords` que devuelve `{ lat: number, lng: number }`

  // Opción 1: Modificar `getAddressFromCoordsConSnap` para que devuelva también las coordenadas ajustadas
  // (Si no puedes modificarla, ve a la Opción 2)
  // En `googleMaps.js`:
  // export const getAddressFromCoordsConSnap = async (coords) => {
  //   const puntoAjustado = await snapToRoad(coords); // puntoAjustado es { lat, lng }
  //   const address = await getAddressFromCoords(puntoAjustado);
  //   return { address, lat: puntoAjustado.lat, lng: puntoAjustado.lng };
  // };

  // Si `getAddressFromCoordsConSnap` devuelve `{ address, lat, lng }`:
  // const { address: originAddressForDisplay, lat: snappedLat, lng: snappedLng } = await getAddressFromCoordsConSnap(origin);
  // const originForDirections = `${snappedLat},${snappedLng}`;

  // Opción 2: Usar `snapToRoad` directamente para obtener las coordenadas ajustadas
  // (Esta es la opción más sencilla con tu código actual si no quieres modificar `getAddressFromCoordsConSnap`)
  const snappedOriginCoordsForDirections = await snapToRoad(origin); // Asumiendo que snapToRoad devuelve { lat, lng }
  const originForDirections = `${snappedOriginCoordsForDirections.lat},${snappedOriginCoordsForDirections.lng}`;

  // También obtenemos la dirección legible para mostrarla y para el link de Google Maps
  const originAddressForDisplay = await getAddressFromCoords(
    snappedOriginCoordsForDirections
  );

  const formattedDestination = formatLocation(destination);
  const formattedWaypoints = waypoints.map(formatLocation);

  const waypointParam = formattedWaypoints.length
    ? `&waypoints=optimize:true|${formattedWaypoints
        .map(encodeURIComponent)
        .join('|')}`
    : '';

  // Usar las coordenadas ajustadas directamente como origen para la API de Directions
  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    originForDirections // <-- CAMBIO AQUÍ: Usar las coordenadas ajustadas
  )}&destination=${encodeURIComponent(
    formattedDestination
  )}${waypointParam}&key=${GOOGLE_API_KEY}`;

  let data;
  try {
    const response = await axios.get(directionsUrl);
    data = response.data;
  } catch (error) {
    throw new Error('Network error when fetching route: ' + error.message);
  }

  if (data.status !== 'OK' || !data.routes?.length) {
    throw new Error(data.error_message || 'Failed to get directions');
  }

  const route = data.routes[0];
  const orderedWaypoints = route.waypoint_order.map(
    (i) => formattedWaypoints[i]
  );

  // Obtener las coordenadas exactas que la API de Directions usó como origen
  const actualRouteOriginLat = route.legs[0].start_location.lat;
  const actualRouteOriginLng = route.legs[0].start_location.lng;

  // Generar el link de Google Maps usando la dirección legible que obtuvimos
  const mapsUrl = generarLinkGoogleMaps({
    origin: originAddressForDisplay, // <-- Usar la dirección legible para el link
    destination: formattedDestination,
    waypoints: orderedWaypoints,
  });

  // Los marcadores deben usar las coordenadas exactas que la API de Directions usó para el inicio de la ruta
  const markers = [
    `color:blue|label:O|${actualRouteOriginLat},${actualRouteOriginLng}`, // <-- CAMBIO AQUÍ: Usar el inicio real de la ruta
    `color:red|label:D|${formattedDestination}`,
    ...orderedWaypoints.map((wp, i) => `color:green|label:${i + 1}|${wp}`),
  ];

  const markersParam = markers
    .map((m) => `markers=${encodeURIComponent(m)}`)
    .join('&');

  // RECONSTRUIR RUTA PARA COLOREAR CAMINO (esto ya está bien, usa overview_polyline.points)
  const pathPoints = [];

  for (const leg of route.legs) {
    for (const step of leg.steps) {
      const { start_location, end_location } = step;
      pathPoints.push(`${start_location.lat},${start_location.lng}`);
      pathPoints.push(`${end_location.lat},${end_location.lng}`);
    }
  }

  const pathParam = `path=color:0xff0000ff|weight:5|enc:${route.overview_polyline.points}`;

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x600&${pathParam}&${markersParam}&key=${GOOGLE_API_KEY}`;

  return {
    polyline: route.overview_polyline.points,
    order: route.waypoint_order,
    summary: route.summary,
    legs: route.legs,
    originAddress: originAddressForDisplay, // <-- Devolver la dirección legible para mostrar
    staticMapUrl,
    mapsUrl,
  };
};
