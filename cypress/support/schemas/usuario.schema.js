const usuarioSchema = {
  type: 'object',
  properties: {
    _id:           { type: 'string' },
    nome:          { type: 'string' },
    email:         { type: 'string' },
    password:      { type: 'string' },
    administrador: { type: 'string' },
  },
  required: ['_id', 'nome', 'email', 'password', 'administrador'],
  additionalProperties: false,
}

module.exports = { usuarioSchema }