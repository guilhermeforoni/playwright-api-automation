// Define a estrutura estrita esperada para a resposta de um produto
export const productSchema = {
  type: "object",
  properties: {
    nome: { type: "string" },
    preco: { type: "number" },
    descricao: { type: "string" },
    quantidade: { type: "number" },
    _id: { type: "string" }
  },
  required: ["nome", "preco", "descricao", "quantidade", "_id"],
  additionalProperties: true
};