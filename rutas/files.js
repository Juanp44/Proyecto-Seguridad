const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const globby = require('globby')
const fs = require('fs')
const axios = require('axios')
const crypto = require('crypto');

const chequeo = (req, file, cb) => {
    //if (file.mimetype.match(/.(jpeg|png|gif)$/))
    if (file.fieldname == 'verificar') fileNameToVerify = file.originalname // guardar el nombre del archivo a guardar en una variable global para futuras referencias
    else fileNameTosubidos = 'signed-' + file.originalname

    if (file.mimetype === 'text/plain') cb(null, true);
    else cb(null, false); // false, ignore other files
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //GUARDAR LOS ARCHIVOS LOCALMENTE

        if (file.fieldname == 'fileTosubidos') cb(null, path.join(__dirname, '../public/files'))
        else cb(null, path.join(__dirname, '../public/verify'))
    },
    filename: (req, file, cb) => {
        if (file.fieldname == 'fileTosubidos') cb(null, 'signed-' + file.originalname); //file.originalname
        else cb(null, file.originalname); //file.originalname
    }
})
const subidosFile = multer({
    storage,
    limits: {
        fileSize: 100000
    },
    chequeo
})

router.post('/verify', subidosFile.single('verificar'), (req, res) => {

    let rutaLlavePublica = '../keysFirma/publicKey.pem'
    const filePathPublicKey = path.join(__dirname, rutaLlavePublica);
    const public_key = fs.readFileSync(filePathPublicKey, 'utf-8');

    let rutaSignature = '../keysFirma/signature'
    const filePathSignature = path.join(__dirname, rutaSignature);
    const signature = fs.readFileSync(filePathSignature, 'utf-8');
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.write(doc);
    verifier.end();
    const result = verifier.verify(public_key, signature, 'base64');

    res.render('home', {
        title: 'home',
        condition: false,
        statusSigned: [{
            status: result,
            name: fileNameToVerify
        }]
    })
})

router.get('/subidos', async (req, res) => {
    const paths = await globby(['**/public/files/*']);
    const pathsNew = paths.map(function (x) {
        return x.replace("public/files/", '')
    })
    res.send(pathsNew)
})

router.post('/subidos', subidosFile.single('fileTosubidos'), async (req, res) => {

    let rutaLlavePrivada = '../keysFirma/privateKey.pem' //SE USARÁN LAS LLAVES PARA FIRMAR
    const filePathPrivateKey = path.join(__dirname, rutaLlavePrivada);
    const private_key = fs.readFileSync(filePathPrivateKey, 'utf-8');
    let rutaArchivo = '../public/files/' + fileNameTosubidos
    let filePath = path.join(__dirname, rutaArchivo);
    const doc = fs.readFileSync(filePath);
    const signer = crypto.createSign('RSA-SHA256');
    signer.write(doc);
    signer.end();

    const signature = signer.sign(private_key, 'base64')
    let rutaSignature = '../keysFirma/signature'
    const filePathSignature = path.join(__dirname, rutaSignature);
    fs.writeFileSync(filePathSignature, signature);

    try {
        if (fs.statSync(filePath).isFile()) {
            res.download(filePath)

        }
    } catch (e) {
        console.log("ERROR)
    }


});

router.post('/subidos', (req, res) => {

    let archivosArreglo;
    axios('https://localhost:8080/firmaDocumentos/subidos') 
        .then(response => {
            archivosArreglo = response.data.map(archivo => {
                return {
                    nombre: archivo
                }
            })
            res.render('home', {
                title: "Home",
                condition: false,
                pathsNew: archivosArreglo
            })

        })
});




module.exports = router;