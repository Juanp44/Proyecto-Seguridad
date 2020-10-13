const router = require('express').Router()
let datos = require('../datos.json')
let authenticate = require('../authenticate/secret.json')
const fs = require('fs')
const path = require('path')
let dialog = require('dialog')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')


router.route('/envioCredenciales')
  .post(async (req, res) => {
    let {
      email,
      password
    } = req.body;

    if (datos.find(c => c.correo == email)) { //CHECAR SI EXISTE EL USUARIO
      try {
        //AQUI SE VA A USAR EL SECRETO PARA GNERERAR EL QR
        let index = datos.findIndex(c => c.correo == email);
        let date = new Date();
        let secret = speakeasy.generateSecret({
          name: "ProyectoSeguridad_" + date.getMinutes() + date.getSeconds()
        })
        qrcode.toDataURL(secret.otpauth_url, (err, data) => {

          if (err) throw err;
          else {

            authenticate[0].idAscii = secret.ascii
            let rutaSecret = '../authenticate/secret.json'
            const filePathSecret = path.join(__dirname, rutaSecret);
            fs.writeFileSync(filePathSecret, JSON.stringify(authenticate));

            let index = datos.findIndex(c => c.correo == email);
            datos[index].enProceso2fa = 1;
            let rutaBD = '../datos.json'
            const filePathBD = path.join(__dirname, rutaBD);
            fs.writeFileSync(filePathBD, JSON.stringify(datos));

            res.render('verifyGoogleAuth', {
              title: "Google Authenticator",
              condition: false,
              qrcode: [{
                url: data
              }]
            });
          }

        })
      } else {
        dialog.err("ERROR");
        // TE REGRESA AL INICIO
        res.render('inicio');
      }
    } else {
      dialog.err("ERROR");
      res.render('inicio');
    }
  })

router.route('/OUT')
  .post((req, res) => {//LOGOUT DEL USUARIO

    let index = datos.findIndex(c => c.usuarioActivo == 1 || c.enProceso2fa == 1);
    datos[index].usuarioActivo = 0;
    datos[index].enProceso2fa = 0;
    let rutaBD = '../datos.json'
    const filePathBD = path.join(__dirname, rutaBD);
    fs.writeFileSync(filePathBD, JSON.stringify(datos));

    res.render('inicio')
  })
module.exports = router;