import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração do cenário de teste de carga
export const options = {
  stages: [
    { duration: '10s', target: 5 },  // Sobe gradualmente até 5 utilizadores simultâneos em 10 segundos
    { duration: '20s', target: 5 },  // Mantém 5 utilizadores simultâneos durante 20 segundos
    { duration: '5s', target: 0 },   // Reduz para 0 utilizadores
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem responder em menos de 500ms
    http_req_failed: ['rate<0.01'],   // Menos de 1% de requisições com erro
  },
};

export default function () {
  // Executa uma requisição GET para listar os produtos na ServeRest
  const res = http.get('https://serverest.dev/produtos');

  // Validações básicas da resposta
  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
  });

  // Aguarda 1 segundo entre as requisições de cada utilizador virtual
  sleep(1);
  }