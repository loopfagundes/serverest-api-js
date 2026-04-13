import { deletarUsuario } from '../../support/services/usuarios.service'
import {
  criarProduto,
  deletarProduto,
} from '../../support/services/produtos.service'
import {
  getCarrinhos,
  getCarrinhoPorId,
  criarCarrinho,
  deletarCarrinho,
  deletarCancelarCompra,
} from '../../support/services/carrinhos.service'

describe('Carrinhos - Testes Funcionais', () => {
  let message

  before(() => {
    cy.fixture('carrinhos/message').then((msg) => {
      message = msg
    })
  })

  describe('[GET] Listar Carrinhos', () => {
    before(() => {
      cy.loginAdmin()
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = `Produto GET Carrinho ${Date.now()}`
        produto.quantidade = 5
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          Cypress.env('produtoGetId', response.body._id)
          cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = Cypress.env('produtoGetId')
            criarCarrinho(Cypress.env('tokenAdmin'), carrinho)
          })
        })
      })
    })

    after(() => {
      deletarCarrinho(Cypress.env('tokenAdmin'))
      deletarProduto(Cypress.env('tokenAdmin'), Cypress.env('produtoGetId'))
      deletarUsuario(Cypress.env('usuarioAdminId'))
    })

    it('GET / CT001 - Buscar todos os carrinhos', () => {
      getCarrinhos(Cypress.env('tokenAdmin')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.carrinhos).to.be.an('array')
      })
    })

    it('GET ID / CT001 - Buscar carrinho por ID', () => {
      getCarrinhos(Cypress.env('tokenAdmin')).then((response) => {
        const carrinhoId = response.body.carrinhos[0]._id
        getCarrinhoPorId(Cypress.env('tokenAdmin'), carrinhoId).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.have.property('_id')
          expect(res.body.produtos).to.be.an('array')
        })
      })
    })
  })

  describe('[POST] Criar Carrinho', () => {
    before(() => {
      cy.loginAdmin()
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = `Produto POST Carrinho ${Date.now()}`
        produto.quantidade = 10
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          Cypress.env('produtoPostId', response.body._id)
        })
      })
    })

    after(() => {
      deletarCarrinho(Cypress.env('tokenAdmin'))
      deletarProduto(Cypress.env('tokenAdmin'), Cypress.env('produtoPostId'))
      deletarUsuario(Cypress.env('usuarioAdminId'))
    })

    it('POST / CT001 - Adicionar produto ao carrinho', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = Cypress.env('produtoPostId')
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.message).to.eq(
            message.adicionaProdutoAoCarrinhoComSucesso
          )
        })
      })
    })

    it('DELETE / CT001 - Concluir compra', () => {
      deletarCarrinho(Cypress.env('tokenAdmin')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.carrinhoExcluidoComSucesso)
      })
    })
  })

  describe('[DELETE] Cancelar Compra', () => {
    before(() => {
      cy.loginAdmin()
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = `Produto DELETE Carrinho ${Date.now()}`
        produto.quantidade = 5
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          Cypress.env('produtoDeleteId', response.body._id)
          cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = Cypress.env('produtoDeleteId')
            criarCarrinho(Cypress.env('tokenAdmin'), carrinho)
          })
        })
      })
    })

    after(() => {
      deletarProduto(Cypress.env('tokenAdmin'), Cypress.env('produtoDeleteId'))
      deletarUsuario(Cypress.env('usuarioAdminId'))
    })

    it('DELETE / CT001 - Cancelar compra e reabastece estoque', () => {
      deletarCancelarCompra(Cypress.env('tokenAdmin')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.produtosReabastecidos)
      })
    })
  })
})
