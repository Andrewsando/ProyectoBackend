const fs = require('fs').promises

class Contenedor {
    constructor(path) {
        this.path = path
    }
    async save(objeto) {
        const leer = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(leer)
        let id = objeto.id
        const timestamp = new Date()
        if (!id) {
            data.length === 0
                ? (id = 1)
                : (id = data[data.length - 1].id + 1);
        }
        const newProduct = { ...objeto, id, timestamp };
        data.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8")
        return newProduct.id;
    }

    async getById(id) {
        const leer = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(leer)
        const obj = data.find(obj => obj.id === id)
        if (!obj) {
            return null
        }
        return obj
    }

    async getAll() {
        const leer = await fs.readFile(this.path, "utf-8")
        return JSON.parse(leer)
    }

    async deleteById(id) {
        const leer = await fs.readFile(this.path, "utf-8");
        const data = JSON.parse(leer)
        await fs.writeFile(this.path, JSON.stringify(data.filter(x => x.id !== id), null, 2), "utf-8")
    }

    async deleteAll() {
        await fs.writeFile(this.path, JSON.stringify([], null, 2), "utf-8")
    }
}


module.exports = Contenedor
