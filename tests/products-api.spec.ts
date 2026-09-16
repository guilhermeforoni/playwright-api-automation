//O test gerencia o ciclo de vida dos testes (test.beforeAll, test.describe, etc.),
// enquanto o expect realiza as asserções de contrato HTTP (status code, body, headers).
import { test, expect } from '@playwright/test';
//Importa a função que cria um objeto de produto com um nome dinâmico 
// para garantir que o teste nunca falhe por duplicidade de dados no banco do ServeRest.
import { generateRandomProduct } from '../fixtures/productData';



test.describe('ServeRest - Testes de API de Produtos (Playwright + TS)', () => {
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

  test('Deve retornar erro ao tentar cadastrar produto sem o Token de autorizacao', async ({ request }) => {
    const newProduct = generateRandomProduct();

    // Chamada propositalmente sem o campo 'headers'
    const response = await request.post(`${baseURL}/produtos`, {
      data: newProduct
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.message).toContain('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
  });
});