const knex = require('../db')


function cadEmpresa(nome, descricao, rua, bairro, complemento, contato, instagram, facebook, email, whatsapp, categorias, logo, capa, horarios, cidade, estado, cep, numero, telefone) {
    return knex('empresas').insert({ nome, descricao, rua, bairro, complemento, contato, instagram, facebook, email, whatsapp, categorias, logo, capa, horarios, cidade, estado, cep, numero, telefone })
        .then(result => result)
        .catch(err => err)
}

function updateStatus(id, status) {
    return knex('empresas').where('id', '=', id).update({ status })
        .then(result => result)
        .catch(err => err)
}

module.exports = {
    cadEmpresa,
    updateStatus
}