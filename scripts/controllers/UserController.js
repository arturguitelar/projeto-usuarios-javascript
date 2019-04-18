class UserController {
    /**
     * Recebe o id do formulário que será usado como referência.
     * Recebe o id da tabela onde será criado um elemento "tr"
     * com os dados que foram recebidos do formulário.
     * 
     * @param {string} formIDCreate ID do formulário de criação.
     * @param {string} formIDUpdate ID do formulário de edição.
     * @param {string} tableID ID da tabela.
     */
    constructor(formIDCreate, formIDUpdate, tableID) {
        this.formEl = document.getElementById(formIDCreate);
        this.formUpdateEl = document.getElementById(formIDUpdate);
        this.tableEl = document.getElementById(tableID);

        this.onSubmit();
        this.onEdit();
    }

    /**
     * Pega os valores do formulário recebido e 
     * cria dinamicamente as chaves e os dados para um objeto user.
     * 
     * @param formEl Formulário.
     * @return {User} User.
     */
    getValues(formEl) {

        let user = {};
        let isValid = true;

        // Solução com spread operator
        [...formEl.elements].forEach(function(field, index) {

            /* Validação de campos. */
            /* 
             * Utiliza a lógica de indexOf para arrays, já que, neste método,
             * quando não é encontrado um índice com o valor o indexOf retorna -1.
             * Além disso, o valor do campo precisa ser diferente de vazio ou não existe.
            */
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                // neste caso é preciso acessar o elemento pai do input e adicionar a classe css "has-error"
                field.parentElement.classList.add('has-error');
                isValid = false;
            }

            /*
             * Verificando se os campos "gender" e "admin" estão checados. 
            */
            if (field.name == 'gender') {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name == 'admin') {
                user[field.name] = field.checked;
            } else {
                user[field.name] = field.value;
            }          
        });

        // se o formulário não estiver válido, não deve criar um usuário.
        if (!isValid) return false;

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );
    }

    /**
     * Utiliza a api FileReader para trazer uma imagem
     * selecionada pelo usuário para o frontend.
     * 
     * @return {Promise} Promisse para a imagem.
     */
    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            // buscando o elemento photo
            let elements = [...this.formEl.elements].filter(item => {
                if (item.name === 'photo') return item;
            });

            let file = elements[0].files[0];
            
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {
                reject(e)
            };

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        });
    }

    /**
     * Trata o evento de submissão do formulário.
     */
    onSubmit() {
        // submit do formulário
        this.formEl.addEventListener('submit', event => {
            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit]');

            btn.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values) return false;

            this.getPhoto().then(
                (content) => {
                    values.photo = content;

                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;
                },
                (e) => {
                    console.error(e);
                }
            );
            
        });
    }

    /**
     * Trata os eventos de edição do formulário.
     */
    onEdit() {
        // botão de cancelar
        document.querySelector("#box-user-update .btn-cancel").addEventListener('click', e => {
            this.showPanelCreate();
        });

        // submit do formulário
        this.formUpdateEl.addEventListener('submit', event => {
            event.preventDefault();

            let btn = this.formUpdateEl.querySelector('[type=submit]');
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            console.log(values);

            // referenciando o índice que foi criado quando houve o click em "editar"
            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
                <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${(values.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(values.register)}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

            this.addEventsTr(tr);

            this.updateCount();
        });
    }
    
    /** View */
    /**
     * Cria um elemento "tr" para uma tabela especificada utilizando os dados 
     * que foram preenchidos no formulário de criação de usuário.
     * 
     * @param {User} dataUser Objeto com dados do Usuário.
     */
    addLine(dataUser) {

        let tr = document.createElement('tr');

        // Serializa os dados do usuário para a criação do dataset.
        // Isso foi feito para fins didáticos. Não é seguro.
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    /**
     * Percorre cada elemento contido na tabela.
     * Atualiza o total de usuários na view.
     * Atualiza o total de usuários admin na view.
     */
    updateCount() {
        let numberUsers = 0;
        let numberAdmins = 0;

        [...this.tableEl.children].forEach(tr => {
            numberUsers++;

            // Recuperando dados do usuário através do dataset.
            // Feito para fins didáticos. Não é seguro.
            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmins++;
        });

        // concluída a contagem, envia para o html
        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admins').innerHTML = numberAdmins;
    }

    /**
     * Mostra o painel de criação de usuário.
     */
    showPanelCreate() {
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    /**
     * Mostra o painel de edição de usuário.
     */
    showPanelUpdate() {
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

    /**
     * Adiciona eventos em uma tr especificada.
     * 
     * @param {HTMLTableRowElement} tr  Tr que receberá o evento.
     */
    addEventsTr(tr) {
        // adicionando evento ao botão editar
        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector('#form-user-update');

            // Estabelecendo um id para o registro que será editado.
            form.dataset.trIndex = tr.sectionRowIndex;

            /**
             * Como os dados recuperados vai dataset são um objeto novo copiado do User,
             * as propriedades privadas estão com um underline (_). É preciso percorrer
             * este novo objeto e comparar as propriedades com os campos do formulário,
             * que não possuem underline e então retirar o underline dessas propriedades.
             */
            for (let name in json) {
                let field = form.querySelector("[name=" + name.replace("_", "") + "]");
                
                if (field) {

                    switch (field.type) {
                        case 'file':
                            continue;
                        break;
                    
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] +"]");
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                    }
                }
            }

            this.showPanelUpdate();
        });
    }
}