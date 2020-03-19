const path = require('path')
const express = require('express')
const xss = require('xss')
const TodosService = require('./todos-service')

const todosRouter = express.Router()
const jsonParser = express.json()

const serializeTodo = todo => ({
    id: todo.id,
    todo: xss(todo.todo),
    who: xss(todo.who),
    created: todo.created,
    due: todo.due,
    status: todo.status,
    status_date: todo.status_date,
    reviewed: todo.reviewed,
    issue: todo.issue
});

todosRouter
    .route('/')
    .get((req, res, next) => {
        TodosService.getAllTodos(
            req.app.get('db')
        )
        .then(todos => {
            res.json(todos.map(serializeTodo))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { todo, who, created, due, status, status_date, reviewed, issue } = req.body
        const newTodo = { todo, who, created, due, reviewed };
        for (const [key, value] of Object.entries(newTodo)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
        newTodo.status = status;
        newTodo.status_date = status_date;
        newTodo.issue = issue;
        TodosService.insertTodo(
            req.app.get('db'),
            newTodo
        )
        .then(todo => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl + `/${todo.id}`))
            .json(serializeTodo(todo))
        })
        .catch(next)
    })

todosRouter
    .route('/:todo_id')
    .all((req, res, next) => {
        TodosService.getById(
            req.app.get('db'),
            req.params.todo_id
        )
        .then(todo => {
            if (!todo) {
                return res.status(404).json({
                    error: { message: `Todo doesn't exist!` }
                })
            }
            res.todo = todo
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeTodo(res.todo))
    })
    .delete((req, res, next) => {
        TodosService.deleteTodo(
            req.app.get('db'),
            req.params.todo_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { todo, who, created, due, status, status_date, reviewed, issue } = req.body
        const todoToUpdate = { todo, who, due, issue };
        const numberOfValues = Object.values(todoToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either "todo", "who", "due", or "issue'!`
                }
            })
        }
        todoToUpdate.created = created;
        todoToUpdate.status = status;
        todoToUpdate.status_date = status_date;
        todoToUpdate.reviewed = reviewed;
        TodosService.updateTodo(
            req.app.get('db'),
            req.params.todo_id,
            todoToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = todosRouter;