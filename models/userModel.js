const knex = require('../db')


function getUser(str) {
    return knex('usuarios').select().where('email', '=', `${str}`)
        .orderBy('id', 'desc')
        .then(result => result)
        .catch(err => err)
}

function cadUser(nome, email, password, created_at) {
    return knex('usuarios').insert({ nomeCompleto: nome, email, password, created_at })
        .then(result => result)
        .catch(err => err)
}

module.exports = {
    getUser,
    cadUser
}