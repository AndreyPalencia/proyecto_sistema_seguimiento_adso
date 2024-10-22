const db = require('../db/base_datos'); //Importamos la conexion de la base de datos

// Crear una ficha
exports.nuevaFicha = async (req, res) => {
    try {
        //Obtener los valores de cuerpo 
        const { numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva, id_instructor } = req.body;

        // Validar los datos antes de insertar
        if (!numero_ficha || !nombre_programa || !termino_programa || !archivar || !inicio_etapa_productiva || !fin_etapa_productiva || !id_instructor) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos.' });
        }

        const query = 'INSERT INTO ficha ( numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva,  id_instructor) VALUES (?, ?, ?, ?, ?,?, ?)';

        await db.query(query, [numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva, id_instructor]);
        res.status(201).json({ mensaje: 'Ficha agregada exitosamente!!' }); //201 indica se creo la ficha 

    } catch (error) {
        console.error('Error al ingresar datos de la ficha: ' + error);
        res.status(500).json({ mensaje: 'Error al agregar la ficha.' });
    }
}


// Visualizar todas las fichas
exports.obtenerFichas = async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM ficha');
        if (filas.length === 0) {//En el caso de que no encuentre alguna ficha en sistema 
            return res.status(404).json({ mesaje: 'No se encontraron fichas.' });
        }
        console.log(filas);
        res.status(200).json(filas);
    } catch (error) {
        console.error('Error al visualizar todas las fichas:', error);
        res.status(500).json({ mensaje: 'Error al visualizar las fichas.' });
    }
}


// Obtener una ficha por ID
exports.obtenerFicha = async (req, res) => {
    const idFicha = req.params.idFicha;
    if (!idFicha || isNaN(idFicha)) {
        return res.status(400).send("Id, de la ficha no puede ser null,")
    }
    //console.log(`GET request received for ID: ${idFicha}`); // Log para depuración
    try {
        const resultado = await db.query('SELECT * FROM ficha WHERE id_ficha = ?', [idFicha]);

        if (resultado.length === 0) {
            return res.status(404).send('Ficha no encontrada.');
        }
        res.status(200).json(resultado[0]);
    } catch (error) {
        console.error('Error al obtener la ficha:' + error);
        res.status(500).json({ mensaje : 'Error al obtener la ficha.'});
    }
}

//Actualizar ficha por ID
exports.actualizarFicha = async (req, res) => {
    const idFicha = req.params.idFicha;
    if (!idFicha || isNaN(idFicha)) {
        return res.status(400).send("Id, de la ficha no puede ser null,")
    }
    console.log(`GET request received for ID: ${idFicha}`);
    try {
        const { numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva, id_instructor } = req.body;
        
        if (!numero_ficha || !nombre_programa || !termino_programa || !archivar || !inicio_etapa_productiva || !fin_etapa_productiva || !id_instructor) {
            return res.status(400).json({ mensaje: 'Los campos no pueden ser null.' });
        }

        const query = 'UPDATE ficha SET  numero_ficha = ?, nombre_programa = ?,termino_programa = ?, archivar = ?, inicio_etapa_productiva = ?, fin_etapa_productiva = ?, id_instructor = ?';

        await db.query(query,[numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva, id_instructor]);
        
        res.status(200).json({ mensaje: "La ficha fue actualizda correctamente." })
    } catch (error) {
        console.error('Error al actualizar la ficha:' + error);
        res.status(500).json({mesaje : 'Error al actualizar la ficha.'});
    }
}
