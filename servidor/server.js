const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const https = require('https')
const fs = require('fs')
const bodyParser = require("body-parser");

const fileUp = require('../rutas/files')
const inicioRouter = require('../rutas/inicio')
const newPass = require('../rutas/newPass')
const bitacora = require('../rutas/bitacora')
const auth = require('../rutas/auth')
const newU = require('../rutas/nuevoU')

const app = express()
const port = 8080;

const httpsServer = https.createServer({
    key: fs.readFileSync('localhost.key.pem'),
    cert: fs.readFileSync('localhost.pem')
}, app);

app.use(bodyParser.urlencoded({
    extended: true
})); 
app.use(bodyParser.json());

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '../front/components/')

}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')))

app.route('/')
    .get((req, res) => {
        res.render('inicio', {
            title: 'inicio',
            condition: false
        })
    })

app.use('/inicio', inicioRouter); 
app.use('/firmaDocumentos', fileUp); 
app.use('/edit', newPass) 
app.use('/logs', bitacora) 
app.use('/2fa', auth) 

httpsServer.listen(port, () => {
    console.log("HTTPS server running on port 8080");
})
