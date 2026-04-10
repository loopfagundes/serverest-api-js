import { criarUsuario } from "../../support/services/usuarios.service"
import { login } from "../../support/services/auth.service"
import { criarProduto, getProdutos, getProdutosPorId } from "../../support/services/produtos.service"
import { criarCarrinho, deletarCarrinho } from "../../support/services/carrinhos.service"

describe('Fluxo de comprar com Administrador True - Testes Funcionais', () => {

    it('POST / CT001 - Cadastrar novo usuário com admin ture', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            usuario.email = `user_true${Date.now()}@qa.com.br`
            Cypress.env('usuarioEmail', usuario.email)
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body).to.have.property('_id')
                    expect(response.body.message).to.eq(message.responseUsuarioCadastrado)
                })
            })
        })
    })

    it('POST / CT002 - Realizar o login e gerar uma token', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            login(Cypress.env('usuarioEmail'), usuario.password).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('authorization')
                expect(response.body.authorization).to.not.be.empty
                Cypress.env('authToken', response.body.authorization)
            })
        })
    })

    it('POST / CT003 - Criar um novo produto', () => {
        cy.fixture('produtos/produto').then((produto) => {
            produto.nome = `Produto QA ${Date.now()}`
            cy.fixture('produtos/message').then((message) => {
                criarProduto(Cypress.env('authToken'), produto).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body).to.have.property('_id')
                    expect(response.body.message).to.eq(message.produtoCriado)
                    Cypress.env('produtoId', response.body._id)
                })
            })
        })
    })

    it('GET / CT004 - Listar produtos disponiveis', () => {
        getProdutos(Cypress.env('authToken')).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.produtos).to.be.an('array')
            expect(response.body.quantidade).to.be.greaterThan(0)
        })
    })

    it('GET ID / CT005 - Buscar produto por ID', () => {
        getProdutosPorId(Cypress.env('authToken'), Cypress.env('produtoId')).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('_id')
            expect(response.body._id).to.eq(Cypress.env('produtoId'))
        })
    })

    it('POST / CT006 - Adicionar produto ao carrinho', () => {
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = Cypress.env('produtoId')
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('authToken'), carrinho).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.message).to.eq(message.adicionaProdutoAoCarrinhoComSucesso)
                })
            })
        })
    })

    it('DELETE / CT007 - Finalizar compra com sucesso', () => {
        cy.fixture('carrinhos/message').then((message) => {
            deletarCarrinho(Cypress.env('authToken')).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq(message.carrinhoExcluidoComSucesso)
            })
        })
    })
})

describe('Fluxo de comprar com Administrador False - Testes Funcionais', () => {

    it('POST / CT001 - Cadastrar novo usuário com admin false', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            usuario.email = `user_false${Date.now()}@qa.com.br`
            usuario.administrador = 'false'
            Cypress.env('usuarioEmail', usuario.email)
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body).to.have.property('_id')
                    expect(response.body.message).to.eq(message.responseUsuarioCadastrado)
                })
            })
        })
    })

    it('POST / CT002 - Realizar o login e gerar uma token', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            login(Cypress.env('usuarioEmail'), usuario.password).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('authorization')
                expect(response.body.authorization).to.not.be.empty
                Cypress.env('authToken', response.body.authorization)
            })
        })
    })

    it('GET / CT003 - Listar produtos disponiveis', () => {
        getProdutos(Cypress.env('authToken')).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.produtos).to.be.an('array')
            expect(response.body.quantidade).to.be.greaterThan(0)
        })
    })

    it('GET ID / CT004 - Buscar produto por ID', () => {
        Cypress.env('produtoId', 'BeeJh5lz3k6kSIzA')
        getProdutosPorId(Cypress.env('authToken'), Cypress.env('produtoId')).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('_id')
            expect(response.body._id).to.eq(Cypress.env('produtoId'))
        })
    })

    it('POST / CT005 - Adicionar produto ao carrinho', () => {
        cy.fixture('carrinhos/carrinho').then((carrinho) => {
            carrinho.produtos[0].idProduto = Cypress.env('produtoId')
            cy.fixture('carrinhos/message').then((message) => {
                criarCarrinho(Cypress.env('authToken'), carrinho).then((response) => {
                    expect(response.status).to.eq(201)
                    expect(response.body.message).to.eq(message.adicionaProdutoAoCarrinhoComSucesso)
                })
            })
        })
    })

    it('DELETE / CT006 - Finalizar compra com sucesso', () => {
        cy.fixture('carrinhos/message').then((message) => {
            deletarCarrinho(Cypress.env('authToken')).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq(message.carrinhoExcluidoComSucesso)
            })
        })
    })
})