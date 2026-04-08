import { login } from './services/auth.service'
import { criarUsuario } from './services/usuarios.service'

Cypress.Commands.add('login', (email, password) => {
  login(email, password).then((response) => {
    Cypress.env('token', response.body.authorization)
  })
})

Cypress.Commands.add('loginAdmin', () => {
  let usuarioEmail
  let usuarioPassword
  let usuarioId

  cy.fixture('usuarios/usuario').then((usuario) => {
    usuarioEmail = `admin_${Date.now()}@qa.com.br`
    usuarioPassword = usuario.password

    criarUsuario({
      nome: usuario.nome,
      email: usuarioEmail,
      password: usuarioPassword,
      administrador: 'true',
    }).then((response) => {
      expect(response.status).to.eq(201)
      usuarioId = response.body._id
      Cypress.env('usuarioAdminId', usuarioId)

      login(usuarioEmail, usuarioPassword).then((loginResponse) => {
        Cypress.env('tokenAdmin', loginResponse.body.authorization)
      })
    })
  })
})

Cypress.Commands.add('loginAdminFalse', () => {
  let usuarioEmail
  let usuarioPassword
  let usuarioId

  cy.fixture('usuarios/usuario').then((usuario) => {
    usuarioEmail = `naoadmin_${Date.now()}@qa.com.br`
    usuarioPassword = usuario.password

    criarUsuario({
      nome: usuario.nome,
      email: usuarioEmail,
      password: usuarioPassword,
      administrador: 'false',
    }).then((response) => {
      expect(response.status).to.eq(201)
      usuarioId = response.body._id
      Cypress.env('usuarioNaoAdminId', usuarioId)

      login(usuarioEmail, usuarioPassword).then((loginResponse) => {
        Cypress.env('tokenNaoAdmin', loginResponse.body.authorization)
      })
    })
  })
})