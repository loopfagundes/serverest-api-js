import { criarUsuario, getUsuariosIncorreto, getUsuariosInvalido, getUsuarios, buscarUsuarioPorId, editarUsuario, deletarUsuario } from '../../support/services/usuarios.service'

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