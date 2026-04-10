import {
  criarUsuario,
  getUsuariosIncorreto,
  getUsuariosInvalido,
  buscarUsuarioPorId,
  editarUsuario,
  deletarUsuario,
} from '../../support/services/usuarios.service'

describe('Usuários - Testes Negativos', () => {
  let message

  before(() => {
    cy.fixture('usuarios/message').then((msg) => {
      message = msg
    })
    cy.fixture('usuarios/usuario').then((usuario) => {
      usuario.email = `qa_${Date.now()}@qa.com.br`
      criarUsuario(usuario).then((response) => {
        expect(response.status).to.eq(201)
        Cypress.env('usuarioNegativoId', response.body._id)
      })
    })
  })

  after(() => {
    deletarUsuario(Cypress.env('usuarioNegativoId')).then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  describe('[GET] Listar todos os usuários', () => {
    it('GET / CT002 - Endpoint incorreto', () => {
      getUsuariosIncorreto().then((response) => {
        expect(response.status).to.eq(405)
        expect(response.body.message).to.eq(
          message.getUsuariosEndpointIncorreto
        )
      })
    })

    it('GET / CT003 - Endpoint inválido', () => {
      getUsuariosInvalido().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
      })
    })
  })

  describe('[GET ID] Buscar Usuário por ID', () => {
    const ids = {
      inexistente: '0uxuPY0cbmQhpEww',
      comCaracterEspecial: '0uxuPY0cbmQhpEw!',
      curtoInvalido: '@@#!12345',
      curtoAlfanumerico: 'abc123',
      longo: '0uxuPY0cbmQhpEww123456789',
      apenasLetras: 'abcdefghijklmnop',
      apenasNumeros: '1234567890123456',
    }

    it('GET ID / CT002 - ID não cadastrado', () => {
      buscarUsuarioPorId(ids.inexistente).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq(message.usuarioNaoEncontrado)
      })
    })

    it('GET ID / CT003 - ID com 16 caracteres inválidos', () => {
      buscarUsuarioPorId(ids.comCaracterEspecial).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
      })
    })

    it('GET ID / CT004 - ID curto com caracteres inválidos', () => {
      buscarUsuarioPorId(ids.curtoInvalido).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
      })
    })

    it('GET ID / CT005 - ID curto alfanumérico', () => {
      buscarUsuarioPorId(ids.curtoAlfanumerico).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
      })
    })

    it('GET ID / CT006 - ID com mais de 16 caracteres', () => {
      buscarUsuarioPorId(ids.longo).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq(message.getUsuarioEndpointInvalido)
      })
    })

    it('GET ID / CT007 - ID com apenas letras (16 caracteres)', () => {
      buscarUsuarioPorId(ids.apenasLetras).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq(message.usuarioNaoEncontrado)
      })
    })

    it('GET ID / CT008 - ID com apenas números (16 caracteres)', () => {
      buscarUsuarioPorId(ids.apenasNumeros).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq(message.usuarioNaoEncontrado)
      })
    })
  })

  describe('[POST] Cadastrar Usuário', () => {
    it('POST / CT003 - Email já existente', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = 'fulano@qa.com'
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq(message.esteEmailJaEstaSendoUsado)
        })
      })
    })

    it('POST / CT004 - Campos em branco', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.nome = ''
        usuario.email = ''
        usuario.password = ''
        usuario.administrador = ''
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
          expect(response.body.email).to.eq(message.camposObrigatorios.email)
          expect(response.body.password).to.eq(
            message.camposObrigatorios.password
          )
          expect(response.body.administrador).to.eq(
            message.camposObrigatorios.administrador
          )
        })
      })
    })

    it('POST / CT017 - Email inválido', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = 'teste@@qa.com'
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.email).to.eq(message.emailInvalido)
        })
      })
    })

    it('POST / CT031 - Administrador com valor inválido em inglês', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.administrador = 'maybe'
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.administrador).to.eq(
            message.camposObrigatorios.administrador
          )
        })
      })
    })

    it('POST / CT032 - Administrador com valor em português', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.administrador = 'verdadeiro'
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.administrador).to.eq(
            message.camposObrigatorios.administrador
          )
        })
      })
    })

    it('POST / CT033 - Administrador com espaços', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.administrador = ' true '
        criarUsuario(usuario).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.administrador).to.eq(
            message.camposObrigatorios.administrador
          )
        })
      })
    })
  })

  describe('[PUT] Edição do Usuário', () => {
    it('PUT / CT003 - Email já existente', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = 'fulano@qa.com'
        editarUsuario(Cypress.env('usuarioNegativoId'), usuario).then(
          (response) => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq(
              message.esteEmailJaEstaSendoUsado
            )
          }
        )
      })
    })

    it('PUT / CT004 - Campos em branco', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.nome = ''
        usuario.email = ''
        usuario.password = ''
        usuario.administrador = ''
        editarUsuario(Cypress.env('usuarioNegativoId'), usuario).then(
          (response) => {
            expect(response.status).to.eq(400)
            expect(response.body.nome).to.eq(message.camposObrigatorios.nome)
            expect(response.body.email).to.eq(message.camposObrigatorios.email)
            expect(response.body.password).to.eq(
              message.camposObrigatorios.password
            )
            expect(response.body.administrador).to.eq(
              message.camposObrigatorios.administrador
            )
          }
        )
      })
    })

    it('PUT / CT017 - Email inválido', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.email = 'teste@@qa.com'
        editarUsuario(Cypress.env('usuarioNegativoId'), usuario).then(
          (response) => {
            expect(response.status).to.eq(400)
            expect(response.body.email).to.eq(message.emailInvalido)
          }
        )
      })
    })

    it('PUT / CT028 - Senha em branco', () => {
      cy.fixture('usuarios/usuario').then((usuario) => {
        usuario.password = ''
        editarUsuario(Cypress.env('usuarioNegativoId'), usuario).then(
          (response) => {
            expect(response.status).to.eq(400)
            expect(response.body.password).to.eq(
              message.camposObrigatorios.password
            )
          }
        )
      })
    })
  })

  describe('[DELETE] Deletar Usuário', () => {
    it('DELETE / CT002 - ID não cadastrado', () => {
      deletarUsuario('0uxuPY0cbmQhpEww').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq(message.nenhumRegistroExcluido)
      })
    })
  })
})
