import { login } from './services/auth.service'

Cypress.Commands.add('login', (email, password) => {
  login(email, password).then((response) => {
    Cypress.env('token', response.body.authorization)
  })
})