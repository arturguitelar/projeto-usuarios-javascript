const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

let app = express();
const port = 4000;

// configurações do body-parser
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
// converte para json os dados recebidos via post
app.use(bodyParser.json({ limit: '50mb' }));

// utilizandoo express-validator
app.use(expressValidator());

/* 
  O consign irá fazer o carregamento dos arquivos das pastas indicadas.
  consign().include('nomedapasta').into(onde)
*/
consign()
    .include('routes')
    .include('utils')
    .into(app);

app.listen(port, '127.0.0.1', () => {
    console.log('Servidor rodando na porta:' + port);
});