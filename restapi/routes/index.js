/**
 * Neste caso, está utilizando o recurso do módulo Consign
 * para auto-carregamento de rotas na aplicação.
 */
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>RESTful API.</h1>');
    });
};