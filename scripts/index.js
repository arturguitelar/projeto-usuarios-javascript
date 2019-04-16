// seleciona os campos do formulário pelo atributo name
var fields = document.querySelectorAll('#form-user-create [name]');
var user = {};

// submit do formulário
document.getElementById('form-user-create').addEventListener('submit', function(event) {
    event.preventDefault();

    // cria dinamicamente as chaves e os dados para o objeto user
    fields.forEach(function(field, index) {
        if (field.name == 'gender') {
            if (field.checked) {
                user[field.name] = field.value;
            }
        } else {
            user[field.name] = field.value;
        }
        
    });

    console.log(user);
});