/**
 * Consulta api via ajax.
 */
class HttpRequest {
    /* CRUD */

    static get(url, params = {}) {
        return HttpRequest.request('GET', url, params);
    }

    static post(url, params = {}) {
        return HttpRequest.request('POST', url, params);
    }

    static put(url, params = {}) {
        return HttpRequest.request('PUT', url, params);
    }

    static delete(url, params = {}) {
        return HttpRequest.request('DELETE', url, params);
    }

    /**
     * Retorna uma Promise com os dados de uma requisição.
     * 
     * @param {String} method 
     * @param {String} url 
     * @param {*} params 
     * 
     * @return {Promise} Promise
     */
    static request(method, url, params = {}) {
        
        return new Promise ((resolve, reject) => {

            let ajax = new XMLHttpRequest();

            // Nota: "method" se refere aos métodos Http.
            // Por padrão estes métodos são em letra maiúscula: "GET", "POST" e etc.
            ajax.open(method.toUpperCase(), url);
            
            ajax. error = event => {
                reject(e);
            };

            ajax.onload = event => {
                
                let obj = {};
                
                try {
                    obj = JSON.parse(ajax.responseText);
                } catch (err) {
                    reject(err);
                    console.error(err);
                }
    
                resolve(obj);
            };

            ajax.setRequestHeader('Content-Type', 'application/json');
            
            // Nota: O método sendo do ajax só envia texto
            ajax.send(JSON.stringify(params));
        });
    }
}