import { criarProduto, deletarProduto } from '../../support/services/produtos.service'
import { getCarrinhos, criarCarrinho, deletarCarrinho } from '../../support/services/carrinhos.service'

describe('Carrinhos - Testes de Performance', () => {

  let produtoId

  before(() => {
    cy.login('fulano@qa.com', 'teste')
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Perf Carrinho QA ${Date.now()}`
      criarProduto(Cypress.env('token'), produto).then((response) => {
        produtoId = response.body._id
      })
    })
  })

  after(() => {
    deletarProduto(Cypress.env('token'), produtoId)
  })

  it('GET /carrinhos deve responder em menos de 2000ms', () => {
    getCarrinhos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(2000)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
    })
  })

  it('POST /carrinhos deve responder em menos de 2000ms', () => {
    cy.fixture('carrinhos/carrinho').then((carrinho) => {
      carrinho.produtos[0].idProduto = produtoId
      criarCarrinho(Cypress.env('token'), carrinho).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.duration).to.be.lessThan(2000)
        cy.log(`Tempo de resposta: ${response.duration}ms`)
      })
    })
  })

  it('DELETE /carrinhos deve responder em menos de 2000ms', () => {
    deletarCarrinho(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(2000)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
    })
  })

})