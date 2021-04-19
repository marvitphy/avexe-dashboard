const consultasModel = require('../models/consultasModel');
const userModel = require('../models/userModel');
const empresasModel = require('../models/empresasModel');
const bodyparser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv/config');
const multer = require('multer');
const AWS = require('aws-sdk');
const short = require('short-uuid');
//const session = require('express-session');
var cookieSession = require('cookie-session');
const app = require('express').Router();
var moment = require('moment');
//setando o datetime pra pt-br
moment.locale('pt-br');;
const listEndpoints = require('express-list-endpoints')
const fs = require('fs')

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))


app.get('/', async(req, res) => {
    if (req.session.email == null) {
        res.redirect('/login')
    } else {
        let result = await userModel.getUser(req.session.email)
        console.log(result)
        res.render('Admin', { user: result });
    }
});

app.get('/sair', (req, res) => {
    req.session.email = null
    res.redirect('/login')
});

app.post('/api/cadastro', async(req, res) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    let email = req.body.email;
    let password = req.body.password;
    let nome = req.body.nome;
    let created_at = moment().format('L') + ' ' + moment().format('LT');
    let getUser = await userModel.getUser(email);
    if (getUser.length > 0) {
        res.json({ status: 0, msg: 'Usuário já cadastrado' });
    } else {
        await bcrypt.hash(password, 10, async(err, hash) => {
            let result = await userModel.cadUser(nome, email, hash, created_at);
            res.json({ status: 1, msg: 'Usuário cadastrado com sucesso!', result });
        });
        req.session.email = email
    }
});
app.post('/api/login', async(req, res) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    let email = req.body.email;
    let password = req.body.password;
    let getUser = await userModel.getUser(email);
    console.log(req.body)
    if (getUser.length <= 0) {
        res.json({ status: 0, msg: 'Usuário(a) não cadastrado(a).' });
    } else {
        const match = await bcrypt.compare(password, getUser[0].password);
        if (match == true) {
            req.session.email = email
            res.json({ status: 1 })
        } else {
            res.json({ status: 0 })
        }
    }


});



app.get('/login', (req, res) => {
    req.session.email == null ? res.render('Login') : res.redirect('/')

})
app.get('/cadastro', (req, res) => {
    req.session.email == null ? res.render('Cadastro') : res.redirect('/')
})


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({ storage }).fields([{ name: 'image', maxCount: 1 }, { name: 'capa', maxCount: 1 }])

app.post('/api/uploadImgEmpresa', upload, async(req, res) => {
    console.log(req.body)
    let unique = short.generate()
    let capaId = short.generate()

    //IMAGE LOGO INFORMATION TO UPLOAD
    let file = req.files.image[0].originalname.split('.')
    const fileType = file[file.length - 1];
    let logo = `${unique}.${fileType}`
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${unique}.${fileType}`,
        Body: req.files.image[0].buffer,
        ACL: 'public-read'
    }

    //IMAGE BANNER INFORMATION TO UPLOAD
    let fileCapa = req.files.capa[0].originalname.split('.')
    const fileTypeCapa = fileCapa[fileCapa.length - 1];
    let capa = `${capaId}.${fileTypeCapa}`
    const params2 = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${capaId}.${fileTypeCapa}`,
        Body: req.files.capa[0].buffer,
        ACL: 'public-read'
    }

    let result = await empresasModel.cadEmpresa(req.body.nome, req.body.descricao, req.body.rua, req.body.bairro, req.body.complemento, req.body.contato, req.body.instagram, req.body.facebook, req.body.email, req.body.whatsapp, req.body.categorias, logo, capa, req.body.horarios, req.body.cidade, req.body.estado, req.body.cep, req.body.numero)

    s3.upload(params, (error, data) => {
        if (error) return console.log(error)
    })

    s3.upload(params2, (error, data) => {
        if (error) return console.log(error)

        res.json({ status: 1, msg: 'Empresa Cadastrada' })
    })


})

app.get('/empresas/:str', async(req, res) => {
    let resultCat = await consultasModel.getResultsCat(req.params.str);
    let resultNome = await consultasModel.getResultsNome(req.params.str)
    res.json([{
        tipo: 'Por Categoria',
        resultados: resultCat,
    }, {
        tipo: 'Por Nome',
        resultados: resultNome
    }])
})

app.get('/api/getEmpresas', async(req, res) => {
    let result = await consultasModel.getEmpresas();
    res.json(result)
})

app.post('/api/removerEmpresa', async(req, res) => {
    let result = await empresasModel.removerEmpresa(req.body.id);
    res.json(result)
})
app.post('/api/editarEmpresa', async(req, res) => {

    let id = req.body.dados[0].id
    let nome = req.body.dados[0].nome
    delete req.body.dados[0].id
    let result = await empresasModel.editarEmpresa(id, req.body.dados[0]);
    res.json({ status: 1, nome })

})

app.get('/api/getEmpresaById/:id', async(req, res) => {

    let result = await consultasModel.getEmpresaById(req.params.id);
    res.json(result)

})
app.post('/api/updateStatus', async(req, res) => {
    let status = req.body.status
    let id = req.body.id
    let result = await empresasModel.updateStatus(id, status);
    res.json(result)

})

app.get('/getCidades/:str', async(req, res) => {
    let resultGetCidades = await consultasModel.getCidades(req.params.str);
    res.json(resultGetCidades)
})


app.get('/getCidadesById/:id', async(req, res) => {
    let resultGetCidades = await consultasModel.getCidadesById(req.params.id);
    res.json(resultGetCidades)
})



module.exports = app