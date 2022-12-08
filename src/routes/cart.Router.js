const express = require('express');
const Contenedor = require('../Contenedor');

const { Router } = express;
const carritosRouter = new Router();

// Se instancia la clase contenedor
const carritosService = new Contenedor("./db/dbCarritos.json")

// Endpoints
carritosRouter.post('/', async (req, res) => {
    try {
        const result = await carritosService.save({ productos: [] })
        res.status(result ? 200 : 400).json(result ? result : { error: "No se pudo crear el carrito" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

carritosRouter.delete('/:id', async (req, res) => {
    try {
        await carritosService.deleteById(parseInt(req.params.id))
        res.status(200).json({ mensaje: "carrito eliminado" } )
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

carritosRouter.get('/:id/productos', async (req, res) => {
    try {
        const carrito = await carritosService.getById(parseInt(req.params.id))
        res.status(carrito ? 200 : 400).json(carrito ? carrito.productos : { error: "carrito no encontrado" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
})

carritosRouter.post('/:id/productos', async (req, res) => {
    try {
        const carrito = await carritosService.getById(parseInt(req.params.id))
        const prod = req.body;
        carrito.productos.push(prod)
        const del = await carritosService.deleteById(parseInt(req.params.id))
        const result = await carritosService.save(carrito)
        res.status(result ? 200 : 400).json(result ? result : { error: "no se pudo agregar el producto al carrito" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message })
    }
})

carritosRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    try {
        const carrito = await carritosService.getById(parseInt(req.params.id))
        const productos = carrito.productos.filter(prod => prod.id !== parseInt(req.params.id_prod))
        const newCarrito = { ...carrito, productos }
        const del = await carritosService.deleteById(parseInt(req.params.id))
        const result = await carritosService.save(newCarrito)
        res.status(result ? 200 : 500).json(result ? result : { error: "No se pudo eliminar el producto del carrito" })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

module.exports = carritosRouter