const express=require('express')
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosController');
const usuariosController = require('../controllers/usuariosController');

//Midelware para proteger las rutas
const auth = require('../middelware/auth');

module.exports = function(){

    //Agrega nuevos cliente via post
    router.post('/clientes', clienteController.nuevoCliente)
    //Mostrar clientes
    router.get('/clientes', auth, clienteController.mostrarClientes)
    //Muestra un cliente
    router.get('/clientes/:idCliente', auth,clienteController.mostrarCliente)
    //Actualizar cleinte
    router.put('/clientes/:idCliente',auth, clienteController.actualizarCliente)
    //Eliminar registros
    router.delete('/clientes/:idCliente',auth, clienteController.eliminarCliente)
    //bsucar producto
    router.post('/productos/busqueda/:query', productosController.buscarProducto);

    //productos

    router.post('/productos',auth,productosController.subirArchivo, productosController.nuevoProducto)
    router.get('/productos',auth,productosController.mostrarProductos)
    router.get('/productos/:idProducto',auth, productosController.mostrarProducto)
    router.put('/productos/:idProducto',auth, productosController.subirArchivo,productosController.actualizarProducto)
    router.delete('/productos/:idProducto',auth, productosController.eliminarProducto)

    //Pedidos
    router.post('/pedidos/nuevo/:idUsuario',auth,pedidosController.nuevoPedido)
    //Mostrar todos los pedidos
    router.get('/pedidos',auth,pedidosController.mostrarPedidos)
    router.get('/pedidos/:idPedido',auth,pedidosController.mostrarPedido)
    router.put('/pedidos/:idPedido',auth,pedidosController.actualizarPedido)
    router.delete('/pedidos/:idPedido',auth,pedidosController.eliminarPedido)
    
    //Usarios
    router.post('/crear-cuenta',auth, usuariosController.registrarUsuarios)
    router.post('/iniciar-sesion',usuariosController.autenticarUsuarios)


    return router

}
