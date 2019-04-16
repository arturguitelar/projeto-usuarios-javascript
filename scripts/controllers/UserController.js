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

        // Esta é a forma que está no exercício mas não funcionou.
        // this.formEl.elements.forEach(function(field, index) {
        //     if (field.name == 'gender') {
        //         if (field.checked) {
        //             user[field.name] = field.value;
        //         }
        //     } else {
        //         user[field.name] = field.value;
        //     }          
        // });

        for (let i = 0; i < this.formEl.elements.length; i++) {
            let field = this.formEl.elements[i];

            if (field.name == 'gender') {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            } else {
                user[field.name] = field.value;
            } 
        }

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
     * Cria um elemento "tr" para uma tabela especificada utilizando os dados 
     * que foram preenchidos no formulário de criação de usuário.
     * 
     * @param {User} dataUser Objeto com dados do Usuário.
     */
    addLine(dataUser) {

        this.tableEl.innerHTML = `
            <tr>
                <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${dataUser.admin}</td>
                <td>${dataUser.birth}</td>
                <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;
    }

    /**
     * Trata o evento de submissão do formulário.
     */
    onSubmit() {
        // submit do formulário
        this.formEl.addEventListener('submit', event => {
            event.preventDefault();

            this.addLine(this.getValues());
        });
    }
}