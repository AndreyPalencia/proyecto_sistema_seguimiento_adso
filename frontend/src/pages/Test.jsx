import Tabla from "../components/Tabla/Tabla";



const Test = () => {
    return (
      <Tabla
        data={[
          {
            idEmpresa: 1,
            nit: '895211426-N',
            razonSocial: 'Razon Sena',
            telefono: 55551155,
            correoElectronico: 'razon@test.razon.com',
            direccion: 'tests direccionddd',
          },
          {
            idEmpresa: 2,
            nit: '895211455-N',
            razonSocial: 'Razon Social',
            telefono: 36582,
            correoElectronico: 'testsocial@test.com',
            direccion: 'Av. 3 Circunvalar',
          },
        ]}
        dataException={['nit']}
        selectedValue={'idEmpresa'}
        variantTable="test"
        filters={{ filter: {}, filterSearch: {}, defaultValuefilterSearch: {} }}
      />
    );
}

export default Test;