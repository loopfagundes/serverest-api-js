import { criarUsuario, getUsuarios, buscarUsuarioPorId, editarUsuario, deletarUsuario } from '../../support/services/usuarios.service'

describe('Usuários - Testes Funcionais', () => {

  let usuarioId

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
      cy.fixture('usuarios/message').then((message) => {
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body).to.have.property('_id')
          usuarioId = response.body._id
          expect(response.body.message).to.eq(message.responseUsuarioCadastrado)
        })
      })
    })
  })

  it('POST / CT002 - Cadastrar novo usuário com admin false', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.email = `qa_novo_false${Date.now()}@qa.com.br`
      usuario.administrador = 'false'
      cy.fixture('usuarios/message').then((message) => {
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(201)
          expect(response.body.message).to.eq(message.responseUsuarioCadastrado)
        })
      })
    })
  })

  it('GET ID / CT001 - Buscar um usuário por ID cadastrado ', () => {
    buscarUsuarioPorId(usuarioId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('_id', usuarioId)
    })
  })

  it('PUT / CT001 - Edição de um usuário por ID', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.nome = 'Usuario Editado QA'
      usuario.email = `qa_edit_${Date.now()}@qa.com.br`
      cy.fixture('usuarios/message').then((message) => {
        editarUsuario(usuarioId, usuario).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq(message.responseUsuarioEditado)
        })
      })
    })
  })


  it('DELETE / CT001 - Deletar um usuário por ID', () => {
    cy.fixture('usuarios/message').then((message) => {
      deletarUsuario(usuarioId).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.exclusaoUsuario)
      })
    })
  })

})