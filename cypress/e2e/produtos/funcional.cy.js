import {
  criarProduto,
  getProdutos,
  editarProduto,
  deletarProduto,
  getProdutosPorId,
} from '../../support/services/produtos.service'

describe('Produtos - Testes Funcionais', () => {
  let message

  before(() => {
    cy.login('fulano@qa.com', 'teste')
    cy.fixture('produtos/message').then((msg) => {
      message = msg
    })
  })

  it('GET / CT001 - Buscar todos os produtos cadastrados', () => {
    getProdutos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.produtos).to.be.an('array')
      expect(response.body.quantidade).to.be.greaterThan(0)
    })
  })

  it('GET ID / CT001 - Buscar produto por ID', () => {
    getProdutosPorId(Cypress.env('token'), 'BeeJh5lz3k6kSIzA').then(
      (response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('_id')
      }
    )
  })

  it('POST / CT001 - Criar um novo produto', () => {
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto QA ${Date.now()}`
      criarProduto(Cypress.env('token'), produto).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.message).to.eq(message.produtoCriado)
        Cypress.env('produtoId', response.body._id) // ← Cypress.env
      })
    })
  })

  it('PUT / CT001 - Edição por ID do produto', () => {
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Editado QA ${Date.now()}`
      editarProduto(
        Cypress.env('token'),
        Cypress.env('produtoId'),
        produto
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.produtoAlterado)
      })
    })
  })

  it('DELETE / CT001 - Exclusão por ID do produto', () => {
    deletarProduto(Cypress.env('token'), Cypress.env('produtoId')).then(
      (response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.produtoExculido)
      }
    )
  })
})
