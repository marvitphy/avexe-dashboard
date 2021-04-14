const knex = require('../db')


function cadEmpresa(nome, descricao, rua, bairro, complemento, contato, instagram, facebook, email, whatsapp, categorias, logo, horarios, cidade, estado, cep) {
    return knex('empresas').insert({ nome, descricao, rua, bairro, complemento, contato, instagram, facebook, email, whatsapp, categorias, logo, horarios, cidade, estado, cep })
        .then(result => result)
        .catch(err => err)
}

module.exports = {
    cadEmpresa
}