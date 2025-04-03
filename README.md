# FoodExplorer API

Esta é a API back end para o projeto FoodExplorer, desenvolvida com Node.js. A API serve como suporte para o front end do FoodExplorer, fornecendo endpoints para criação, edição, deleção, e busca de pratos, usuários, pedidos e favoritos.

## Descrição

O FoodExplorer é um projeto que permite aos usuários explorar pratos, fazer pedidos, e gerenciar favoritos. A API fornece a funcionalidade necessária para que o front end interaja com o banco de dados e gerencie as operações de forma eficiente.

## Funcionalidades

- **Plates (Pratos):**
  - Criar, editar, deletar, mostrar, buscar pratos.

- **Users (Usuários):**
  - Criar novos usuários.

- **Orders (Pedidos):**
  - Criar novos pedidos, mudar situação dos pedidos.

- **Favorites (Favoritos):**
  - Adicionar, remover e mostrar pratos favoritos.

## Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Express-async-errors**
- **Knex**
- **SQLite**
- **SQLite3**
- **JWT**
- **Multer**

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seuusuario/foodexplorer-backend.git
cd foodexplorer-backend
```
   
2. Instale as dependências:
```bash
npm install
```

4. Configure o banco de dados:

Certifique-se de que o SQLite está instalado.
Configure o arquivo knexfile.js com as informações do seu banco de dados.

4. Execute as migrações do banco de dados:
 ```bash
npx knex migrate:latest
```

5. Inicie o servidor:
 ```bash
npm run dev
```

## Licença
Este projeto está licenciado sob a [MIT](https://github.com/Toddynh0BR/Food-Explorer-BackEnd/blob/main/LICENSE) License.

## Autores

- [@Toddynh0BR](https://github.com/Toddynh0BR)
    
