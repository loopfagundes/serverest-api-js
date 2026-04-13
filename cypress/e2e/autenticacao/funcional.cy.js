import { login } from '../../support/services/auth.service'

describe('Autenticação - Testes Funcionais', () => {
  let message

  before(() => {
    cy.fixture('autenticacao/message').then((msg) => {
      message = msg
    })
  })

  it('POST / CT001 - Efetuar login com sucesso', () => {
    login('fulano@qa.com', 'teste').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq(message.loginRealizadoComSucesso)
      expect(response.body).to.have.property('authorization')
      expect(response.body.authorization).to.not.be.empty
      Cypress.env('token', response.body.authorization)
    })
  })
})
