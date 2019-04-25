let NeDB = require('nedb');

// Configurações para a criação de um arquivo deste tipo de banco de dados
// autoload -> se o arquivo não existir, ele é criado e carregado na memória
let db = new NeDB({
    filename: 'users.db',
    autoload: true
});

/**
 * Neste caso, está utilizando o recurso do módulo Consign
 * para auto-carregamento de rotas na aplicação.
 */
module.exports = (app) => {

    let route = app.route('/users');

    route.get((req, res) => {

        // o find({}) significa que está listando todos os usuários
        // o sort() organiza por ordem. 1 = crescente e -1 = decrescente
        db.find({}).sort({ name: 1 }).exec((err, users) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ users }); // ECMA6 para users: users
            }
        });
    });
    
    route.post((req, res) => {
        // validação de campos utilizando express-validator
        if (!app.utils.validator.user(app, req, res)) return false;

        // insere no banco de dados
        db.insert(req.body, (err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });

    let routeID = app.route('/users/:id');

    // busca usuario pelo id passado via parâmetro da rota
    routeID.get((req, res) => {
        db.findOne({ _id: req.params.id }).exec((err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });

    // faz update dos dados de um usuário
    routeID.put((req, res) => {
        // validação de campos utilizando express-validator
        if (!app.utils.validator.user(app, req, res)) return false;
        
        db.update({ _id: req.params.id }, req.body, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.params, req.body));
            }
        });
    });

    // remove um usuário
    routeID.delete((req, res) => {
        db.remove({ _id: req.params.id }, {}, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });
    });
};