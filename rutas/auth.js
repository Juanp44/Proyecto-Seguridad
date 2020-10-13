const router = require('express').Router()
let datos = require('../datos.json')
let multifactorAuth = require('../multifactorAuth/secret.json')
const speakeasy = require('speakeasy')
const fs = require('fs')
const path = require('path')
const dialog = require('dialog')

router.post('/',(req,res)=>{
    let verified = speakeasy.totp.verify({
        secret: multifactorAuth[0].idAscii,
        encoding: 'ascii',
    })

    //EN ESTE CASO LA VERIFICACIÓN FUE CORRECTA
    if(verified){ 
        let index = datos.findIndex(c => c.enProceso2fa == 1);
        let today = new Date();//ACTUALIZAR FECHA
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        datos[index].cantidadRegistros += 1;
        datos[index].ultimoRegistro = dateTime;
        datos[index].usuarioActivo = 1; 
        datos[index].enProceso2fa = 0;
        let BDPATH = '../datos.json' //PONR EL NUEVO REGISTRO EN LA BD
        const filePathBD = path.join(__dirname, BDPATH);
        fs.writeFileSync(filePathBD, JSON.stringify(datos));
        res.render('home')//TE REGRESA A HOME
    }
    
    //CUANDO NO FUNCIONA LA AUTENTICACION
    else{ 
        let index = datos.findIndex(c => c.enProceso2fa == 1);
        datos[index].enProceso2fa = 0;
        let BDPATH = '../datos.json'
        const filePathBD = path.join(__dirname, BDPATH);
        fs.writeFileSync(filePathBD, JSON.stringify(datos));
        dialog.err("ERROR");
        //TE REGRESA AL inicio
        res.render('inicio')
    }
})

module.exports = router;
