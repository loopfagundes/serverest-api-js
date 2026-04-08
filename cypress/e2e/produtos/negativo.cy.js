import { criarProduto, getProdutosInvalido, getProdutosPorId, editarProduto, deletarProduto } from '../../support/services/produtos.service'
import { deletarUsuario } from '../../support/services/usuarios.service'

describe('[GET] Listar Produtos - Testes Negativos', () => {

    it('GET / CT002 - Endpoint incorreto', () => {
        cy.fixture('produtos/message').then((message) => {
            getProdutosInvalido(Cypress.env('token')).then((response) => {
                expect(response.status).to.eq(405)
                expect(response.body.message).to.contain(message.enpointProdutoInvalido)
            })
        })
    })

    it('GET ID / CT002 - Buscar produto por ID inexistente', () => {
        const idInexistente = '7rfEqNeXierOfsSH'
        cy.fixture('produtos/message').then((message) => {
            getProdutosPorId(Cypress.env('token'), idInexistente).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq(message.produtoNaoEncontrado)
            })
        })
    })

})

describe('Produtos com Administrador True - Testes Negativos', () => {

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
            cy.fixture('produtos/message').then((message) => {
                criarProduto('', produto).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body.message).to.eq(message.tokenInvalido)
                })
            })
        })
    })

    it('POST / CT003 - Produto com nome já existente', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.nome = 'Logitech MX Vertical'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq(message.jaExisteProduto)
                })
            })
        })
    })

    it('POST / CT005 - Cadastrar com todos os campos em branco', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.nome = ''
            produto.preco = ''
            produto.descricao = ''
            produto.quantidade = ''
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
                    expect(response.body.preco).to.eq(message.camposObrigatorios.preco)
                    expect(response.body.descricao).to.eq(message.camposObrigatorios.descricao)
                    expect(response.body.quantidade).to.eq(message.camposObrigatorios.quantidade)
                })
            })
        })
    })

    it('POST / CT010 - Preço negativo', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.preco = '-10'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.preco).to.eq(message.precoPositivo)
                })
            })
        })
    })

    it('POST / CT011 - Quantidade negativa', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.quantidade = '-5'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.quantidade).to.eq(message.quantidadePositiva)
                })
            })
        })
    })

    it('POST / CT018 - Preço inválido', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.preco = 'abc'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.preco).to.eq(message.precoInvalido)
                })
            })
        })
    })

    it('POST / CT023 - Preço com valor muito alto', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.preco = '10000000000000000000'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.preco).to.eq(message.precoNaoPodeSerMaior)
                })
            })
        })
    })

    it('POST / CT028 - Quantidade com valor inválido', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.quantidade = 'abc'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.quantidade).to.eq(message.quantidadeInvalida)
                })
            })
        })
    })

    it('POST / CT034 - Quantidade com valor muito alto', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.quantidade = '10000000000000000000'
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.quantidade).to.eq(message.quantidadeNaoPodeSerMaior)
                })
            })
        })
    })

    it('PUT / CT002 - Editar produto sem token', () => {
        const produtoId = '9sobdBIhGCPOAUVh'
        cy.fixture('produtos/produto').then((produto) => {
            produto.nome = 'Produto Editado Sem Token'
            cy.fixture('produtos/message').then((message) => {
                editarProduto('', produtoId, produto).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body.message).to.eq(message.tokenInvalido)
                })
            })
        })
    })

    it('PUT / CT005 - Campos obrigatórios em branco', () => {
        const produtoId = '9sobdBIhGCPOAUVh'
        cy.fixture('produtos/produto').then((produto) => {
            produto.nome = ''
            produto.preco = ''
            produto.descricao = ''
            produto.quantidade = ''
            cy.fixture('produtos/message').then((message) => {
                editarProduto(Cypress.env('tokenAdmin'), produtoId, produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
                    expect(response.body.preco).to.eq(message.camposObrigatorios.preco)
                    expect(response.body.descricao).to.eq(message.camposObrigatorios.descricao)
                    expect(response.body.quantidade).to.eq(message.camposObrigatorios.quantidade)
                })
            })
        })
    })

    it('PUT / CT022 - Preço null', () => {
        const produtoId = '9sobdBIhGCPOAUVh'
        cy.fixture('produtos/produto').then((produto) => {
            produto.preco = null
            cy.fixture('produtos/message').then((message) => {
                editarProduto(Cypress.env('tokenAdmin'), produtoId, produto).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.preco).to.eq(message.precoInvalido)
                })
            })
        })
    })

    it('DELETE / CT002 - Excluir produto por ID inexistente', () => {
        const idInexistente = '7rfEqNeXierOfsSH'
        cy.fixture('produtos/message').then((message) => {
            deletarProduto(Cypress.env('tokenAdmin'), idInexistente).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq(message.nenhumRegistroExcluido)
            })
        })
    })

})

describe('Produtos com Administrador False - Testes Negativos', () => {

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
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('tokenNaoAdmin'), produto).then((response) => {
                    expect(response.status).to.eq(403)
                    expect(response.body.message).to.eq(message.acessoNegado)
                    expect(response.body).to.not.have.property('_id')
                })
            })
        })
    })

    it('PUT / CT004 - Rota exclusiva para administrador', () => {
        const produtoId = '9sobdBIhGCPOAUVh'
        cy.fixture('produtos/produto').then((produto) => {
            produto.nome = 'Produto Editado Nao Admin'
            cy.fixture('produtos/message').then((message) => {
                editarProduto(Cypress.env('tokenNaoAdmin'), produtoId, produto).then((response) => {
                    expect(response.status).to.eq(403)
                    expect(response.body.message).to.eq(message.acessoNegado)
                })
            })
        })
    })

})