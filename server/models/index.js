import Usuario from './Usuario.js';

const models = { Usuario };

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

export default {...models};
