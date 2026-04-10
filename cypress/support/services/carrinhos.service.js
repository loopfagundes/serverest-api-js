const getCarrinhos = (token) => {
  return cy.request({
    method: 'GET',
    url: '/carrinhos',
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const getCarrinhoInvalido = (token) => {
  return cy.request({
    method: 'GET',
    url: '/carrinho',
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const getCarrinhoPorId = (token, id) => {
  return cy.request({
    method: 'GET',
    url: `/carrinhos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const criarCarrinho = (token, body) => {
  return cy.request({
    method: 'POST',
    url: '/carrinhos',
    headers: { Authorization: token },
    body: body,
    failOnStatusCode: false,
  })
}

const deletarCarrinho = (token) => {
  return cy.request({
    method: 'DELETE',
    url: '/carrinhos/concluir-compra',
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

const deletarCancelarCompra = (token) => {
  return cy.request({
    method: 'DELETE',
    url: '/carrinhos/cancelar-compra',
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
}

module.exports = { getCarrinhos, getCarrinhoPorId, getCarrinhoInvalido, criarCarrinho, deletarCarrinho, deletarCancelarCompra }