const Usuarios = require("../models/Usuarios.js")
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.registrarUsuarios = async (req,res) =>{
    //leer los datos del usuario y colcoarlos en Usuarios
    const usuario=new Usuarios(req.body);
    usuario.password= await bcrypt.hash(req.body.password,12);
    try {
        await usuario.save();
        res.json({mensaje:"Usuario Creado Correctamente"})
    } catch (error) {
        console.log(error)
        res.json({mensaje:'Hubo un error'})
    }

}

exports.autenticarUsuarios = async(req,res,next ) =>{
    
    //buscar el usuario
    const { email,password } = req.body
    const usuario= await Usuarios.findOne({email})
    if(!usuario){
        //El usuario no exoste
        await res.status(401).json({mensaje:'Ese Usuario no existe'})
        next()
    }else{
        //el usaurio existe,veriifcar si el password es correcto
        if(!bcrypt.compareSync(password,usuario.password)){
            //Si el passwor es iconrrecto
            await res.status(401).json({mensaje:'Password Incorrcto'})
            next()
        }else{
            //password correcto, firmar el token
            const token= jwt.sign({
                email:usuario.email,
                nombre:usuario.nombre,
                _id:usuario._id
            },'LLAVESECRETA',{
                expiresIn:'5h'
            })

            //retirnar el token
            res.json({token})
        }


    }


}