# Cadê? - MVC + ORM + DAO + SQLite (Node.js + Express 5)

Requer **Docker** (recomendado) ou **Node.js 18 ou superior** para execução local.

---

## Como rodar com Docker (Jeito mais fácil)

Não é necessário instalar Node.js, SQLite ou dependências manualmente na máquina — basta ter o Docker instalado.

### Passo a passo
1. Baixe e instale o **Docker Desktop** (Windows/Mac) ou o **Docker Engine** (Linux) e certifique-se de que ele esteja aberto e em execução.
2. Abra o terminal (por exemplo, pelo **VS Code**) na pasta raiz do projeto (onde está o arquivo `docker-compose.yml`).
3. Execute o comando para construir a imagem e iniciar o servidor em segundo plano:
   ```bash
   docker compose up -d --build
4. Depois que Depois que rodar, ele irá carregar todas as dependencias e irá abrir o servidor local na porta `localhost:3000`

## Outros comandos (opcional): 

Todos os comandos abaixo devem ser executados dentro da pasta raiz do projeto (onde está o arquivo docker-compose.yml):

1. Rodar em segundo plano (primeira vez ou quando alterar o código):

````Bash
docker compose up -d --build
````
(A flag -d significa "detached", ou seja, deixa rodando em segundo plano e libera o terminal.)

2. Rodar em segundo plano (quando a imagem já foi criada e você **não** mudou o código):

````Bash
docker compose up -d
````

3. Parar a aplicação (mantendo o container e os dados prontos para voltar depois):
````Bash
docker compose stop
````
4. Voltar a rodar depois de ter parado com stop:
````Bash
docker compose start
````
5. Parar e remover o container (mantendo o volume com o banco de dados itens.db intacto):
````Bash
docker compose down
````
(Para subir de novo depois de um down, use docker compose up -d.)

6. Comandos úteis do dia a dia
Ver se o container está rodando:
````Bash
docker compose ps
````
7. Ver o que está acontecendo no servidor (logs em tempo real):
````Bash
docker compose logs -f
````
8. (Para sair dos logs sem parar o sistema, aperte Ctrl + C.)
Reiniciar rapidamente:
````Bash
docker compose restart
````
**Dica**: Como configuramos restart: unless-stopped no docker-compose.yml, se você reiniciar o computador, o Docker sobe o sistema automaticamente em segundo plano — a menos que você tenha parado ele manualmente com docker compose stop ou docker compose down.