import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { productSchema } from '../schemas/productSchema';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

test.describe('Testes de Contrato de API (JSON Schema)', () => {

  test('Deve validar o contrato do payload do produto retornado', async ({ request }) => {
    // 1. Faz a requisição GET para buscar a lista de produtos
    const response = await request.get('https://serverest.dev/produtos');
    expect(response.status()).toBe(200);

    const body = await response.json();
    
    // Pega o primeiro produto retornado da lista
    const product = body.produtos[0];

    // 2. Compila e valida o schema JSON
    const validate = ajv.compile(productSchema);
    const valid = validate(product);

    // 3. Se houver erro de contrato, exibe os detalhes exatos
    if (!valid) {
      console.log('Erros de Schema encontrados:', validate.errors);
    }

    expect(valid).toBe(true);
  });

});