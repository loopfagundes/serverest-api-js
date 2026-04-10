const produtoSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    nome: { type: 'string' },
    preco: { type: 'number' },
    descricao: { type: 'string' },
    quantidade: { type: 'number' },
  },
  required: ['_id', 'nome', 'preco', 'descricao', 'quantidade'],
  additionalProperties: false,
}

module.exports = { produtoSchema }
