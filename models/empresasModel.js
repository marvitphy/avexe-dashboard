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

function editarEmpresa(id, obj) {
    return knex('empresas').where('id', '=', id).update({...obj })
        .then(result => result)
        .catch(err => err)
}

function removerEmpresa(id) {
    return knex('empresas').where('id', '=', id).update({ deleted: 1 })
        .then(result => result)
        .catch(err => err)
}

module.exports = {
    cadEmpresa,
    updateStatus,
    removerEmpresa,
    editarEmpresa
}