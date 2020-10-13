const router = require('express').Router()
let datos = require('../datos.json')
const fs = require('fs')
const path = require('path')

router.post('/nuevaPass', (req, res) => {
    let {
        password
    } = req.body
    let index = datos.findIndex(c => c.active == 1);
    datos[index].password = password

    datos[index].active = 0;
    let rutaBD = '../datos.json'
    const filePathBD = path.join(__dirname, rutaBD);
    fs.writeFileSync(filePathBD, JSON.stringify(datos));

    res.render('inicio')

})


module.exports = router;