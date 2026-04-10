import { deletarUsuario } from '../../support/services/usuarios.service'
import { getCarrinhoInvalido, getCarrinhoPorId, criarCarrinho, deletarCarrinho, deletarCancelarCompra } from '../../support/services/carrinhos.service'

describe('Carrinhos com Administrador True - Testes Negativos', () => {

    before(() => {
        cy.loginAdmin()
    })

    after(() => {
        deletarUsuario(Cypress.env('usuarioAdminId'))
    })

    it('GET / CT002 - Endpoint de carrinhos incorreto', () => {
        cy.fixture('carrinhos/message').then((message) => {
            getCarrinhoInvalido(Cypress.env('tokenAdmin')).then((response) => {
                expect(response.status).to.eq(405)
                expect(response.body.message).to.eq(message.enpointInvalido)
            })
        })
    })

    it('GET ID / CT002 - Buscar carrinho por ID inexistente', () => {
        const carrinhoIdInvalido = '7rfEqNeXierOfsSH'
        cy.fixture('carrinhos/message').then((message) => {
            getCarrinhoPorId(Cypress.env('tokenAdmin'), carrinhoIdInvalido).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq(message.carrinhoNaoEncontrado)
            })
        })
    })

    it('POST / CT004 - Deixar os campos em branco', () => {
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = ''
            carrinho.produtos[0].quantidade = ''
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body['produtos[0].idProduto']).to.eq(message.camposObrigatorios.produtoId)
                    expect(response.body['produtos[0].quantidade']).to.eq(message.camposObrigatorios.quantidade)
                    expect(response.body.produtos).to.eq(message.camposObrigatorios.produtos)
                })
            })
        })
    })

    it('POST / CT008 - Preencher o campo idProduto com um ID de produto inexistente', () => {
        const produtoIdInvalido = 'B5vT8nM1pQ6yS3rD'
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = produtoIdInvalido
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq(message.produtoNaoEncontrado)
                })
            })
        })
    })

    it('POST / CT014 - Preencher o campo quantidade como texto não numérico', () => {
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].quantidade = 'dez'
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body['produtos[0].quantidade']).to.eq(message.camposObrigatorios.quantidade)
                })
            })
        })
    })

    it('POST / CT016 - Preencher o campo quantidade com valor zero', () => {
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].quantidade = 0
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body['produtos[0].quantidade']).to.eq(message.quantidadePositiva)
                })
            })
        })
    })

    it('POST / CT017 - Preencher o campo quantidade com valor maior que o estoque disponível', () => {
        const quantidadeExcessiva = 1000
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].quantidade = quantidadeExcessiva
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('tokenAdmin'), carrinho).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body['produtos[0].quantidade']).to.eq(message.quantidadeDisponivel)
                })
            })
        })
    })

    it('DELETE / CT002 - Excluir um carrinho inexistente', () => {
        const carrinhoIdInvalido = '7rfEqNeXierOfsSH'
        cy.fixture('carrinhos/message').then((message) => {
            deletarCarrinho(Cypress.env('tokenAdmin'), carrinhoIdInvalido).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq(message.naoFoiEncontradoCarrinho)
            })
        })
    })

    it('DELETE / CT002 - Excluir um carrinho inexistente - cancelar compra', () => {
        const carrinhoIdInvalido = '7rfEqNeXierOfsSH'
        cy.fixture('carrinhos/message').then((message) => {
            deletarCancelarCompra(Cypress.env('tokenAdmin'), carrinhoIdInvalido).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq(message.naoFoiEncontradoCarrinho)
            })
        })
    })

})

describe('Carrinhos - Testes Negativos', () => {

    it('POST / CT002 - Adicionar o ID do produto ao carrinho e sem token', () => {
        const produtoId = 'K6leHdftCeOJj8BJ'
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = produtoId
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho('', carrinho).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body.message).to.eq(message.tokenInvalido)
                })
            })
        })
    })

    it('DELETE / CT007 - Tentativa de concluir a compra sem realizar o login do usuário', () => {
        cy.fixture('carrinhos/message').then((message) => {
            deletarCarrinho('').then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body.message).to.eq(message.tokenInvalido)
            })
        })
    })

})