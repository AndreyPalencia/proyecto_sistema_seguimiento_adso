import { Sequelize } from "sequelize";
const {DB_NAME, DB_USER, DB_PASS, DB_HOST} = process.env;

/**
 * Crea una nueva instancia de Sequelize con los datos de conexión
 * a la base de datos que se encuentran en las variables de entorno
 * DB_NAME, DB_USER, DB_PASS, DB_HOST
 */

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql", //Dialecto de la base de datos
  logging: false, // Desactiva los logs de las consultas
  pool: {
    max: 10, // Maximo numero de coneciones en pool
    min: 2, // Minimo numero de coneciones en pool
    acquire: 60000, // Maximo tiempo (ms) para mantener la conecion antes lanzar un error
    idle: 5000, // Tiempo máximo (ms) que una conexión puede estar inactiva antes de ser liberada
  },
});

export default sequelize;
