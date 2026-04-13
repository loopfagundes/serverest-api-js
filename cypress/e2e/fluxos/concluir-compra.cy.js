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
  deletarCarrinho,
} from '../../support/services/carrinhos.service'

describe('Fluxos de Compra - Testes Funcionais', () => {
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
      deletarUsuario(Cypress.env('fluxoAdminId'))
    })

    it('POST / CT001 - Cadastrar novo usuário administrador', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = `user_true_${Date.now()}@qa.com.br`
        Cypress.env('fluxoAdminEmail', usuario.email)
        Cypress.env('fluxoAdminPassword', usuario.password)
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('_id')
          expect(response.body.message).to.eq(
            messageUsuario.responseUsuarioCadastrado
          )
          Cypress.env('fluxoAdminId', response.body._id)
        })
      })
    })

    it('POST / CT002 - Realizar login e gerar token', () => {
      login(
        Cypress.env('fluxoAdminEmail'),
        Cypress.env('fluxoAdminPassword')
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.not.be.empty
        Cypress.env('fluxoAdminToken', response.body.authorization)
      })
    })

    it('POST / CT003 - Criar novo produto', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = `Produto Fluxo Admin ${Date.now()}`
        criarProduto(Cypress.env('fluxoAdminToken'), produto).then(
          (response) => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('_id')
            expect(response.body.message).to.eq(messageProduto.produtoCriado)
            Cypress.env('fluxoAdminProdutoId', response.body._id)
          }
        )
      })
    })

    it('GET / CT004 - Listar produtos disponíveis', () => {
      getProdutos(Cypress.env('fluxoAdminToken')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.quantidade).to.be.greaterThan(0)
      })
    })

    it('GET ID / CT005 - Buscar produto por ID', () => {
      getProdutosPorId(
        Cypress.env('fluxoAdminToken'),
        Cypress.env('fluxoAdminProdutoId')
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('_id')
        expect(response.body._id).to.eq(Cypress.env('fluxoAdminProdutoId'))
      })
    })

    it('POST / CT006 - Adicionar produto ao carrinho', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = Cypress.env('fluxoAdminProdutoId')
        criarCarrinho(Cypress.env('fluxoAdminToken'), carrinho).then(
          (response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq(
              messageCarrinho.adicionaProdutoAoCarrinhoComSucesso
            )
          }
        )
      })
    })

    it('DELETE / CT007 - Finalizar compra com sucesso', () => {
      deletarCarrinho(Cypress.env('fluxoAdminToken')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(
          messageCarrinho.carrinhoExcluidoComSucesso
        )
        deletarProduto(
          Cypress.env('fluxoAdminToken'),
          Cypress.env('fluxoAdminProdutoId')
        )
      })
    })
  })

  describe('Administrador False', () => {
    after(() => {
      deletarUsuario(Cypress.env('fluxoFalseId'))
    })

    it('POST / CT001 - Cadastrar novo usuário não administrador', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = `user_false_${Date.now()}@qa.com.br`
        usuario.administrador = 'false'
        Cypress.env('fluxoFalseEmail', usuario.email)
        Cypress.env('fluxoFalsePassword', usuario.password)
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('_id')
          expect(response.body.message).to.eq(
            messageUsuario.responseUsuarioCadastrado
          )
          Cypress.env('fluxoFalseId', response.body._id)
        })
      })
    })

    it('POST / CT002 - Realizar login e gerar token', () => {
      login(
        Cypress.env('fluxoFalseEmail'),
        Cypress.env('fluxoFalsePassword')
      ).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.not.be.empty
        Cypress.env('fluxoFalseToken', response.body.authorization)
      })
    })

    it('GET / CT003 - Listar produtos disponíveis', () => {
      getProdutos(Cypress.env('fluxoFalseToken')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.produtos).to.be.an('array')
        expect(response.body.quantidade).to.be.greaterThan(0)
      })
    })

    it('GET ID / CT004 - Buscar produto por ID', () => {
      getProdutosPorId(Cypress.env('fluxoFalseToken'), 'BeeJh5lz3k6kSIzA').then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('_id')
          expect(response.body._id).to.eq('BeeJh5lz3k6kSIzA')
        }
      )
    })

    it('POST / CT005 - Adicionar produto ao carrinho', () => {
      cy.fixture('carrinhos/carrinho').then((carrinho) => {
        carrinho.produtos[0].idProduto = 'BeeJh5lz3k6kSIzA'
        criarCarrinho(Cypress.env('fluxoFalseToken'), carrinho).then(
          (response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq(
              messageCarrinho.adicionaProdutoAoCarrinhoComSucesso
            )
          }
        )
      })
    })

    it('DELETE / CT006 - Finalizar compra com sucesso', () => {
      deletarCarrinho(Cypress.env('fluxoFalseToken')).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(
          messageCarrinho.carrinhoExcluidoComSucesso
        )
      })
    })
  })
})
