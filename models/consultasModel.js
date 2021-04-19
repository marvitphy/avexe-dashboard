const knex = require('../db')


function getResultsCat(str) {
    return knex('empresas').select().where('categorias', 'like', `%${str}%`)
        .orderBy('id', 'desc')
        .then(result => result)
        .catch(err => err)
}


function getEmpresas() {
    return knex('empresas').select('id', 'nome', 'status').where('deleted', '=', 0).orderBy('id', 'desc')
        .then(result => result)
        .catch(err => err)
}

function getEmpresaById(id) {
    return knex('empresas').select().where('id', '=', id)
        .then(result => result)
        .catch(err => err)
}

function getResultsNome(str) {
    return knex('empresas').select().where('nome', 'like', `%${str}%`)
        .orderBy('id', 'desc')
        .then(result => result)
        .catch(err => err)
}

function getCidades(str) {
    return knex('cidades').select().where('nome', 'like', `${str}%`)
        .orderBy('id', 'asc')
        .then(result => result)
        .catch(err => err)
}

function getCidadesById(str) {
    return knex('cidades').select().where('id', '=', `${str}`)
        .orderBy('id', 'asc')
        .then(result => result)
        .catch(err => err)
}

module.exports = {
    getResultsCat,
    getResultsNome,
    getCidades,
    getCidadesById,
    getEmpresas,
    getEmpresaById
}