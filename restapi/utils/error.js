/**
 * Módulo útil para tratamento de erros.
 */
module.exports = {
    /**
     * Recebe uma requisição de erro.
     * - Cria um log desse erro.
     * - Retorna os status em json.
     * 
     * @param err Erro.
     * @param req Requisição.
     * @param res Resposta.
     * @param code Default: 400
     */
    send: (err, req, res, code = 400) => {
        console.log(`error: ${err}`);
        res.status(code).json({
            error: err
        });
    }
};