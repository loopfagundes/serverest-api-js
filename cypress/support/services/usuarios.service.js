const getUsuarios = () => {
  return cy.request({
    method: 'GET',
    url: '/usuarios',
    failOnStatusCode: false,
  })
}

const criarUsuario = (body) => {
  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: body,
    failOnStatusCode: false,
  })
}

const buscarUsuarioPorId = (id) => {
  return cy.request({
    method: 'GET',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
  })
}


const editarUsuario = (id, body) => {
  return cy.request({
    method: 'PUT',
    url: `/usuarios/${id}`,
    body: body,
    failOnStatusCode: false,
  })
}

const deletarUsuario = (id) => {
  return cy.request({
    method: 'DELETE',
    url: `/usuarios/${id}`,
    failOnStatusCode: false,
  })
}

module.exports = { getUsuarios, criarUsuario, buscarUsuarioPorId, editarUsuario, deletarUsuario }