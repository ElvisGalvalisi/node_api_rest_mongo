const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')  

const { config } = require('dotenv')

config();

const libroRutas = require('./rutas/libros.rutas') // se importa la ruta de los libros, si hubiera otras rutas deberían imnportarse tambien. 

//usamos express para los middlewares 
const app = express();

app.use(bodyParser.json());  // para parsear cuando se reciba el body del POST 


//conexion a la base de datos.
//mongo se conecta a la URL
mongoose.connect(process.env.MONGO_URL,{dbName: process.env.MONGO_DB_NAME}) 
const db = mongoose.connection;

// middleware para las rutas
app.use('/libros', libroRutas)   //si es /libros, va a buscar la ruta de los libros.

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`servidor inciado en el puerto ${port}`);
})