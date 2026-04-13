import { deletarUsuario } from '../../support/services/usuarios.service'
import {
  getCarrinhoInvalido,
  getCarrinhoPorId,
  criarCarrinho,
  deletarCarrinho,
  deletarCancelarCompra,
} from '../../support/services/carrinhos.service'

const CARRINHO_ID_INEXISTENTE = '7rfEqNeXierOfsSH'
const PRODUTO_ID_INEXISTENTE = 'B5vT8nM1pQ6yS3rD'
const PRODUTO_ID_VALIDO = 'K6leHdftCeOJj8BJ'

describe('Carrinhos - Testes Negativos', () => {
  let message

  before(() => {
    cy.fixture('carrinhos/message').then((msg) => {
      message = msg
    })
  })

  describe('Sem autenticação', () => {
    it('POST / CT002 - Criar carrinho sem token', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = PRODUTO_ID_VALIDO
        criarCarrinho('', carrinho).then((response) => {
          expect(response.status).to.eq(401)
          expect(response.body.message).to.eq(message.tokenInvalido)
        })
      })
    })

    it('DELETE / CT007 - Concluir compra sem token', () => {
      deletarCarrinho('').then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq(message.tokenInvalido)
      })
    })
  })

  describe('Administrador True', () => {
    before(() => {
      cy.loginAdmin()
    })

    after(() => {
      deletarUsuario(Cypress.env('usuarioAdminId'))
    })

    it('GET / CT002 - Endpoint incorreto', () => {
      getCarrinhoInvalido(Cypress.env('tokenAdmin')).then((response) => {
        expect(response.status).to.eq(405)
        expect(response.body.message).to.eq(message.enpointInvalido)
      })
    })

    it('GET ID / CT002 - ID inexistente', () => {
      getCarrinhoPorId(Cypress.env('tokenAdmin'), CARRINHO_ID_INEXISTENTE).then(
        (response) => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq(message.carrinhoNaoEncontrado)
        }
      )
    })

    it('POST / CT004 - Campos em branco', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = ''
        carrinho.produtos[0].quantidade = ''
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body['produtos[0].idProduto']).to.eq(
            message.camposObrigatorios.produtoId
          )
          expect(response.body['produtos[0].quantidade']).to.eq(
            message.camposObrigatorios.quantidade
          )
          expect(response.body.produtos).to.eq(
            message.camposObrigatorios.produtos
          )
        })
      })
    })

    it('POST / CT008 - ID de produto inexistente', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = PRODUTO_ID_INEXISTENTE
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq(message.produtoNaoEncontrado)
        })
      })
    })

    it('POST / CT014 - Quantidade como texto', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].quantidade = 'dez'
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body['produtos[0].quantidade']).to.eq(
            message.camposObrigatorios.quantidade
          )
        })
      })
    })

    it('POST / CT016 - Quantidade zero', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].quantidade = 0
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body['produtos[0].quantidade']).to.eq(
            message.quantidadePositiva
          )
        })
      })
    })

    it('POST / CT017 - Quantidade maior que o estoque', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].quantidade = 1000
        criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body['produtos[0].quantidade']).to.eq(
            message.quantidadeDisponivel
          )
        })
      })
    })

    it('DELETE / CT002 - Concluir compra com carrinho inexistente', () => {
      deletarCarrinho(Cypress.env('tokenAdmin'), CARRINHO_ID_INEXISTENTE).then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq(message.naoFoiEncontradoCarrinho)
        }
      )
    })

    it('DELETE / CT002 - Cancelar compra com carrinho inexistente', () => {
      deletarCancelarCompra(
        Cypress.env('tokenAdmin'),
        CARRINHO_ID_INEXISTENTE
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.naoFoiEncontradoCarrinho)
      })
    })
  })
})
