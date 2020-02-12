const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeIssuesArray, makeMaliciousIssue } = require('./issues.fixtures');

describe('Issues Endpoints', function() {
    let db;
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });
    after('disconnect from db', () => db.destroy());
    //before('clean the issues table', () => db('issues').truncate());
    before('clean the issues table', () => db.raw('TRUNCATE TABLE issues CASCADE'));
    //afterEach('cleanup issues', () => db('issues').truncate());
    afterEach('cleanup issues', () => db.raw('TRUNCATE TABLE issues CASCADE'));
    
    describe('GET /api/issues', () => {
        context('Given no issues', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/issues')
                    .expect(200, [])
            });
        });
        context('Given there are issues in the database', () => {
            const testIssues = makeIssuesArray();
            beforeEach('insert issues', () => {
                return db
                    .into('issues')
                    .insert(testIssues)
            });
            it('responds with 200 and all of the issues', () => {
                return supertest(app)
                    .get('/api/issues')
                    .expect(200, testIssues)
            });
        });
        context('Given an XSS attack issue', () => {
            const { maliciousIssue, expectedIssue } = makeMaliciousIssue();
            beforeEach('insert the malicious issue', () => {
                return db
                    .into('issues')
                    .insert([maliciousIssue])
            })
            it('removes XSS attack content', () => {
                return supertest(app)
                    .get('/api/issues')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].issue).to.eql(expectedIssue.issue)
                        expect(res.body[0].who).to.eql(expectedIssue.who)
                    })
            });
        });
    });

    describe('GET /api/issues/:id', () => {
        context('Given no issues', () => {
            it(`responds 404 when issue doesn't exist`, () => {
                return supertest(app)
                    .get('/api/issues/123456')
                    .expect(404, { error: { message: `Issue doesn't exist!` } })
            });
        });
        context('Given there are issues in the database', () => {
            const testIssues = makeIssuesArray();
            beforeEach('insert issues', () => {
                return db
                    .into('issues')
                    .insert(testIssues)
            });
            it('responds with 200 and the specified issue', () => {
                const issueId = 3;
                const expectedIssue = testIssues[issueId - 1]
                return supertest(app)
                    .get(`/api/issues/${issueId}`)
                    .expect(200, expectedIssue)
            });
        });
        context('Given an XSS attack issue', () => {
            const { maliciousIssue, expectedIssue } = makeMaliciousIssue();
            beforeEach('insert the malicious issue', () => {
                return db
                    .into('issues')
                    .insert([maliciousIssue])
            })
            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/issues/${maliciousIssue.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.issue).to.eql(expectedIssue.issue)
                        expect(res.body.who).to.eql(expectedIssue.who)
                    })
            });
        });
    });

    describe('POST /api/issues', () => {
        it('creates a issue, responds with 201 and the new issue', () => {
            const newIssue = {
                issue: 'Test new issue',
                who: 'Mark Bergstrom',
                created: '2020-02-07',
                status: null,
                reviewed: 'no'
            };
            return supertest(app)
                .post('/api/issues')
                .send(newIssue)
                .expect(201)
                .expect(res => {
                    expect(res.body.issue).to.eql(newIssue.issue)
                    expect(res.body.who).to.eql(newIssue.who)
                    expect(res.body.created).to.eql(newIssue.created)
                    expect(res.body.status).to.eql(newIssue.status)
                    expect(res.body.reviewed).to.eql(newIssue.reviewed)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/issues/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                        .get(`/api/issues/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        });
        const requiredFields = ['issue', 'who'];
        requiredFields.forEach(field => {
            const newIssue = {
                issue: 'Test new issue',
                who: 'Mark Bergstrom',
                created: '2020-02-07',
                reviewed: 'no'
            };
            it(`responds with 400 and an error message when the ${field} is missing`, () => {
                delete newIssue[field];
                return supertest(app)
                    .post('/api/issues')
                    .send(newIssue)
                    .expect(400, {error: { message: `Missing '${field}' in request body` }})
            });
        });
        it('removes XSS attack content from response', () => {
            const { maliciousIssue, expectedIssue } = makeMaliciousIssue();
            return supertest(app)
                .post('/api/issues')
                .send(maliciousIssue)
                .expect(201)
                .expect(res => {
                    expect(res.body.issue).to.eql(expectedIssue.issue)
                    expect(res.body.who).to.eql(expectedIssue.who)
                })
        });
    });
    
    describe('DELETE /api/issues/:id', () => {
        context('Given no issue', () => {
            it(`responds with 404`, () => {
                const issueId = 123456;
                return supertest(app)
                    .delete(`/api/issues/${issueId}`)
                    .expect(404, { error: { message: `Issue doesn't exist!` } })
            });
        });
        context('Given there are issues in the database', () => {
            const testIssues = makeIssuesArray();
            beforeEach('insert issues', () => {
                return db
                    .into('issues')
                    .insert(testIssues)
            });
    
            it('responds with 204 and removes the issue', () => {
                const idToRemove = 2
                const expectedIssues = testIssues.filter(issue => issue.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/issues/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/issues`)
                            .expect(expectedIssues)
                    )
            });
        });
    });
    describe('PATCH /api/issues/:id', () => {
        context('Given no issues', () => {
            it('responds with 404', () => {
                const issueId = 123456;
                return supertest(app)
                    .patch(`/api/issues/${issueId}`)
                    .expect(404, { error: { message: `Issue doesn't exist!` } })
            });
        });
        context('Given there are issues in the database', () => {
            const testIssues = makeIssuesArray();
            beforeEach('insert issues', () => {
                return db
                    .into('issues')
                    .insert(testIssues)
            });
            it('responds with 204 and updates the issue', () => {
                const idToUpdate = 2;
                const updateIssue = {
                    issue: 'updated issue',
                    who: 'Nathan Witt',
                    status: null,
                    reviewed: 'no',
                };
                const expectedIssue = {
                    ...testIssues[idToUpdate - 1],
                    ...updateIssue
                };
                return supertest(app)
                    .patch(`/api/issues/${idToUpdate}`)
                    .send(updateIssue)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/issues/${idToUpdate}`)
                            .expect(expectedIssue)
                    )
            });
            it('responds with 400 when no required fields are supplied', () => {
                const idToUpdate = 2;
                return supertest(app)
                    .patch(`/api/issues/${idToUpdate}`)
                    .expect(400, {
                        error: { message: `Request body must contain either "issue" or "who"!` }
                    })
            });
            it('responds with 204 when updating only a subset of fields', () => {
                const idToUpdate = 2;
                const updateIssue = {
                    issue: 'updated issue'
                };
                const expectedIssue = {
                    ...testIssues[idToUpdate - 1],
                    ...updateIssue
                };
                return supertest(app)
                    .patch(`/api/issues/${idToUpdate}`)
                    .send({
                        ...updateIssue,
                        fieldToIgnore: 'should not be in GET response!'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/issues/${idToUpdate}`)
                            .expect(expectedIssue)
                    )
            });
        });
    });
});