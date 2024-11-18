const bcrypt = require('bcryptjs')
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser')
const nodemailer = require('nodemailer')

//clave secreta
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

// Función para iniciar sesión
exports.iniciarSesion = async(req,res) =>{
    const {numero_documento,password} = req.body

    validaciones.numero_documento(numero_documento)
    validaciones.password(password) 

    try{
        const [usuarioExistente] = await db.query('SELECT * FROM usuario WHERE numero_documento = ?',[numero_documento]);
        
        if (usuarioExistente.length < 1) {
            return res.status(400).send({ mensaje: "Usuario no encontrado" });
        }

        const contraseña = bcrypt.compareSync(password, usuarioExistente[0].password)
        if(!contraseña){
            return res.status(400).send({mensaje: "Contraseña incorrecta"});
        }
        const token = jwt.sign({id:usuarioExistente[0].id_usuario, username:usuarioExistente[0].nombre, rol:usuarioExistente[0].rol, documento:usuarioExistente[0].numero_documento, password:usuarioExistente[0].password},SECRET_JWT_KEY,{
            expiresIn: '1h'
        })
        res
        .cookie('acceso_token',token,{
            httpOnly:true, //solo se puede acceder desde el servidor
            secure:process.env.NODE_ENV ==='production',//solo se puede acceder por http
            sameSite:'strict', //solo se puede acceder desde el mismo dominio
            maxAge:1000 * 60 * 60 //tiempo de una hora

        }).send({mensaje:'inicio de sesion correcto'})
        // res.status(200).send({ mensaje: "Inicio de sesión exitoso",token});

    }catch (error) {
        console.log("Error en el inicio de sesion ", error);
        res.status(500).send({ mensaje: "Error en el inicio de sesion" });
    }
}

//navegar
exports.navegar = async(req,res) =>{
    const token = req.cookies.acceso_token
    if(!token){
        return res.status(401).send({mensaje:'No autorizado'})
    }
    try{
        const data = jwt.verify(token,SECRET_JWT_KEY)
        res.send({mensaje:'Autorizado',data})
    }catch(error){
        res.status(401).send({mensaje:'error',error})
    }
}

//Cerrar sesion
exports.cerrarSesion = async(req,res) =>{
    res.clearCookie('acceso_token').send({mensaje:'Sesion cerrada'}

)}

//cambiar contraseña
exports.cambiarContraseña = async(req,res) =>{
    //Autorizacion
    // const authHeader = req.headers.authorization;
    // console.log("Authorization Header:", authHeader)
    // const token = authHeader && authHeader.split(" ")[1];
    // console.log("Token:", token);
    const token = req.cookies.acceso_token
    const {password, nuevaPassword} = req.body

    if(!token){
        return res.status(401).send({mensaje:'No autorizado'})
    }

    try{
        const data = jwt.verify(token,SECRET_JWT_KEY)
        const usuarioId = data.id
        const [busqueda] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?',[usuarioId]);
        if (busqueda.length < 1) {
            return res.status(404).send({ mensaje: "Usuario no encontrado" });
        }

        const usuarioExistente = busqueda[0]
        const contraseñaCorrecta = bcrypt.compareSync(password, usuarioExistente.password);
        if(!contraseñaCorrecta){
            return res.status(400).send({mensaje: "la contraseña no coincide"});
        }

        const hash = bcrypt.hashSync(nuevaPassword, 10)
        await db.query('UPDATE usuario SET password = ? WHERE id_usuario = ?',[hash,usuarioId])
        res.send({mensaje:'Contraseña actualizada'})

    }catch(error){
        console.log("Error al cambiar la contraseña:", error);
        res.status(401).send({mensaje:'error',error})
    }
}

//Recuperar contraseña 
const userEmail = "" //escribir correo oficial que se va a usar
const passEmail = "" // codigo que da gmail para enviar correos en este link https://accounts.google.com/v3/signin/challenge/pwd?TL=AKOx4s1MH-jIMesz6M9fgjPGNWZU36IrZRKV15cQbw-AhxEZwty-9OssfbPO-GuD&cid=2&continue=https%3A%2F%2Fmyaccount.google.com%2Fapppasswords&flowName=GlifWebSignIn&followup=https%3A%2F%2Fmyaccount.google.com%2Fapppasswords&ifkv=AcMMx-ficlBzaJiIwbz8Bxr7htbB8oBb5jIu8axre_YkpbQhJETRhf6l3eOfuuxO2Afz834wYXrezw&osid=1&rart=ANgoxcclE5tOkC0M3WBkK91TND02Loz59eKvmhc9V_GSAggrrJKiV6W-_1Qm_t-ah_0xnNzRFWRRoW7es9RJznXs2JkkTN1oqVZpoyjm7AOpc-26thoNOlc&rpbg=1&service=accountsettings
exports.recuperarContraseña = async(req,res) =>{
    const {email} = req.body
    const [busqueda] = await db.query('SELECT * FROM usuario WHERE correo_electronico = ?',[email]);
    if (busqueda.length < 1) {
        return res.status(404).send({ mensaje: "Usuario no encontrado" });
    }
    const usuario = busqueda[0]
    const token = jwt.sign({id:usuario.id_usuario, username:usuario.nombre, rol:usuario.rol, documento:usuario.numero_documento, password:usuario.password},SECRET_JWT_KEY,{
        expiresIn: '1h'
    })
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userEmail,
            pass: passEmail
        }
    });
    const mailOptions = {
        from: userEmail,
        to: email,
        subject: 'Recuperar contraseña',
        text: `Haga click en el siguiente enlace para recuperar su contraseña: http://localhost:3000/cambiarPassword`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send({ mensaje: "Error al enviar el correo" });
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ mensaje: "Correo enviado" });
        }
    });
}



//validaciones
class validaciones {
    static numero_documento(numero_documento){
        if(numero_documento.length < 3){
            console.log('correo electronico tiene que tener mas de 3 caracteres ')
        }
    }
    static password(password){
        if(password.length < 3){
            console.log('password tiene que tener mas de 3 caracteres ')
        }
    }
}