import { deletarUsuario } from "../../support/services/usuarios.service"
import { criarProduto, deletarProduto } from '../../support/services/produtos.service'
import { getCarrinhos, getCarrinhoPorId, criarCarrinho, deletarCarrinho, deletarCancelarCompra } from '../../support/services/carrinhos.service'

describe('[GET] Carrinhos - Testes Funcionais', () => {

  before(() => {
    cy.login('fulano@qa.com', 'teste')
  })

  it('GET / CT001 - Buscar todos os carrinhos', () => {
    getCarrinhos(Cypress.env('token')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.carrinhos).to.be.an('array')
    })
  })

  it('GET ID / CT001 - Buscar carrinho por ID', () => {
    getCarrinhos(Cypress.env('token')).then((response) => {
      const carrinhoId = response.body.carrinhos[0]._id
      getCarrinhoPorId(Cypress.env('token'), carrinhoId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('_id')
        expect(response.body.produtos).to.be.an('array')
      })
    })
  })

})

describe('Carrinhos - Testes Funcionais', () => {

  let produtoId

  before(() => {
    cy.loginAdmin()
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Carrinho QA ${Date.now()}`
      produto.quantidade = 10
      criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
        expect(response.status).to.eq(201)
        produtoId = response.body._id
      })
    })
  })

  after(() => {
    deletarCarrinho(Cypress.env('tokenAdmin'))
    deletarProduto(Cypress.env('tokenAdmin'), produtoId)
    deletarUsuario(Cypress.env('usuarioAdminId'))
  })


  it('POST / CT001 - Adicionar o ID do produto ao carrinho', () => {
    cy.fixture('carrinhos/carrinho').then((carrinho) => {
      carrinho.produtos[0].idProduto = produtoId
      cy.fixture('carrinhos/message').then((message) => {
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.message).to.eq(message.adicionaProdutoAoCarrinhoComSucesso)
        })
      })
    })
  })

  it('DELETE / CT001 - Excluir um carrinho cadastrado como concluir a compra', () => {
    cy.fixture('carrinhos/message').then((message) => {
      deletarCarrinho(Cypress.env('tokenAdmin')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.carrinhoExcluidoComSucesso)
      })
    })
  })

})

describe('[DELETE] Carrinhos - Testes Funcionais', () => {

  let produtoId

  before(() => {
    cy.loginAdmin()
    cy.fixture('produtos/produto').then((produto) => {
      produto.nome = `Produto Carrinho QA ${Date.now()}`
      produto.quantidade = 5
      criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
        expect(response.status).to.eq(201)
        produtoId = response.body._id
      })
    })
    cy.fixture('carrinhos/carrinho').then((carrinho) => {
      carrinho.produtos[0].idProduto = produtoId
      criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
        expect(response.status).to.eq(201)
      })
    })
  })


  after(() => {
    deletarProduto(Cypress.env('tokenAdmin'), produtoId)
    deletarUsuario(Cypress.env('usuarioAdminId'))
  })

  it('DELETE / CT001 - Excluir um carrinho cadastrado como desistência da compra', () => {
    cy.fixture('carrinhos/message').then((message) => {
      deletarCancelarCompra(Cypress.env('tokenAdmin')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.produtosReabastecidos)
      })
    })
  })

})