import axios from 'axios';

//Funcion para configurar un variable para dispara al url de backend
const dataFetchConfig = axios.create( {
    baseURL: process.env.REACT_APP_BACKEND_API_URL,

});

//Falta aniadir los intercertores para par anexar el token de autenticacion

export default dataFetchConfig;