import {
  getUsuarios,
  criarUsuario,
  deletarUsuario,
} from '../../support/services/usuarios.service'

describe('Usuários - Testes de Performance', () => {
  let usuarioId

  it('GET /usuarios deve responder em menos de 2000ms', () => {
    getUsuarios().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(2000)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
    })
  })

  it('POST /usuarios deve responder em menos de 2000ms', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.email = `qa_perf_${Date.now()}@qa.com.br`
      criarUsuario(usuario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('_id')
        usuarioId = response.body._id
        expect(response.duration).to.be.lessThan(2000)
        cy.log(`Tempo de resposta: ${response.duration}ms`)
      })
    })
  })

  it('DELETE /usuarios/{id} deve responder em menos de 2000ms', () => {
    deletarUsuario(usuarioId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.duration).to.be.lessThan(2000)
      cy.log(`Tempo de resposta: ${response.duration}ms`)
    })
  })
})