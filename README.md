# 🎭 Playwright API Automation - ServeRest

Este projeto consiste em uma suíte automatizada de testes de API REST desenvolvida em **Playwright** com **TypeScript**, focada em cobrir o fluxo completo de CRUD e autenticação da aplicação **ServeRest**.

![API Regression Tests](https://github.com/guilhermeforoni/playwright-api-automation/actions/workflows/api-tests.yml/badge.svg)

## 🎯 Objetivo do Projeto
Demonstrar a aplicação de boas práticas em testes de API na camada de serviços, garantindo velocidade, independência de cenários e execução contínua via pipeline de CI/CD.

## 🛠️ Tecnologias e Ferramentas
* **Linguagem:** TypeScript
* **Framework:** Playwright (`request` context nativo)
* **Massa de Dados:** `@faker-js/faker` (Locale `pt_BR`)
* **CI/CD:** GitHub Actions
* **Aplicação Alvo:** [ServeRest API](https://serverest.dev)

## 🧪 Cobertura dos Testes
- **Autenticação (JWT):** Login e extração dinâmica do Bearer Token no gancho `beforeAll`.
- **POST `/produtos`:** Cadastro de novos produtos enviando o token nos headers.
- **GET `/produtos`:** Validação do contrato e listagem de registros.
- **PUT `/produtos/{id}`:** Encadeamento de requisições para alteração de dados.
- **DELETE `/produtos/{id}`:** Encadeamento de requisições para remoção e limpeza.
- **Segurança (401 Unauthorized):** Validação de acessos não autorizados sem token.

## 🚀 Como Executar o Projeto Localmente

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/guilhermeforoni/playwright-api-automation.git](https://github.com/guilhermeforoni/playwright-api-automation.git)
   cd playwright-api-automation
