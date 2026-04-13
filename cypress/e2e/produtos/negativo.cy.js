import {
  criarProduto,
  getProdutosInvalido,
  getProdutosPorId,
  editarProduto,
  deletarProduto,
} from '../../support/services/produtos.service'
import { deletarUsuario } from '../../support/services/usuarios.service'

const PRODUTO_ID_FIXO = '9sobdBIhGCPOAUVh'
const PRODUTO_ID_INEXISTENTE = '7rfEqNeXierOfsSH'

describe('Produtos - Testes Negativos', () => {
  let message

  before(() => {
    cy.fixture('produtos/message').then((msg) => {
      message = msg
    })
  })

  describe('[GET] Listar Produtos', () => {
    it('GET / CT002 - Endpoint incorreto', () => {
      getProdutosInvalido(Cypress.env('token')).then((response) => {
        expect(response.status).to.eq(405)
        expect(response.body.message).to.contain(message.enpointProdutoInvalido)
      })
    })

    it('GET ID / CT002 - ID inexistente', () => {
      getProdutosPorId(Cypress.env('token'), PRODUTO_ID_INEXISTENTE).then(
        (response) => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq(message.produtoNaoEncontrado)
        }
      )
    })
  })

  describe('Administrador True', () => {
    before(() => {
      cy.loginAdmin()
    })

    after(() => {
      cy.login('fulano@qa.com', 'teste')
      deletarUsuario(Cypress.env('usuarioAdminId')).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('POST / CT002 - Criar produto sem token', () => {
      cy.fixture('produtos/produto').then((produto) => {
        criarProduto('', produto).then((response) => {
          expect(response.status).to.eq(401)
          expect(response.body.message).to.eq(message.tokenInvalido)
        })
      })
    })

    it('POST / CT003 - Nome já existente', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = 'Logitech MX Vertical'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq(message.jaExisteProduto)
        })
      })
    })

    it('POST / CT005 - Campos em branco', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = ''
        produto.preco = ''
        produto.descricao = ''
        produto.quantidade = ''
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
          expect(response.body.preco).to.eq(message.camposObrigatorios.preco)
          expect(response.body.descricao).to.eq(
            message.camposObrigatorios.descricao
          )
          expect(response.body.quantidade).to.eq(
            message.camposObrigatorios.quantidade
          )
        })
      })
    })

    it('POST / CT010 - Preço negativo', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.preco = '-10'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.preco).to.eq(message.precoPositivo)
        })
      })
    })

    it('POST / CT011 - Quantidade negativa', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.quantidade = '-5'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.quantidade).to.eq(message.quantidadePositiva)
        })
      })
    })

    it('POST / CT018 - Preço inválido', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.preco = 'abc'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.preco).to.eq(message.precoInvalido)
        })
      })
    })

    it('POST / CT023 - Preço muito alto', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.preco = '10000000000000000000'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.preco).to.eq(message.precoNaoPodeSerMaior)
        })
      })
    })

    it('POST / CT028 - Quantidade inválida', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.quantidade = 'abc'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.quantidade).to.eq(message.quantidadeInvalida)
        })
      })
    })

    it('POST / CT034 - Quantidade muito alta', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.quantidade = '10000000000000000000'
        criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.quantidade).to.eq(
            message.quantidadeNaoPodeSerMaior
          )
        })
      })
    })

    it('PUT / CT002 - Editar produto sem token', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = 'Produto Editado Sem Token'
        editarProduto('', PRODUTO_ID_FIXO, produto).then((response) => {
          expect(response.status).to.eq(401)
          expect(response.body.message).to.eq(message.tokenInvalido)
        })
      })
    })

    it('PUT / CT005 - Campos obrigatórios em branco', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = ''
        produto.preco = ''
        produto.descricao = ''
        produto.quantidade = ''
        editarProduto(Cypress.env('tokenAdmin'), PRODUTO_ID_FIXO, produto).then(
          (response) => {
            expect(response.status).to.eq(400)
            expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
            expect(response.body.preco).to.eq(message.camposObrigatorios.preco)
            expect(response.body.descricao).to.eq(
              message.camposObrigatorios.descricao
            )
            expect(response.body.quantidade).to.eq(
              message.camposObrigatorios.quantidade
            )
          }
        )
      })
    })

    it('PUT / CT022 - Preço null', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.preco = null
        editarProduto(Cypress.env('tokenAdmin'), PRODUTO_ID_FIXO, produto).then(
          (response) => {
            expect(response.status).to.eq(400)
            expect(response.body.preco).to.eq(message.precoInvalido)
          }
        )
      })
    })

    it('DELETE / CT002 - ID inexistente', () => {
      deletarProduto(Cypress.env('tokenAdmin'), PRODUTO_ID_INEXISTENTE).then(
        (response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq(message.nenhumRegistroExcluido)
        }
      )
    })
  })

  describe('Administrador False', () => {
    before(() => {
      cy.loginAdminFalse()
    })

    after(() => {
      cy.login('fulano@qa.com', 'teste')
      deletarUsuario(Cypress.env('usuarioNaoAdminId')).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('POST / CT004 - Rota exclusiva para administrador', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = `Produto NaoAdmin ${Date.now()}`
        criarProduto(Cypress.env('tokenNaoAdmin'), produto).then((response) => {
          expect(response.status).to.eq(403)
          expect(response.body.message).to.eq(message.acessoNegado)
          expect(response.body).to.not.have.property('_id')
        })
      })
    })

    it('PUT / CT004 - Rota exclusiva para administrador', () => {
      cy.fixture('produtos/produto').then((produto) => {
        produto.nome = 'Produto Editado Nao Admin'
        editarProduto(
          Cypress.env('tokenNaoAdmin'),
          PRODUTO_ID_FIXO,
          produto
        ).then((response) => {
          expect(response.status).to.eq(403)
          expect(response.body.message).to.eq(message.acessoNegado)
        })
      })
    })
  })
})
