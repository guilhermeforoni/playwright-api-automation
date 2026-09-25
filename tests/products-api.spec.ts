// O test gerencia o ciclo de vida dos testes (test.beforeAll, test.describe, etc.),
// enquanto o expect realiza as asserções de contrato HTTP (status code, body, headers).
import { test, expect } from '@playwright/test';
// Importa a biblioteca Faker para gerar dados dinâmicos e isolados de utilizador
import { faker } from '@faker-js/faker/locale/pt_BR';
// Importa as funções que criam objetos de produto com nomes dinâmicos
import { generateRandomProduct, generateUpdatedProduct } from '../fixtures/productData';

test.describe('ServeRest - Testes de API de Produtos (CRUD Completo)', () => {
  const baseURL = 'https://serverest.dev';
  let authToken: string;

  // BEFORE ALL: Cria um utilizador administrador dinâmico e obtém o Token JWT em tempo de execução
  test.beforeAll(async ({ request }) => {
    const userEmail = faker.internet.email();
    const userPassword = faker.internet.password();

    // 1. Cadastra o novo utilizador administrador na ServeRest
    const createUserResponse = await request.post(`${baseURL}/usuarios`, {
      data: {
        nome: faker.person.fullName(),
        email: userEmail,
        password: userPassword,
        administrador: 'true'
      }
    });
    expect(createUserResponse.status()).toBe(201);

    // 2. Faz o login com as credenciais recém-criadas para extrair o token
    const loginResponse = await request.post(`${baseURL}/login`, {
      data: {
        email: userEmail,
        password: userPassword
      }
    });

    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    
    // Salva o token Bearer para autenticar chamadas restritas
    authToken = body.authorization;
  });

  // CENÁRIO 1: Criar (POST)
  test('Deve cadastrar um novo produto com sucesso enviando o Header Authorization (POST)', async ({ request }) => {
    const newProduct = generateRandomProduct();

    // Faz a chamada POST enviando os dados e o Token JWT nos Headers
    const response = await request.post(`${baseURL}/produtos`, {
      headers: {
        'Authorization': authToken
      },
      data: newProduct
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    // Validações do contrato
    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body).toHaveProperty('_id');
  });

  // CENÁRIO 2: Alterar (PUT)
  test('Deve alterar os dados de um produto existente (PUT)', async ({ request }) => {
    // 1. Cria um produto para garantir que temos um ID válido para alterar
    const initialProduct = generateRandomProduct();
    const createResponse = await request.post(`${baseURL}/produtos`, {
      headers: { 'Authorization': authToken },
      data: initialProduct
    });
    const createBody = await createResponse.json();
    const productId = createBody._id;

    // 2. Prepara os novos dados de atualização
    const updatedData = generateUpdatedProduct();

    // 3. Executa a requisição PUT passando o ID na URL
    const updateResponse = await request.put(`${baseURL}/produtos/${productId}`, {
      headers: { 'Authorization': authToken },
      data: updatedData
    });

    // 4. Valida se a alteração foi bem-sucedida
    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody.message).toBe('Registro alterado com sucesso');
  });

  // CENÁRIO 3: Excluir (DELETE)
  test('Deve excluir um produto com sucesso (DELETE)', async ({ request }) => {
    // 1. Cria um produto para ser eliminado
    const productToDelete = generateRandomProduct();
    const createResponse = await request.post(`${baseURL}/produtos`, {
      headers: { 'Authorization': authToken },
      data: productToDelete
    });
    const createBody = await createResponse.json();
    const productId = createBody._id;

    // 2. Executa a requisição DELETE passando o ID na URL
    const deleteResponse = await request.delete(`${baseURL}/produtos/${productId}`, {
      headers: { 'Authorization': authToken }
    });

    // 3. Valida se o registo foi removido com sucesso
    expect(deleteResponse.status()).toBe(200);
    const deleteBody = await deleteResponse.json();
    expect(deleteBody.message).toBe('Registro excluído com sucesso');
  });

  // CENÁRIO 4: Validação Negativa (Segurança)
  test('Deve retornar erro ao tentar cadastrar produto sem Token (POST)', async ({ request }) => {
    const newProduct = generateRandomProduct();

    const response = await request.post(`${baseURL}/produtos`, {
      data: newProduct
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toContain('Token de acesso ausente');
  });
});