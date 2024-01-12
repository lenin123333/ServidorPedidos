const Pedidos = require('../models/Pedidos')

exports.nuevoPedido = async(req,res,next)=>{
    const pedido= new Pedidos(req.body);
    try {
        
        //Almacenar el registro
        await pedido.save();
        res.json({mensaje:"Se agrego un nuevo Pedido"});
    } catch (error) {
        console.error(error)
        next();       
    }
}


exports.mostrarPedidos = async(req,res,next)=>{
    
    try {
        const pedidos= await Pedidos.find({}).populate('cliente').populate({
            path:'pedido.producto',
            model:'Productos'
        })
        //Almacenar el registro
       
        res.json(pedidos);
    } catch (error) {
        console.error(error)
        next();       
    }
}

exports.mostrarPedido = async(req,res,next)=>{
    
    try {
        const pedido= await Pedidos.findById(req.params.idPedido).populate('cliente').populate({
            path:'pedido.producto',
            model:'Productos'
        })

        if(!pedido){
            res.json({mensaje:"El pedido no existe"})
            return next()
        }
        //Almacenar el registro
       
        res.json(pedido);
    } catch (error) {
        console.error(error)
        next();       
    }
}

exports.actualizarPedido = async(req,res,next)=>{
    
    try {
        let pedido= await Pedidos.findOneAndUpdate({_id:req.params.idPedido},req.body,{
            new:true
        }).populate('cliente').populate({
            path:'pedido.producto',
            model:'Productos'
        })
        res.json(pedido)
    } catch (error) {
        console.error(error)
        next();       
    }
}

exports.eliminarPedido= async(req,res,next)=>{
    try {
        const pedido= await Pedidos.findOneAndDelete({_id: req.params.idPedido})
      

        res.json({mensaje:"El pedido se a elminado"});
    } catch (error) {
        console.error(error)
        next();
    }
}