const express = require('express');
const Contenedor = require('../Contenedor');

const { Router } = express;
const productosRouter = new Router();

// Se instancia la clase contenedor
const productosService = new Contenedor("./db/dbProductos.json")

// funcion Error
function crearErrorNoEsAdmin(ruta, metodo) {
    const error = {
        error: -1,
    }
    if (ruta && metodo) {
        error.descripcion = `ruta '${ruta}' metodo '${metodo}' no autorizado`
    } else {
        error.descripcion = 'no autorizado'
    }
    return error
}

// Middleware para Administrador
const esAdmin = true

function soloAdmins(req, res, next) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin(req.url, req.method))
    } else {
        next()
    }
}

// Endpoints
productosRouter.get('/', async (req, res) => {
    res.json(await productosService.getAll())
})

//    -->   /api/productos/5
productosRouter.get('/:id', async (req, res) => {
    try {
        const prod = await productosService.getById(parseInt(req.params.id))
        res.status(prod ? 200 : 500).json(prod ? prod : { error: "producto no encontrado" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// tiene permisos un admin
productosRouter.post('/', soloAdmins, async (req, res) => {
    try {
        const prod = req.body;
        console.log(prod)
        const result = await productosService.save(prod)
        res.status(result ? 200 : 500).json(result ? result : { error: "No se pudo guardar el producto" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

productosRouter.put('/:id', soloAdmins, async (req, res) => {
    try {
        const prod = req.body;
        const result = await productosService.updateById(parseInt(req.params.id), prod)
        res.status(result ? 200 : 500).json(result ? result : { error: "producto no encontrado" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
    try {
        const result = await productosService.deleteById(parseInt(req.params.id))
        res.status(result ? 200 : 500).json(result ? { mensaje: "producto encontrado" } : { error: "producto no encontrado" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

module.exports = productosRouter