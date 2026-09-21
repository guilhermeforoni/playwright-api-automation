//O test gerencia o ciclo de vida dos testes (test.beforeAll, test.describe, etc.),
// enquanto o expect realiza as asserções de contrato HTTP (status code, body, headers).
import { test, expect } from '@playwright/test';
//Importa a função que cria um objeto de produto com um nome dinâmico 
// para garantir que o teste nunca falhe por duplicidade de dados no banco do ServeRest.
import { generateRandomProduct, generateUpdatedProduct } from '../fixtures/productData';



test.describe('ServeRest - Testes de API de Produtos (CRUD Completo)', () => {
  const baseURL = 'https://serverest.dev';
  let authToken: string;

  // BEFORE ALL: Executa UMA vez antes de todos os testes para gerar o Token JWT
  // O atributo `data` envia o corpo (payload) em formato JSON para o endpoint.
  //
  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post(`${baseURL}/login`, {
      data: {
        email: 'fulano@qa.com',
        password: 'teste'
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

    // 3. Valida se o registro foi removido com sucesso
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