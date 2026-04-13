const carrinhoSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    produtos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          idProduto: { type: 'string' },
          quantidade: { type: 'number' },
          precoUnitario: { type: 'number' },
        },
        required: ['idProduto', 'quantidade', 'precoUnitario'],
      },
    },
    precoTotal: { type: 'number' },
    quantidadeTotal: { type: 'number' },
    idUsuario: { type: 'string' },
  },
  required: ['_id', 'produtos', 'precoTotal', 'quantidadeTotal', 'idUsuario'],
  additionalProperties: false,
}

module.exports = { carrinhoSchema }
