import Usuario from './Usuario';
import Ficha from './Ficha';

const models = { Usuario, Ficha };


Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

export default  { ...models };
 

