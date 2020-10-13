const router = require('express').Router()
let datos = require('../datos.json')


router.post('/usuarios',(req,res)=>{
   
    //PASAR LOS DATOS DEL USUARIO
    res.render('home',{
        title:"Home",
        condition:false,
        arregloUsuarios: datos
    })
})

module.exports = router;