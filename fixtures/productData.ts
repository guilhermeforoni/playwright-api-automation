export const generateRandomProduct = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    nome: `Produto QA ${randomId}`,
    preco: 470,
    descricao: "Mouse Gamer Ergonomico",
    quantidade: 10
  };
};

export const generateUpdatedProduct = () => {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    nome: `Produto QA Alterado ${randomId}`,
    preco: 599,
    descricao: "Mouse Gamer Ergonomico Sem Fio",
    quantidade: 15
  };
};