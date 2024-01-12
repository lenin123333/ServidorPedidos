const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//cors permite que un cliente se conecte a otro servidor para el intercambio de recersos
const cors = require('cors');
require('dotenv').config({path:'variables.env'})
//Conectar mongo

mongoose.Promise=global.Promise
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected!'));

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//Definir dorminios para revibri las peticiones solo de este se podran hacer peticiones
const whiteList=[process.env.FRONTEND_URL]
const corOpttions={
  origin:(origin,callback)=>{
    //revisar si la peticion viene de un servidor que esta en la whitelist
    const existe = whiteList.some(dominio=> dominio === origin);
    if(existe){
      callback(null,true);

    }else{
      callback(new Error('No permitido por CORS'));
    }
  }
}
//habilitar cors
app.use(cors(corOpttions));

//Rutas de la app
app.use('/',routes())

//caerpeta publica
app.use(express.static('uploads'))

//loclocalhost
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 5000

app.listen(port,host,()=>{
  console.log('el servirdo esyta correindo')
})