import { login, loginComEndpointInvalido } from '../../support/services/auth.service'

describe('Autenticação - Testes Negativos', () => {

  let message

  before(() => {
    cy.fixture('autenticacao/message').then((msg) => {
      message = msg
    })
  })

  it('POST / CT002 - Login com campos em branco', () => {
    login('', '').then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.email).to.eq(message.emailNaoPodeFicarEmBranco)
    })
  })

  it('POST / CT003 - Login com usuário inexistente', () => {
    login('errado@qa.com', 'senhaerrada').then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body.message).to.eq(message.loginInvalido)
    })
  })

  it('POST / CT004 - Login com apenas email (sem senha)', () => {
    login('fulano@qa.com', '').then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.password).to.eq(message.passwordNaoPodeFicarEmBranco)
    })
  })

  it('POST / CT005 - Login com apenas senha (sem email)', () => {
    login('', 'teste').then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.email).to.eq(message.emailNaoPodeFicarEmBranco)
    })
  })

  it('POST / CT006 - Login com usuário não cadastrado', () => {
    login('user@test.com', 'teste').then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body.message).to.eq(message.loginInvalido)
    })
  })

  it('POST / CT007 - Login com email inválido', () => {
    login('invalid-email', 'teste').then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.email).to.eq(message.emailDeveSerValido)
    })
  })

  it('POST / CT008 - Login com email válido e senha inválida', () => {
    login('fulano@qa.com', 'senhaerrada').then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body.message).to.eq(message.loginInvalido)
    })
  })

  it('POST / CT009 - Login com email sem arroba (@)', () => {
    login('fulanoqa.com', 'teste').then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.email).to.eq(message.emailDeveSerValido)
    })
  })

  it('POST / CT010 - Login com endpoint inválido', () => {
    loginComEndpointInvalido('fulano@qa.com', 'teste').then((response) => {
      expect(response.status).to.eq(405)
      expect(response.body.message).to.eq(message.endpointInvalido)
    })
  })

})