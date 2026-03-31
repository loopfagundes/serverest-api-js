import { getProdutos, criarProduto, deletarProduto } from '../../support/services/produtos.service'

describe('Produtos - Testes de Performance', () => {

  let produtoId

  before(() => {
    cy.login('fulano@qa.com', 'teste')
  })

  it('GET /produtos deve responder em menos de 2000ms', () => {
    getProdutos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(2000)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
    })
  })

  it('POST /produtos deve responder em menos de 2000ms', () => {
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Perf QA ${Date.now()}`
      criarProduto(Cypress.env('token'), produto).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.duration).to.be.lessThan(2000)
        produtoId = response.body._id
        cy.log(`Tempo de resposta: ${response.duration}ms`)
      })
    })
  })

  it('DELETE /produtos deve responder em menos de 2000ms', () => {
    deletarProduto(Cypress.env('token'), produtoId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(2000)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
    })
  })

})