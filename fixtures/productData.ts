import { fakerPT_BR as faker } from '@faker-js/faker';

// Função para gerar dados de produtos dinâmicos
export const generateRandomProduct = () => {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(5)}`,
    preco: Number(faker.commerce.price({ min: 50, max: 2000, dec: 0 })),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 })
  };
};

export const generateUpdatedProduct = () => {
return {
    nome: `${faker.commerce.productName()} Editado ${faker.string.alphanumeric(4)}`,
    preco: Number(faker.commerce.price({ min: 100, max: 3000, dec: 0 })),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 5, max: 50 })
  };
};

// Exemplo extra: Gerador de dados de usuários brasileiros (para testes de cadastro de clientes)
export const generateRandomUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    nome: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }),
    password: faker.internet.password({ length: 10 }),
    administrador: "true"
  };
};