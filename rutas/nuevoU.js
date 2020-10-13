const router = require('express').Router()
let datos = require('../datos.json')
const fs = require('fs')
const path = require('path')
const dialog = require('dialog')

router.get('/', (req, res) => {
    res.render('nuevoU')
});

router.post('/nuevoUsuario', async (req, res) => {
    let {
        correo,
        password
    } = req.body


    try {
        datos.push({
            "id": datos[datos.length - 1].id + 1,
            "correo": correo,
            "password": hash,
            "cantidadRegistros": 0,
            "ultimoRegistro": "",
            "usuarioActivo": 0,
            "enProceso2fa": 0
        })

        let BaseD = '../datos.json'
        const path = path.join(__dirname, BaseD);
        fs.writeFileSync(path, JSON.stringify(datos));

        res.render('inicio')
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;