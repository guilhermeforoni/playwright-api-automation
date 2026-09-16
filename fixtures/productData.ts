export const generateRandomProduct = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    nome: `Produto QA ${randomId}`,
    preco: 470,
    descricao: "Mouse Gamer Ergonomico",
    quantidade: 10
  };
};