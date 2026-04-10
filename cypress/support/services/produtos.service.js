const getProdutos = (token) => {
  return cy.request({
    method: 'GET',
    url: '/produtos',
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const getProdutosInvalido = (token) => {
  return cy.request({
    method: 'GET',
    url: '/produto',
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const getProdutosPorId = (token, id) => {
  return cy.request({
    method: 'GET',
    url: `/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const criarProduto = (token, body) => {
  return cy.request({
    method: 'POST',
    url: '/produtos',
    headers: { Authorization: token },
    body: body,
    failOnStatusCode: false,
  })
}

const editarProduto = (token, id, body) => {
  return cy.request({
    method: 'PUT',
    url: `/produtos/${id}`,
    headers: { Authorization: token },
    body: body,
    failOnStatusCode: false,
  })
}

const deletarProduto = (token, id) => {
  return cy.request({
    method: 'DELETE',
    url: `/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

module.exports = {
  getProdutos,
  getProdutosInvalido,
  getProdutosPorId,
  criarProduto,
  editarProduto,
  deletarProduto,
}
