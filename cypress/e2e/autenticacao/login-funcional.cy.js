import { login, loginComEndpointInvalido } from '../../support/services/auth.service'

describe('Login - Teste Funcional', () => {

    it('CT002 - Login com campos em branco', () => {
        login('', '')
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('email', 'email não pode ficar em branco')
            })
    })

    it('CT003 - Login com usuário inexistente', () => {
        login('errado@qa.com', 'senhaerrada')
            .then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message')
            })
    })

    it('CT004 - Login com apenas email (sem senha)', () => {
        login('fulano@qa.com', '')
            .then((response) => {
                cy.log(JSON.stringify(response.body))
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('password', 'password não pode ficar em branco')
            })
    })

    it('CT005 - Login com apenas senha (sem email)', () => {
        login('', 'teste')
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('email', 'email não pode ficar em branco')
            })
    })

    it('CT006 - Login com usuário não cadastrado', () => {
        login('user@test.com', 'teste')
            .then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
            })
    })

    it('CT007 - Login com email inválido', () => {
        login('invalid-email', 'teste')
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('email', 'email deve ser um email válido')
            })
    })

    it('CT008 - Login com email válido e senha inválida', () => {
        login('fulano@qa.com', 'senhaerrada')
            .then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
            })
    })

    it('CT009 - Login com email sem arroba (@)', () => {
        login('fulanoqa.com', 'teste')
            .then((response) => {
                expect(response.status).to.eq(400)
                expect(response.body).to.have.property('email', 'email deve ser um email válido')
            })
    })

    it('CT010 - Login com endpoint inválido', () => {
        loginComEndpointInvalido('fulano@qa.com', 'teste')
            .then((response) => {
                expect(response.status).to.eq(405)
                expect(response.body).to.have.property('message')
            })
    })

})