const Clientes = require('../models/Clientes')

//Agrega un nuevo cliente

exports.nuevoCliente = async(req,res,next)=>{
    const cliente= new Clientes(req.body);
    try {
        //Almacenar el registro
        await cliente.save();
        res.json({mensaje:"Se agrego un nuevo cliente"});
    } catch (error) {
        
        res.send(error);
        next();
        
    }
}

exports.mostrarClientes= async(req,res,next)=>{
    try {
        const clientes= await Clientes.find({})
        res.json(clientes);
    } catch (error) {
        console.error(error)
        next();
    }
}

//Mostrar cliente por id
exports.mostrarCliente= async(req,res,next)=>{
    try {
        const cliente= await Clientes.findById(req.params.idCliente)
        if(!cliente){
            res.json({mensaje:"Ese cliente no Existe"});
            return next()
        }

        res.json(cliente);
    } catch (error) {
        res.send(error);
        next();
    }
}


//Actualizar cliente
exports.actualizarCliente= async(req,res,next)=>{
    try {
        const cliente= await Clientes.findOneAndUpdate({_id: req.params.idCliente},req.body,{new:true})
      

        res.json(cliente);
    } catch (error) {
        console.error(error)
        next();
    }
}

//Eliminar cliente
exports.eliminarCliente= async(req,res,next)=>{
    try {
        const cliente= await Clientes.findOneAndDelete({_id: req.params.idCliente})
      

        res.json({mensaje:"El cliente se a elminado"});
    } catch (error) {
        console.error(error)
        next();
    }
}