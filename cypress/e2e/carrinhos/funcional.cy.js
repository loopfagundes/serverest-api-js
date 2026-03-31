import { criarProduto, deletarProduto } from '../../support/services/produtos.service'
import { getCarrinhos, criarCarrinho, deletarCarrinho } from '../../support/services/carrinhos.service'

describe('Carrinhos - Testes Funcionais', () => {

  let produtoId

  before(() => {
    cy.login('fulano@qa.com', 'teste')
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Carrinho QA ${Date.now()}`
      criarProduto(Cypress.env('token'), produto).then((response) => {
        expect(response.status).to.eq(201)
        produtoId = response.body._id
      })
    })
  })

  after(() => {
    deletarProduto(Cypress.env('token'), produtoId)
  })

  it('deve listar todos os carrinhos', () => {
    getCarrinhos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.carrinhos).to.be.an('array')
    })
  })

  it('deve criar um carrinho com sucesso', () => {
    cy.fixture('carrinhos/carrinho').then((carrinho) => {
      carrinho.produtos[0].idProduto = produtoId
      criarCarrinho(Cypress.env('token'), carrinho).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      })
    })
  })

  it('deve concluir a compra com sucesso', () => {
    deletarCarrinho(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Registro excluído com sucesso')
    })
  })

  it('não deve criar dois carrinhos para o mesmo usuário', () => {
    cy.fixture('carrinhos/carrinho').then((carrinho) => {
      carrinho.produtos[0].idProduto = produtoId
      criarCarrinho(Cypress.env('token'), carrinho).then(() => {
        criarCarrinho(Cypress.env('token'), carrinho).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq('Não é permitido ter mais de 1 carrinho')
          deletarCarrinho(Cypress.env('token'))
        })
      })
    })
  })

  it('não deve criar carrinho sem token', () => {
    cy.fixture('carrinhos/carrinho').then((carrinho) => {
      carrinho.produtos[0].idProduto = produtoId
      criarCarrinho('', carrinho).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
      })
    })
  })

})