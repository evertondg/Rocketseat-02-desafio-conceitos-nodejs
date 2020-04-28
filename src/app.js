const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [
  {
    //id: uuid(),
    id: '3735ae0c-c85b-4cd3-9236-0e897cf59600',
    url: 'http://teste.com.br',
    title: 'Repositorio Principal',
    techs: ['REACT', 'NODEJS'],
    likes: 0
  }
];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  console.log(id);
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' })
  }

  return next();
}

app.use(['/repositories/:id', '/repositories/:id/like'], validateRepositoryId);


app.get("/repositories", (request, response) => {
  // TODO 
  // FILTROS DOS CAMPOS
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  // TODO
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  }

  repositories.push(repository)

  response.json(repository)


});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found!" })
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositoryIndex].likes ? repositories[repositoryIndex].likes : 0
  }

  repositories[repositoryIndex] = repository;

  response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found!" })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    response.status(400).json({ error: "Repository not found!" })
  }


  const likes = repositories[repositoryIndex].likes;
  repositories[repositoryIndex].likes = likes + 1;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
