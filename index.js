const express = require('express');

const server = express();

//Possibilitar receber JSON no body
server.use(express.json());

const projects = [];
let counter = 0;

//Middleware global para quantidade de requisições na aplicação
function logRequests(req, res, next) {
    counter++;
    console.log(`Número de requisições ${counter}`);

    return next();
}

//Middleware para verificar se o projeto existe
function checkProjectExists (req, res, next) {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    if(!project) {
        return res.status(400).json({ error: "Project not exists"})
    }

    req.project = project;

    return next();
}

server.use(logRequests);

//Criar novo projeto
server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;

    const project = {
        id,
        title,
        tasks
    };

    projects.push(project);

    return res.json(projects);
});

//Buscar todos os projetos
server.get('/projects', (req, res) => {
    return res.json(projects);
});

//Alterar título do projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { title } = req.body;

    const project = req.project;
    
    project.title = title;


    return res.json(project);
});

//Deletar projeto
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
});

//Criar tarefa para um projeto
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const project = req.project;
    const { title }  = req.body;

    project.tasks.push(title);

    return res.json(project);
});

server.listen(3300);