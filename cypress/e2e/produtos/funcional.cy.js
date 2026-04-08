import { criarProduto, getProdutos, editarProduto, deletarProduto, getProdutosPorId } from '../../support/services/produtos.service'

describe('Produtos - Testes Funcionais', () => {

  let produtoId

  before(() => {
    cy.login('fulano@qa.com', 'teste')
  })

  it('GET / CT001 - Buscar todos os produtos cadastrados', () => {
    getProdutos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.produtos).to.be.an('array')
      expect(response.body.quantidade).to.be.greaterThan(0)
    })
  })

  it('GET ID / CT001 - Buscar produto por ID', () => {
    getProdutosPorId(Cypress.env('token'), 'BeeJh5lz3k6kSIzA').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('_id')
    })
  })

  it('POST / CT001 - Criar um novo produto', () => {
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto QA ${Date.now()}`
      criarProduto(Cypress.env('token'), produto).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
        produtoId = response.body._id
      })
    })
  })

  it('PUT / CT001 - Edição por ID do produto', () => {
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Editado QA ${Date.now()}`
      editarProduto(Cypress.env('token'), produtoId, produto).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro alterado com sucesso')
      })
    })
  })

  it('DELETE / CT001 - Exclusão por ID do produto', () => {
    deletarProduto(Cypress.env('token'), produtoId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Registro excluído com sucesso')
    })
  })

})