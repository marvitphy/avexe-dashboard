const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs');
const mime = require('mime');
const routes = require('./routes/routes');

app.use(routes);

var port = Number(process.env.PORT || 5050);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.listen(port, function(error) {
    if (error) throw error
    console.log(`Server Iniciado na porta: ${port}`)
})