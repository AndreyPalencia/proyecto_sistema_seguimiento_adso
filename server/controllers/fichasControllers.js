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
        return res.status(400).send("Id, de la ficha no puede ser null,");
    }

    try {
        const resultado = await db.query('SELECT * FROM ficha WHERE id_ficha = ?', [idFicha]);

        if (resultado.length === 0) {
            return res.status(404).send('Ficha no encontrada.');
        }
        res.status(200).json(resultado[0]);
    } catch (error) {
        console.error('Error al obtener la ficha:' + error);
        res.status(500).json({ mensaje: 'Error al obtener la ficha.' });
    }
}

//Actualizar ficha por ID
exports.actualizarFicha = async (req, res) => {
    const idFicha = req.params.idFicha;

    if (!idFicha || isNaN(idFicha)) {
        return res.status(400).send("Id, de la ficha no puede ser null,");
    }

    try {
        const { numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva, id_instructor } = req.body;

        if (!numero_ficha || !nombre_programa || !termino_programa || !archivar || !inicio_etapa_productiva || !fin_etapa_productiva || !id_instructor) {
            return res.status(400).json({ mensaje: 'Los campos no pueden ser null.' });
        }

        const query = 'UPDATE ficha SET  numero_ficha = ?, nombre_programa = ?,termino_programa = ?, archivar = ?, inicio_etapa_productiva = ?, fin_etapa_productiva = ?, id_instructor = ?  WHERE id_ficha = ?';

        await db.query(query, [numero_ficha, nombre_programa, termino_programa, archivar, inicio_etapa_productiva, fin_etapa_productiva, id_instructor, idFicha]);

        res.status(200).json({ mensaje: "La ficha fue actualizada correctamente." })
    } catch (error) {
        console.error('Error al actualizar la ficha:' + error);
        res.status(500).json({ mesaje: 'Error al actualizar la ficha.' });
    }
}


//Eliminar ficha por ID
exports.eliminarFicha = async (req, res) => {
    const idFicha = req.params.idFicha;

    // Validar que el id de la ficha no sea nulo y sea un número
    if (!idFicha || isNaN(idFicha)) {
        return res.status(400).json({ mensaje: 'El ID de la ficha no puede ser nulo o no válido.' });
    }

    try {
        // Consulta SQL para eliminar la ficha
        const query = 'DELETE FROM ficha WHERE id_ficha = ?';

        // Ejecutar la consulta para eliminar la ficha
        const [result] = await db.query(query, [idFicha]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No se encontró ninguna ficha con el ID proporcionado.' });
        }

        res.status(200).json({ mensaje: 'La ficha fue eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la ficha: ' + error);
        res.status(500).json({ mensaje: 'Error al eliminar la ficha.' });
    }
};


//Archivar fichas
exports.archivarFicha = async (req, res) => {
    const idFicha = req.params.idFicha;
    const { archivar } = req.body;

    // Validar que el id de la ficha no sea nulo y sea un número
    if (idFicha <= 0 || !idFicha || isNaN(idFicha)) {
        return res.status(400).json({ mensaje: 'El ID de la ficha debe ser un numero positivo y válido.' });
    }

    // Validar que el valor enviado este dentro de los paramentros
    if (archivar === undefined || (archivar !== 1 && archivar !== 0)) {
        return res.status(400).json({ mensaje: 'El valor de archivar debe ser 0 o 1.' });
    }

    try {
        // Consulta SQL para actualizar el estado de la ficha a "archivada"
        const query = 'UPDATE ficha SET archivar = ? WHERE id_ficha = ?';

        // Ejecutar la consulta para archivar la ficha
        const [result] = await db.query(query, [archivar, idFicha]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No se encontró ninguna ficha con el ID proporcionado.' });
        }

        res.status(200).json({ mensaje: 'La ficha fue archivada correctamente.' });
    } catch (error) {
        console.error('Error al archivar la ficha: ' + error);
        res.status(500).json({ mensaje: 'Error al archivar la ficha.' });
    }
};