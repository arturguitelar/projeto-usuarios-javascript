/**
 * Consulta api utilizando fetch.
 */
class Fetch {
    /* CRUD */

    static get(url, params = {}) {
        return Fetch.request('GET', url, params);
    }

    static post(url, params = {}) {
        return Fetch.request('POST', url, params);
    }

    static put(url, params = {}) {
        return Fetch.request('PUT', url, params);
    }

    static delete(url, params = {}) {
        return Fetch.request('DELETE', url, params);
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
            // verificando métodos para as configurações do request
            let request;

            // é preciso garantir que o nome do método esteja em letra minúscula
            switch (method.toLowerCase()) {
                case 'get':
                    request =  url;
                break;

                // as configurações de request permitem executar um fetch
                // mais parametrizado para os outros métodos que necessitem parâmetros.
                // Ex.: put, delete, post...
                default:
                    request = new Request(url, {
                        method,
                        body: JSON.stringify(params),
                        headers: new Headers({
                            'Content-Type': 'application/json'
                        })
                    });
            }

            fetch(request).then(response => {
                
                response.json().then(json => {
                    
                    resolve(json);
                }).catch(e => { 
                    
                    reject(e); 
                });
            }).catch(e => { 
                
                reject(e); 
            });

        }); // fim Promise
    }
}