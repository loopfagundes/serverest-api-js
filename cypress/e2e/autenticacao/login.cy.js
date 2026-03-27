import { login } from '../../support/services/auth.service'

describe('Autenticação - Login', () => {

  it('CT001 - Efetuar login com sucesso', () => {
    login('fulano@qa.com', 'teste')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.not.be.empty

        Cypress.env('token', response.body.authorization)
        cy.log('Token salvo: ' + Cypress.env('token'))
      })
  })
})