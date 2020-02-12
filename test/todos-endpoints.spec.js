const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeTodosArray, makeMaliciousTodo } = require('./todos.fixtures');

describe('Todos Endpoints', function() {
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after('disconnect from db', () => db.destroy());
    before('clean the todos table', () => db('todos').truncate());
    afterEach('cleanup todos', () => db('todos').truncate());
    
    describe('GET /api/todos', () => {
        context('Given no todos', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/todos')
                    .expect(200, [])
            });
        });
        context('Given there are todos in the database', () => {
            const testTodos = makeTodosArray();
            beforeEach('insert todos', () => {
                return db
                    .into('todos')
                    .insert(testTodos)
            });
            it('responds with 200 and all of the todos', () => {
                return supertest(app)
                    .get('/api/todos')
                    .expect(200, testTodos)
            });
        });
        context('Given an XSS attack todo', () => {
            const { maliciousTodo, expectedTodo } = makeMaliciousTodo();
            beforeEach('insert the malicious todo', () => {
                return db
                    .into('todos')
                    .insert([maliciousTodo])
            })
            it('removes XSS attack content', () => {
                return supertest(app)
                    .get('/api/todos')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].todo).to.eql(expectedTodo.todo)
                        expect(res.body[0].who).to.eql(expectedTodo.who)
                    })
            });
        });
    });

    describe('GET /api/todos/:id', () => {
        context('Given no todos', () => {
            it(`responds 404 when todo doesn't exist`, () => {
                return supertest(app)
                    .get('/api/todos/123456')
                    .expect(404, { error: { message: `Todo doesn't exist!` } })
            });
        });
        context('Given there are todos in the database', () => {
            const testTodos = makeTodosArray();
            beforeEach('insert todos', () => {
                return db
                    .into('todos')
                    .insert(testTodos)
            });
            it('responds with 200 and the specified todo', () => {
                const todoId = 3;
                const expectedTodo = testTodos[todoId - 1]
                return supertest(app)
                    .get(`/api/todos/${todoId}`)
                    .expect(200, expectedTodo)
            });
        });
        context('Given an XSS attack todo', () => {
            const { maliciousTodo, expectedTodo } = makeMaliciousTodo();
            beforeEach('insert the malicious todo', () => {
                return db
                    .into('todos')
                    .insert([maliciousTodo])
            })
            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/todos/${maliciousTodo.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.todo).to.eql(expectedTodo.todo)
                        expect(res.body.who).to.eql(expectedTodo.who)
                    })
            });
        });
    });

    describe('POST /api/todos', () => {
        it('creates a todo, responds with 201 and the new todo', () => {
            const newTodo = {
                todo: 'Test new todo',
                who: 'Mark Bergstrom',
                created: '2020-02-07',
                due: '2020-02-14',
                status: null,
                reviewed: 'no',
                issue: null
            };
            return supertest(app)
                .post('/api/todos')
                .send(newTodo)
                .expect(201)
                .expect(res => {
                    expect(res.body.todo).to.eql(newTodo.todo)
                    expect(res.body.who).to.eql(newTodo.who)
                    expect(res.body.created).to.eql(newTodo.created)
                    expect(res.body.due).to.eql(newTodo.due)
                    expect(res.body.status).to.eql(newTodo.status)
                    expect(res.body.reviewed).to.eql(newTodo.reviewed)
                    expect(res.body.issue).to.eql(newTodo.issue)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/todos/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/todos/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        });
        const requiredFields = ['todo', 'who', 'due'];
        requiredFields.forEach(field => {
            const newTodo = {
                todo: 'Test new todo',
                who: 'Mark Bergstrom',
                created: '2020-02-07',
                due: '2020-02-14',
                reviewed: 'no'
            };
            it(`responds with 400 and an error message when the ${field} is missing`, () => {
                delete newTodo[field];
                return supertest(app)
                    .post('/api/todos')
                    .send(newTodo)
                    .expect(400, {error: { message: `Missing '${field}' in request body` }})
            });
        });
        it('removes XSS attack content from response', () => {
            const { maliciousTodo, expectedTodo } = makeMaliciousTodo();
            return supertest(app)
                .post('/api/todos')
                .send(maliciousTodo)
                .expect(201)
                .expect(res => {
                    expect(res.body.todo).to.eql(expectedTodo.todo)
                    expect(res.body.who).to.eql(expectedTodo.who)
                })
        });
    });
    
    describe('DELETE /api/todos/:id', () => {
        context('Given no todo', () => {
            it(`responds with 404`, () => {
                const todoId = 123456;
                return supertest(app)
                    .delete(`/api/todos/${todoId}`)
                    .expect(404, { error: { message: `Todo doesn't exist!` } })
            });
        });
        context('Given there are todos in the database', () => {
            const testTodos = makeTodosArray();
            beforeEach('insert todos', () => {
                return db
                    .into('todos')
                    .insert(testTodos)
            });
    
            it('responds with 204 and removes the todo', () => {
                const idToRemove = 2
                const expectedTodos = testTodos.filter(todo => todo.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/todos/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/todos`)
                            .expect(expectedTodos)
                    )
            });
        });
    });
    describe('PATCH /api/todos/:id', () => {
        context('Given no todos', () => {
            it('responds with 404', () => {
                const todoId = 123456;
                return supertest(app)
                    .patch(`/api/todos/${todoId}`)
                    .expect(404, { error: { message: `Todo doesn't exist!` } })
            });
        });
        context('Given there are todos in the database', () => {
            const testTodos = makeTodosArray();
            beforeEach('insert todos', () => {
                return db
                    .into('todos')
                    .insert(testTodos)
            });
            it('responds with 204 and updates the todo', () => {
                const idToUpdate = 2;
                const updateTodo = {
                    todo: 'updated todo',
                    who: 'Nathan Witt',
                    due: '2020-02-14',
                    status: null,
                    reviewed: 'no',
                    issue: null
                };
                const expectedTodo = {
                    ...testTodos[idToUpdate - 1],
                    ...updateTodo
                };
                return supertest(app)
                    .patch(`/api/todos/${idToUpdate}`)
                    .send(updateTodo)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/todos/${idToUpdate}`)
                            .expect(expectedTodo)
                    )
            });
            it('responds with 400 when no required fields are supplied', () => {
                const idToUpdate = 2;
                return supertest(app)
                    .patch(`/api/todos/${idToUpdate}`)
                    .expect(400, {
                        error: { message: `Request body must contain either "todo", "who", "due", or "issue'!` }
                    })
            });
            it('responds with 204 when updating only a subset of fields', () => {
                const idToUpdate = 2;
                const updateTodo = {
                    todo: 'updated todo'
                };
                const expectedTodo = {
                    ...testTodos[idToUpdate - 1],
                    ...updateTodo
                };
                return supertest(app)
                    .patch(`/api/todos/${idToUpdate}`)
                    .send({
                        ...updateTodo,
                        fieldToIgnore: 'should not be in GET response!'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/todos/${idToUpdate}`)
                            .expect(expectedTodo)
                    )
            });
        });
    });
});