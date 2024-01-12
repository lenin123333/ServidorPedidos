
const Productos = require('../models/Productos')
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs')

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname+'../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if ( file.mimetype === 'image/jpeg' ||  file.mimetype ==='image/png' ) {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'))
        }
    },
}

// pasar la configuración y el campo
const upload = multer(configuracionMulter).single('imagen');

// Sube un archivo 
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            res.json({mensaje: error})
        }
        return next();
    })
}


exports.nuevoProducto = async(req,res,next)=>{
    const producto= new Productos(req.body);
    try {
        if(req.file.filename){
            producto.imagen=req.file.filename
        }
        //Almacenar el registro
        await producto.save();
        res.json({mensaje:"Se agrego un nuevo Producto"});
    } catch (error) {
        console.error(error)
        next();       
    }
}

exports.mostrarProductos = async(req,res,next)=>{
   
    try {
       const productos= await Productos.find({})
    
        res.json(productos);
    } catch (error) {
        console.error(error)
        next();       
    }
}

exports.mostrarProducto= async(req,res,next)=>{
    try {
      
        const producto= await Productos.findById(req.params.idProducto)
        if(!producto){
            res.json({mensaje:"Ese producto no Existe"});
            return next()
        }

        res.json(producto);
    } catch (error) {
        console.error(error)
        next();
    }
}




exports.actualizarProducto= async(req,res,next)=>{
    try {
       
        //construir un nuevo proucto
        let nuevoProducto= req.body;
        let productoAnterior= await Productos.findById(req.params.idProducto);
        // verificar si hay imagen neuvo
        if(req.file){
            nuevoProducto.imagen=req.file.filename
             //Eliminar imagen de disco
             const imagenAnterioPath = __dirname + `/../uploads/${productoAnterior.imagen}`;
             // Eliminar archivo con filesystem
             fs.unlink( imagenAnterioPath, (error) => {
                 if(error) {
                     console.log(error);
                 }
                 return;
             });
        }else{
           
            nuevoProducto.imagen=productoAnterior.imagen
           

        }
        let producto= await Productos.findOneAndUpdate({_id: req.params.idProducto},nuevoProducto,{new:true})
      

        res.json(producto);
    } catch (error) {
        console.error(error)
        next();
    }
}

exports.eliminarProducto = async(req,res,next) => {
    try {
        const producto = await Productos.findOneAndDelete({ _id:req.params.idProducto });
        // console.log(producto.imagen);
         //console.log(__dirname + `/../uploads/${producto.imagen}`);
        if(producto.imagen){
            const imagenAnterioPath = __dirname + `/../uploads/${producto.imagen}`;
            // Eliminar archivo con filesystem
            fs.unlink( imagenAnterioPath, (error) => {
                if(error) {
                    console.log(error);
                }
                return;
            });
        }
        res.json({ producto, mensaje:'Producto Eliminado'});
 
    }catch(error){
        res.json({ mensaje:'No existe ese Producto'});
        console.log(error);
        next();
    }
}



exports.buscarProducto = async (req, res,next) => {
    try {
      const {query} = req.params 
      const producto = await Productos.find({
        nombre: new RegExp(query,'i')
      }) 
      res.json(producto)
    } catch (error) {
        console.log(error)
        next()
    }
}