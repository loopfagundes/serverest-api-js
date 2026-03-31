import Ajv from 'ajv'
import { criarProduto, deletarProduto } from '../../support/services/produtos.service'
import { criarCarrinho, getCarrinhos, deletarCarrinho } from '../../support/services/carrinhos.service'
import { carrinhoSchema } from '../../support/schemas/carrinho.schema'

const ajv = new Ajv()

describe('Carrinhos - Testes de Contrato', () => {

  let produtoId

  before(() => {
    cy.login('fulano@qa.com', 'teste')
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Contrato QA ${Date.now()}`
      criarProduto(Cypress.env('token'), produto).then((response) => {
        produtoId = response.body._id
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
          carrinho.produtos[0].idProduto = produtoId
          criarCarrinho(Cypress.env('token'), carrinho)
        })
      })
    })
  })

  after(() => {
    deletarCarrinho(Cypress.env('token'))
    deletarProduto(Cypress.env('token'), produtoId)
  })

  it('deve validar o schema do carrinho', () => {
    getCarrinhos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)

      const carrinho = response.body.carrinhos[0]
      const validate = ajv.compile(carrinhoSchema)
      const valid = validate(carrinho)

      if (!valid) {
        cy.log('Erros de schema: ' + JSON.stringify(validate.errors))
      }

      expect(valid, JSON.stringify(validate.errors)).to.be.true
    })
  })

})