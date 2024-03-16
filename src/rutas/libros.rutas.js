const express = require('express')
const rutas = express.Router()
const LibroSch = require('../modelos/libros.modelos')

//MIDDLEWARE

const getLibro = async (req, res, next) => {

    let libro;
    const { id } = req.params    //parámetros que se van a recibir del request vamos a sacar el id;

    //se chequea que el id sea válido (con las características de mongo).
    //si no matchea con la expresión regular ejecuta el código del bloque.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'El ID del libro, no es válido' })

    }

    try {
        libro = await LibroSch.findById(id)   // corroborado el id, se busca con el findById() en el obejto de la DB de mongo si existe el id pasado por parámetro
        //si no encuentra nada (undefined) 
        if (!libro) {
            return res.status(404).json({ message: 'Libro no Encontrado' })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    //si no es UNDEFINED y es válido, configura la respuesta y continua con next()
    res.libro = libro;
    next();  // es para que siga buscando.

}



//obtener los libros [GET ALL]
// se usa '/' porque al momento de llamar ya se va a encontrar dentro del directorio de las rutas
rutas.get('/', async (req, res) => {
    try {
        const libros = await LibroSch.find()  // si está vacío el find, busca todo lo que encuentra.
        console.log('GET ALL ', libros)
        if (libros.length === 0) {
            return res.status(204).json([])  //204: no content    //con return salimos para que no continue con el código.
        }
        res.json(libros) //si devuelve datos, el status es 200.
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
)



//crear un nuevo libro (recurso) [POST]
//post: necesita un body

rutas.post('/', async (req, res) => {
    //desestructuramos el objeto
    const { titulo, autor, genero, fecha_publicacion } = req?.body  //body

    //validación
    if (!titulo || !autor || !genero || !fecha_publicacion) {
        return res.status(400).json({ message: 'Los campos título, autor, género y fecha de publicación son obligatorios' })    //status: 400 Bad Request
    }

    // lo que traemos del modelo de mongo.
    //dentro de las llaves va lo desestructurado que se trae de mongo.
    const libro = new LibroSch({
        titulo,
        autor,
        genero,
        fecha_publicacion
    })


    try {

        const libroNuevo = await libro.save()  // dentro del objeto libro creado con el Schema obtenido se guarda la informacion.
        console.log('POST ', libroNuevo)
        res.status(201).json(libroNuevo)  // se devuelve el libro creado.

    } catch (error) {
        res.status(400).json({ message: error.message })
    }

})


// [GET] 
//   /:id va a ir cuando se envíe la petición.
//   getLibro es el middleware que va a buscar si matchea el id y buscará en la database
rutas.get('/:id', getLibro, async (req, res) => {
    res.json(res.libro);
})

// [PUT]  para modificar 
rutas.put('/:id', getLibro, async (req, res) => {
    try {
        const libro = res.libro;   // agrega el libro a la respuesta que obtuvo por el middleware
        libro.titulo = req.body.titulo || libro.titulo   //se obtiene el dato titulo del body, sino lo tiene, guarda el anterior.
        libro.autor = req.body.autor || libro.autor
        libro.genero = req.body.genero || libro.genero
        libro.fecha_publicacion = req.body.fecha_publicacion || libro.fecha_publicacion

        const libroModificado = await libro.save();   // se guardan los datos nuevos.
        
        res.json(libroModificado)  // se muestra a través del json.

    } catch (error) {
        res.status(400).json({message: message.error})

    }

})

// [PATCH]  para modificar un solo dato del registro.
rutas.patch('/:id', getLibro, async (req, res) => {
    
    if(!req.body.titulo && !req.body.autor && !req.body.genero && !req.body.fecha_publicacion){
        res.status(400).json({
            message: 'Al menos unos de los campos debe ser enviado: Título, Autor, Género, Fecha de Publicación'
        })
    }
    
    try {
        const libro = res.libro;   // agrega el libro a la respuesta que obtuvo por el middleware
        libro.titulo = req.body.titulo || libro.titulo   //se obtiene el dato titulo del body, sino lo tiene, guarda el anterior.
        libro.autor = req.body.autor || libro.autor
        libro.genero = req.body.genero || libro.genero
        libro.fecha_publicacion = req.body.fecha_publicacion || libro.fecha_publicacion

        const libroModificado = await libro.save();   // se guardan los datos nuevos.
        
        res.json(libroModificado)  // se muestra a través del json.

    } catch (error) {
        res.status(400).json({message: message.error})

    }

})


// [DELETE] 

rutas.delete('/:id', getLibro, async(req, res)=>{
    try {
        const libro = res.libro; 
        await libro.deleteOne({   //método para eliminar. recibe un id para ejecutarse.
            _id: libro._id  
        })
        res.status(200).json({
            message: `El libro ${libro.titulo} ha sido borrado`
        })

    } catch (error) {
        res.status(500).json({
            message: message.error
        })
    }
})


module.exports = rutas