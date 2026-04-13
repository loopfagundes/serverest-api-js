import {
  criarUsuario,
  deletarUsuario,
} from '../../support/services/usuarios.service'
import { login } from '../../support/services/auth.service'
import {
  criarProduto,
  getProdutos,
  getProdutosPorId,
  deletarProduto,
} from '../../support/services/produtos.service'
import {
  criarCarrinho,
  deletarCancelarCompra,
} from '../../support/services/carrinhos.service'

describe('Fluxos de Cancelar Compra - Testes Funcionais', () => {
  let messageUsuario
  let messageProduto
  let messageCarrinho

  before(() => {
    cy.fixture('usuarios/message').then((msg) => {
      messageUsuario = msg
    })
    cy.fixture('produtos/message').then((msg) => {
      messageProduto = msg
    })
    cy.fixture('carrinhos/message').then((msg) => {
      messageCarrinho = msg
    })
  })

  describe('Administrador True', () => {
    after(() => {
      deletarProduto(
        Cypress.env('fluxoCancelAdminToken'),
        Cypress.env('fluxoCancelAdminProdutoId')
      )
      deletarUsuario(Cypress.env('fluxoCancelAdminId'))
    })

    it('POST / CT001 - Cadastrar novo usuário administrador', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = `user_true_cancel_${Date.now()}@qa.com.br`
        Cypress.env('fluxoCancelAdminEmail', usuario.email)
        Cypress.env('fluxoCancelAdminPassword', usuario.password)
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('_id')
          expect(response.body.message).to.eq(
            messageUsuario.responseUsuarioCadastrado
          )
          Cypress.env('fluxoCancelAdminId', response.body._id)
        })
      })
    })

    it('POST / CT002 - Realizar login e gerar token', () => {
      login(
        Cypress.env('fluxoCancelAdminEmail'),
        Cypress.env('fluxoCancelAdminPassword')
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.not.be.empty
        Cypress.env('fluxoCancelAdminToken', response.body.authorization)
      })
    })

    it('POST / CT003 - Criar novo produto', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = `Produto Cancel Admin ${Date.now()}`
        criarProduto(Cypress.env('fluxoCancelAdminToken'), produto).then(
          (response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('_id')
            expect(response.body.message).to.eq(messageProduto.produtoCriado)
            Cypress.env('fluxoCancelAdminProdutoId', response.body._id)
          }
        )
      })
    })

    it('GET / CT004 - Listar produtos disponíveis', () => {
      getProdutos(Cypress.env('fluxoCancelAdminToken')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.quantidade).to.be.greaterThan(0)
      })
    })

    it('GET ID / CT005 - Buscar produto por ID', () => {
      getProdutosPorId(
        Cypress.env('fluxoCancelAdminToken'),
        Cypress.env('fluxoCancelAdminProdutoId')
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('_id')
        expect(response.body._id).to.eq(
          Cypress.env('fluxoCancelAdminProdutoId')
        )
      })
    })

    it('POST / CT006 - Adicionar produto ao carrinho', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = Cypress.env(
          'fluxoCancelAdminProdutoId'
        )
        criarCarrinho(Cypress.env('fluxoCancelAdminToken'), carrinho).then(
          (response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq(
              messageCarrinho.adicionaProdutoAoCarrinhoComSucesso
            )
          }
        )
      })
    })

    it('DELETE / CT007 - Cancelar compra e reabastece estoque', () => {
      deletarCancelarCompra(Cypress.env('fluxoCancelAdminToken')).then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq(
            messageCarrinho.produtosReabastecidos
          )
        }
      )
    })
  })

  describe('Administrador False', () => {
    after(() => {
      deletarUsuario(Cypress.env('fluxoCancelFalseId'))
    })

    it('POST / CT001 - Cadastrar novo usuário não administrador', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = `user_false_cancel_${Date.now()}@qa.com.br`
        usuario.administrador = 'false'
        Cypress.env('fluxoCancelFalseEmail', usuario.email)
        Cypress.env('fluxoCancelFalsePassword', usuario.password)
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('_id')
          expect(response.body.message).to.eq(
            messageUsuario.responseUsuarioCadastrado
          )
          Cypress.env('fluxoCancelFalseId', response.body._id)
        })
      })
    })

    it('POST / CT002 - Realizar login e gerar token', () => {
      login(
        Cypress.env('fluxoCancelFalseEmail'),
        Cypress.env('fluxoCancelFalsePassword')
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.not.be.empty
        Cypress.env('fluxoCancelFalseToken', response.body.authorization)
      })
    })

    it('GET / CT003 - Listar produtos disponíveis', () => {
      getProdutos(Cypress.env('fluxoCancelFalseToken')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.quantidade).to.be.greaterThan(0)
      })
    })

    it('GET ID / CT004 - Buscar produto por ID', () => {
      getProdutosPorId(
        Cypress.env('fluxoCancelFalseToken'),
        'BeeJh5lz3k6kSIzA'
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('_id')
        expect(response.body._id).to.eq('BeeJh5lz3k6kSIzA')
      })
    })

    it('POST / CT005 - Adicionar produto ao carrinho', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = 'BeeJh5lz3k6kSIzA'
        criarCarrinho(Cypress.env('fluxoCancelFalseToken'), carrinho).then(
          (response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq(
              messageCarrinho.adicionaProdutoAoCarrinhoComSucesso
            )
          }
        )
      })
    })

    it('DELETE / CT006 - Cancelar compra e reabastece estoque', () => {
      deletarCancelarCompra(Cypress.env('fluxoCancelFalseToken')).then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq(
            messageCarrinho.produtosReabastecidos
          )
        }
      )
    })
  })
})
