const login = (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/login',
    body: {
      email: email,
      password: password,
    },
    failOnStatusCode: false,
  })
}

const loginComEndpointInvalido = (email, password) => {
  return cy.request({
    method: 'POST',
    url: '/logins',
    body: {
      email: email,
      password: password,
    },
    failOnStatusCode: false,
  })
}

module.exports = { login, loginComEndpointInvalido }