import { criarUsuario, getUsuarios, buscarUsuarioPorId, editarUsuario, deletarUsuario } from '../../support/services/usuarios.service'

describe('Usuários - Testes Funcionais', () => {

  let usuarioId

  it('deve listar todos os usuários', () => {
    getUsuarios().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.usuarios).to.be.an('array')
      expect(response.body.quantidade).to.be.greaterThan(0)
    })
  })

  it('deve criar um usuário com sucesso', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.email = `qa_novo_${Date.now()}@qa.com.br`
      criarUsuario(usuario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('_id')
        usuarioId = response.body._id
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      })
    })
  })

  it('deve buscar um usuário por ID', () => {
    buscarUsuarioPorId(usuarioId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('_id', usuarioId)
    })
  })

  it('deve editar um usuário com sucesso', () => {
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.nome = 'Usuario Editado QA'
      usuario.email = `qa_edit_${Date.now()}@qa.com.br`
      editarUsuario(usuarioId, usuario).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro alterado com sucesso')
      })
    })
  })

  it('deve deletar um usuário com sucesso', () => {
    deletarUsuario(usuarioId).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Registro excluído com sucesso')
    })
  })
})