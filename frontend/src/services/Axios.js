import axios from 'axios';
import { createErrorObj } from '../utils/errorUtils'; // Importa la función

// Configuración del cliente API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_API_URL,
  withCredentials: true, // Enviar cookies automáticamente
});

// Interceptor para manejar la respuesta de la petición
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Maneja casos donde no hay respuesta del servidor
      console.error('Sin respuesta: ', error.request || error.message);
      return Promise.reject(
        createErrorObj(0, { message: 'No se recibió respuesta del servidor.' })
      );
    }

    // Si hay una respuesta del servidor, maneja el error
    const { status, data, ...rest } = error.response;

    if (status === 401 && data?.message === 'Token expirado') {
      // Redirect to login only if token expired
      window.location.href = '/auth/login';
    }

    //console.log({ response: rest, resquest: error.request });

    // Mostrar detalles de error solo en modo desarrollo
    if (import.meta.env.VITE_APP_MODE === 'development' && data?.error) {
      console.error('Error del servidor: ', status);
      console.error('Detalles del error: ', data); // Muestra detalles solo en desarrollo
    }

    // Crear el objeto de error con la respuesta del servidor

    //console.log('errro capturado', createErrorObj(status, data));
    return Promise.reject(createErrorObj(status, data));
  }
);

const apiFileClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_API_URL,
  withCredentials: true,
  responseType: 'blob', // important for file download
});

// Interceptor for file client to handle errors (blob or JSON errors)
apiFileClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('No response:', error.request || error.message);
      return Promise.reject(
        createErrorObj(0, { message: 'No se recibió respuesta del servidor.' })
      );
    }

    const { status, data, headers } = error.response;

    if (status === 401 && data?.message === 'Token expirado') {
      // Redirect to login only if token expired
      window.location.href = '/auth/login';
    }

    // Try to parse JSON if error response is a Blob with JSON content-type
    if (
      data instanceof Blob &&
      headers['content-type']?.includes('application/json')
    ) {
      try {
        const text = await new Response(data).text();
        const json = JSON.parse(text);
        if (import.meta.env.VITE_APP_MODE === 'development') {
          console.error('File download JSON error:', json);
        }
        return Promise.reject(createErrorObj(status, json));
      } catch (parseError) {
        console.error('Error parsing JSON from blob:', parseError);
        return Promise.reject(
          createErrorObj(status, {
            message: 'Error desconocido al procesar la respuesta del servidor',
          })
        );
      }
    }

    // If not a blob JSON error, just reject with raw data
    return Promise.reject(createErrorObj(status, data));
  }
);

export { apiClient, apiFileClient };
