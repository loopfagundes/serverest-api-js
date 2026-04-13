import {
  criarUsuario,
  getUsuarios,
  buscarUsuarioPorId,
  editarUsuario,
  deletarUsuario,
} from '../../support/services/usuarios.service'

describe('Usuários - Testes Funcionais', () => {
  let message

  before(() => {
    cy.fixture('usuarios/message').then((msg) => {
      message = msg
    })
  })

  it('GET / CT001 - Buscar todos os usuários cadastrados', () => {
    getUsuarios().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.usuarios).to.be.an('array')
      expect(response.body.quantidade).to.be.greaterThan(0)
    })
  })

  it('POST / CT001 - Cadastrar novo usuário e gerar um ID', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.email = `qa_novo_${Date.now()}@qa.com.br`
      criarUsuario(usuario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.message).to.eq(message.responseUsuarioCadastrado)
        Cypress.env('usuarioId', response.body._id)
      })
    })
  })

  it('POST / CT002 - Cadastrar novo usuário com admin false', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.email = `qa_novo_false_${Date.now()}@qa.com.br`
      usuario.administrador = 'false'
      criarUsuario(usuario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.message).to.eq(message.responseUsuarioCadastrado)
        Cypress.env('usuarioNaoAdminId', response.body._id)
      })
    })
  })

  it('GET ID / CT001 - Buscar um usuário por ID cadastrado', () => {
    buscarUsuarioPorId(Cypress.env('usuarioId')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('_id', Cypress.env('usuarioId'))
    })
  })

  it('PUT / CT001 - Edição de um usuário por ID', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.nome = 'Usuario Editado QA'
      editarUsuario(Cypress.env('usuarioId'), usuario).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.responseUsuarioEditado)
      })
    })
  })

  it('DELETE / CT001 - Deletar um usuário administrador por ID', () => {
    deletarUsuario(Cypress.env('usuarioId')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq(message.exclusaoUsuario)
    })
  })

  it('DELETE / CT002 - Deletar um usuário não administrador por ID', () => {
    deletarUsuario(Cypress.env('usuarioNaoAdminId')).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq(message.exclusaoUsuario)
    })
  })
})
