import { criarUsuario, getUsuariosIncorreto, getUsuariosInvalido, buscarUsuarioPorId, editarUsuario, deletarUsuario } from '../../support/services/usuarios.service'

let usuarioId

before(() => {
    cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = `qa_${Date.now()}@qa.com.br`
        criarUsuario(usuario).then((response) => {
            usuarioId = response.body._id
        })
    })
})

after(() => {
    deletarUsuario(usuarioId).then((response) => {
        expect(response.status).to.eq(200)
    })
})

describe('[GET] Listar todos os usuários - Testes Negativos', () => {

    it('GET / CT002 - Endpoint incorreto', () => {
        cy.fixture('usuarios/message').then((message) => {
            getUsuariosIncorreto().then((response) => {
                expect(response.status).to.eq(405)
                expect(response.body.message).to.eq(message.getUsuariosEndpointIncorreto)
            })
        })
    })

    it('GET / CT003 - Endpoint inválido', () => {
        cy.fixture('usuarios/message').then((message) => {
            getUsuariosInvalido().then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
            })
        })
    })

})

describe('[GET ID] Buscar Usuário por ID - Testes Negativos', () => {

    it('GET ID / CT002 - Buscar um usuário por ID não cadastrado', () => {
        const idInexistente = '0uxuPY0cbmQhpEww'
        cy.fixture('usuarios/message').then((message) => {
            buscarUsuarioPorId(idInexistente).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq(message.usuarioNaoEncontrado)
            })
        })
    })

    it('GET ID / CT003 - ID com 16 caracteres inválidos', () => {
        const idInvalido = '0uxuPY0cbmQhpEw!'
        cy.fixture('usuarios/message').then((message) => {
            buscarUsuarioPorId(idInvalido).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
            })
        })
    })

    it('GET ID / CT004 - ID com menos de 16 caracteres e inválidos', () => {
        const idCurto = '@@#!12345'
        cy.fixture('usuarios/message').then((message) => {
            buscarUsuarioPorId(idCurto).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
            })
        })
    })

    it('GET ID / CT005 -  ID com menos de 16 caracteres (alfanumérico)', () => {
        const idCurtoAlfanumerico = 'abc123'
        cy.fixture('usuarios/message').then((id) => {
            buscarUsuarioPorId(idCurtoAlfanumerico).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.id).to.eq(id.getUsuarioEndpointInvalido)
            })
        })

    })

    it('GET ID / CT006 - ID com mais de 16 caracteres', () => {
        const idLongo = '0uxuPY0cbmQhpEww123456789'
        cy.fixture('usuarios/message').then((id) => {
            buscarUsuarioPorId(idLongo).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.id).to.eq(id.getUsuarioEndpointInvalido)
            })
        })
    })

    it('GET ID / CT007 - ID com apenas letras (16 caracteres)', () => {
        const idLetras = 'abcdefghijklmnop'
        cy.fixture('usuarios/message').then((message) => {
            buscarUsuarioPorId(idLetras).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq(message.usuarioNaoEncontrado)
            })
        })
    })

    it('GET ID / CT008 - ID com apenas números (16 caracteres)', () => {
        const idNumeros = '1234567890123456'
        cy.fixture('usuarios/message').then((message) => {
            buscarUsuarioPorId(idNumeros).then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body.message).to.eq(message.usuarioNaoEncontrado)
            })
        })
    })

})

describe('[POST] Cadastrar Usuário - Testes Negativos', () => {

    it('POST / CT003 - Cadastrar usuário com email já existente', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            usuario.email = `fulano@qa.com`
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq(message.esteEmailJaEstaSendoUsado)
                })
            })
        })
    })

    it('POST / CT004 - Deixar cadastrar com campos em branco', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            usuario.nome = ''
            usuario.email = ''
            usuario.password = ''
            usuario.administrador = ''
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
                    expect(response.body.email).to.eq(message.camposObrigatorios.email)
                    expect(response.body.password).to.eq(message.camposObrigatorios.password)
                    expect(response.body.administrador).to.eq(message.camposObrigatorios.administrador)
                })
            })
        })
    })

    it('POST / CT017 - Preencher o campo email inválido e os demais campos com valores válidos', () => {
        cy.fixture("usuarios/usuario").then((usuario) => {
            usuario.email = "teste@@qa.com"
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.email).to.eq(message.emailInvalido)
                })
            })
        })
    })

    it('POST / CT031 - Preencher o campo administrador com valor diferente de true ou false', () => {
        cy.fixture("usuarios/usuario").then((usuario) => {
            usuario.administrador = "maybe"
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.administrador).to.eq(message.camposObrigatorios.administrador)
                })
            })
        })
    })

    it('POST / CT032 - Preencher o campo administrador com valor em português diferente de true ou false', () => {
        cy.fixture("usuarios/usuario").then((usuario) => {
            usuario.administrador = "verdadeiro"
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.administrador).to.eq(message.camposObrigatorios.administrador)
                })
            })
        })
    })

    it('POST / CT033 - Preencher o campo administrador com valor contendo espaços', () => {
        cy.fixture("usuarios/usuario").then((usuario) => {
            usuario.administrador = " true "
            cy.fixture('usuarios/message').then((message) => {
                criarUsuario(usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.administrador).to.eq(message.camposObrigatorios.administrador)
                })
            })
        })
    })

})

describe("[PUT] Edição do Usuário com ID - Testes Negativos", () => {

    it('PUT / CT003 - Tentar alterar e-mail para um já existente', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            usuario.email = 'fulano@qa.com'
            cy.fixture('usuarios/message').then((message) => {
                editarUsuario(usuarioId, usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq(message.esteEmailJaEstaSendoUsado)
                })
            })
        })
    })

    it('PUT / CT004 - Deixar editar com campos em branco', () => {
        cy.fixture('usuarios/usuario').then((usuario) => {
            usuario.nome = ''
            usuario.email = ''
            usuario.password = ''
            usuario.administrador = ''
            cy.fixture('usuarios/message').then((message) => {
                editarUsuario(usuarioId, usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
                    expect(response.body.email).to.eq(message.camposObrigatorios.email)
                    expect(response.body.password).to.eq(message.camposObrigatorios.password)
                    expect(response.body.administrador).to.eq(message.camposObrigatorios.administrador)
                })
            })
        })
    })

    it('PUT / CT017 - Preencher o campo email inválido e os demais campos com valores válidos', () => {
        cy.fixture("usuarios/usuario").then((usuario) => {
            usuario.email = "teste@@qa.com"
            cy.fixture('usuarios/message').then((message) => {
                editarUsuario(usuarioId, usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.email).to.eq(message.emailInvalido)
                })
            })
        })
    })

    it('PUT / CT028 - Campo de senha em branco', () => {
        cy.fixture("usuarios/usuario").then((usuario) => {
            usuario.password = ""
            cy.fixture('usuarios/message').then((message) => {
                editarUsuario(usuarioId, usuario).then((response) => {
                    expect(response.status).to.eq(400)
                    expect(response.body.password).to.eq(message.camposObrigatorios.password)
                })
            })
        })
    })

})

describe('[DELETE] Deletar Usuário por ID - Testes Negativos', () => {

    it('DELETE / CT002 - Deletar um usuário por ID não cadastrado', () => {
        const idInexistente = '0uxuPY0cbmQhpEww'
        cy.fixture('usuarios/message').then((message) => {
            deletarUsuario(idInexistente).then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq(message.nenhumRegistroExcluido)
            })
        })
    })

})