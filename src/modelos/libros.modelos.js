//se importa mongoose y se guarda en una variable
const mongoose = require('mongoose');


//se instancia como un objeto el esquema que se usará de estructura. 
const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    genero: String,
    fecha_publicacion: String
    }
)

//se exporta como un modelo de mongo.
//libro es nombre del modelo con el cual se va a importar en las rutas
module.exports =mongoose.model('LibroSch', libroSchema)