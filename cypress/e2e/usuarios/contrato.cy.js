import Ajv from 'ajv'
import { getUsuarios } from '../../support/services/usuarios.service'
import { usuarioSchema } from '../../support/schemas/usuario.schema'

const ajv = new Ajv()

describe('Usuários - Testes de Contrato', () => {

  it('deve validar o schema de um usuário', () => {
    getUsuarios().then((response) => {
      expect(response.status).to.eq(200)

      const usuario = response.body.usuarios[0]
      const validate = ajv.compile(usuarioSchema)
      const valid = validate(usuario)

      if (!valid) {
        cy.log('Erros de schema: ' + JSON.stringify(validate.errors))
      }

      expect(valid, JSON.stringify(validate.errors)).to.be.true
    })
  })

})