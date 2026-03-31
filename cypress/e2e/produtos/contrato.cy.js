import Ajv from 'ajv'
import { getProdutos } from '../../support/services/produtos.service'
import { produtoSchema } from '../../support/schemas/produto.schema'

const ajv = new Ajv()

describe('Produtos - Testes de Contrato', () => {

  before(() => {
    cy.login('fulano@qa.com', 'teste')
  })

  it('deve validar o schema de um produto', () => {
    getProdutos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)

      const produto = response.body.produtos[0]
      const validate = ajv.compile(produtoSchema)
      const valid = validate(produto)

      if (!valid) {
        cy.log('Erros de schema: ' + JSON.stringify(validate.errors))
      }

      expect(valid, JSON.stringify(validate.errors)).to.be.true
    })
  })

})