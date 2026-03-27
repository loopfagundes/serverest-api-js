describe('Teste de API - GET', () => {

  it('deve retornar uma lista de posts', () => {
    cy.request({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts',
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body).to.be.an('array')

      expect(response.body).to.have.length(100)
    })
  })
})