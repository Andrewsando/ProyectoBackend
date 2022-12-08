const express = require('express')
const PORT = process.env.PORT   

const productosRouter = require('./routes/products.Router')
const carritosRouter = require('./routes/cart.Router')

//--------------------------------------------
// instancio servidor y persistencia
const app = express()

//--------------------------------------------
// configuro el servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

app.get('*', function (req, res) {
    res.send({ error: "-2", description: `ruta ${req.url} método ${req.method} no implementada` });
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
})
module.exports = app