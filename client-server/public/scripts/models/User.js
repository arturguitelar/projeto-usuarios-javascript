class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {
        this._admin;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;

        this._register = new Date();
    }

    /* Getters & Setters */
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }
    
    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    get register() {
        return this._register;
    }

    set country(value) {
        this._country = value;
    }

    set photo(value) {
        this._photo = value;
    }

    /* Methods */
    /**
     * Carrega um usuário a partir de um JSON.
     * 
     * @param {JSON} json JSON com os dados.
     */
    loadFromJSON(json) {
        for (let name in json) {
            switch(name) {
                case '_register':
                    this[name] = new Date(json[name]);
                break;

                default:
                    if (name.substring(0, 1) === '_') this[name] = json[name];
            }
        }
    }

    /**
     * Cria um JSON com os dados de user.
     * 
     * @return {JSON} json
     */
    toJSON() {
        let json = {};

        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) json[key] = this[key];
        });

        return json;
    }

    /* CRUD - User */
    
    /**
     * Salva um novo usuário no banco ou atualiza um usuário já existente.
     * - Utiliza a classe HttpRequest.
     * 
     * @return {Promise} Promise
     */
    save() {
        return new Promise((resolve, reject) => {
            let promise;

            if (this.id) {
                // Neste caso, é um update no user
                // Este método utiliza a classe HttpRequest
                // promise = HttpRequest.put(`/users/${this.id}`, this.toJSON());

                // Para exemplo do exercício, o mesmo resultado deve ser obtido
                // utilizando-se a classe Fetch
                promise = Fetch.put(`/users/${this.id}`, this.toJSON());

            } else {
                // Neste caso, é um novo cadastro
                // Este método utiliza a classe HttpRequest
                // promise = HttpRequest.post('/users', this.toJSON());

                // Para exemplo do exercício, o mesmo resultado deve ser obtido
                // utilizando-se a classe Fetch
                promise = Fetch.post('/users', this.toJSON());
            }

            promise.then(data => {
                this.loadFromJSON(data);
                resolve(this);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**
     * Pega os usuários do storage.
     * 
     * @return {Promise} Usuários na storage.
     */
    static getUsersStorage() {
        // Este método utiliza a classe HttpRequest
        // return HttpRequest.get('/users');

        // Para exemplo do exercício, o mesmo resultado deve ser obtido
        // utilizando-se a classe Fetch
        return Fetch.get('/users');
    }

    /**
     * Remove um usuário especificado do storage.
     */
    remove() {
        // Este método utiliza a classe HttpRequest
        // return HttpRequest.delete(`/users/${this.id}`);
        
        // Para exemplo do exercício, o mesmo resultado deve ser obtido
        // utilizando-se a classe Fetch
        return Fetch.delete(`/users/${this.id}`);   
    }
}