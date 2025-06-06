# RenovaTec API

API RESTful para gerenciamento de painéis solares e monitoramento de consumo energético.

## Requisitos

- .NET 8.0 SDK
- SQL Server (LocalDB ou Express)
- Azure Service Bus (para mensageria)
- Docker e Docker Compose (para execução em containers)

## Configuração

1. Clone o repositório
2. Configure as strings de conexão no arquivo `src/RenovaTec.API/appsettings.json`:
   - `Default`: String de conexão do SQL Server
   - `ServiceBus`: String de conexão do Azure Service Bus
3. Configure a chave JWT em `appsettings.json`:
   - Substitua `YOUR_SECRET_KEY_HERE_MIN_16_CHARS` por uma chave segura de pelo menos 16 caracteres

## Executando a Aplicação

### Usando Docker Compose (Recomendado)

1. Configure as variáveis de ambiente no arquivo `docker-compose.yml`:
   - Substitua `YOUR_SERVICE_BUS_CONNECTION_STRING` pela string de conexão do Azure Service Bus
   - Substitua `YOUR_SECRET_KEY_HERE_MIN_16_CHARS` pela chave JWT
   - Opcionalmente, altere a senha do SQL Server (`YourStrong!Passw0rd`)

2. Execute o comando para criar e iniciar os containers:
   ```bash
   docker-compose up --build
   ```

3. Acesse a API em `http://localhost:8080`

4. Para verificar os logs:
   ```bash
   # Logs da API
   docker logs renovatec-api -f

   # Logs do banco de dados
   docker logs renovatec-db -f
   ```

5. Para parar os containers:
   ```bash
   docker-compose down
   ```

### Localmente

```bash
cd src/RenovaTec.API
dotnet run
```

## Endpoints

### Painéis Solares

- `POST /api/panels` - Cadastrar novo painel
- `GET /api/panels/status` - Listar status dos painéis (paginado)
- `PUT /api/panels/{id}/production` - Atualizar dados de produção

### Alertas

- `POST /api/alerts` - Criar alerta de consumo

## Segurança

- Autenticação via JWT Bearer
- Rate limiting: 100 requisições por minuto
- Cache de resposta: 60 segundos
- Validação de dados via FluentValidation

## Testes

```bash
cd src/RenovaTec.Tests
dotnet test
```

## Estrutura do Projeto

```
src/
 ├── RenovaTec.Domain/         # Entidades e interfaces
 ├── RenovaTec.Infrastructure/ # EF Core, Migrations, Redis Cache, Azure SB
 ├── RenovaTec.Application/    # DTOs, Services, AutoMapper
 └── RenovaTec.API/           # Controllers, Middleware, Program.cs
```

## Migrations

As migrations do Entity Framework Core são aplicadas automaticamente ao iniciar a aplicação. Para criar uma nova migration:

```bash
dotnet ef migrations add NomeDaMigration --project src/RenovaTec.Infrastructure --startup-project src/RenovaTec.API
```

Para aplicar migrations manualmente:

```bash
dotnet ef database update --project src/RenovaTec.Infrastructure --startup-project src/RenovaTec.API
``` 