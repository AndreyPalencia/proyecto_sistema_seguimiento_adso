import axios from 'axios';
const { GOOGLE_API_KEY } = process.env;

export const getOptimizedRoute = async ({ origin, destination, waypoints }) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  const waypointParam = waypoints?.length
    ? `&waypoints=optimize:true|${waypoints.map(encodeURIComponent).join('|')}`
    : '';

  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(
    destination
  )}${waypointParam}&key=${GOOGLE_API_KEY}`;

  const { data } = await axios.get(directionsUrl);
  // console.log('Google Directions API response:', JSON.stringify(data, null, 2));
  // console.log('Directions API URL:', directionsUrl);


  if (data.status !== 'OK' || !data.routes?.length) {
    throw new Error(data.error_message || 'Failed to get directions');
  }

  const route = data.routes[0];

  return {
    polyline: route.overview_polyline.points,
    order: route.waypoint_order,
    summary: route.summary,
    legs: route.legs,
  };
};
