module.exports = {
    user: (app, req, res) => {
        // validação de campos utilizando express-validator
        req.assert('_name', 'O nome é obrigatório.').notEmpty();
        req.assert('_email', 'O e-mail está inválido.').notEmpty().isEmail();

        let errors = req.validationErrors();
        // se existir erros retorna um array, caso contrário retorna true
        if (errors) {
            app.utils.error.send(errors, req, res);
            return false;
        }

        return true;
    }
}