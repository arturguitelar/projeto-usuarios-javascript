class UserController {
    /**
     * Recebe o id do formulário que será usado como referência.
     * Recebe o id da tabela onde será criado um elemento "tr"
     * com os dados que foram recebidos do formulário.
     * 
     * @param {string} formID ID do formulário.
     * @param {string} tableID ID da tabela.
     */
    constructor(formID, tableID) {
        this.formEl = document.getElementById(formID);
        this.tableEl = document.getElementById(tableID);

        this.onSubmit();
    }

    /**
     * Pega os valores do formulário criado no construtor e 
     * cria dinamicamente as chaves e os dados para um objeto user.
     * 
     * @return {User} User.
     */
    getValues() {

        let user = {};

        // Solução com spread operator
        [...this.formEl.elements].forEach(function(field, index) {
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

        // // Solução com um laço for
        // for (let i = 0; i < this.formEl.elements.length; i++) {
        //     let field = this.formEl.elements[i];

        //     if (field.name == 'gender') {
        //         if (field.checked) {
        //             user[field.name] = field.value;
        //         }
        //     } else {
        //         user[field.name] = field.value;
        //     } 
        // }

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
     * Cria um elemento "tr" para uma tabela especificada utilizando os dados 
     * que foram preenchidos no formulário de criação de usuário.
     * 
     * @param {User} dataUser Objeto com dados do Usuário.
     */
    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${dataUser.birth}</td>
            <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableEl.appendChild(tr);
    }

    /**
     * Trata o evento de submissão do formulário.
     */
    onSubmit() {
        // submit do formulário
        this.formEl.addEventListener('submit', event => {
            event.preventDefault();

            let values = this.getValues();

            this.getPhoto().then(
                (content) => {
                    values.photo = content;

                    this.addLine(values);
                },
                (e) => {
                    console.error(e);
                }
            );
            
        });
    }
}