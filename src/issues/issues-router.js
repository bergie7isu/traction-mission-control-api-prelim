const path = require('path')
const express = require('express')
const xss = require('xss')
const IssuesService = require('./issues-service')

const issuesRouter = express.Router()
const jsonParser = express.json()

const serializeIssue = issue => ({
    id: issue.id,
    issue: xss(issue.issue),
    who: xss(issue.who),
    created: issue.created,
    status: issue.status,
    status_date: issue.status_date,
    reviewed: issue.reviewed
});

issuesRouter
    .route('/')
    .get((req, res, next) => {
        IssuesService.getAllIssues(
            req.app.get('db')
        )
        .then(issues => {
            res.json(issues.map(serializeIssue))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { issue, who, created, status, status_date, reviewed } = req.body
        const newIssue = { issue, who, created, reviewed };
        for (const [key, value] of Object.entries(newIssue)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
        newIssue.status = status;
        newIssue.status_date = status_date;
        IssuesService.insertIssue(
            req.app.get('db'),
            newIssue
        )
        .then(issue => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl + `/${issue.id}`))
            .json(serializeIssue(issue))
        })
        .catch(next)
    })

issuesRouter
    .route('/:issue_id')
    .all((req, res, next) => {
        IssuesService.getById(
            req.app.get('db'),
            req.params.issue_id
        )
        .then(issue => {
            if (!issue) {
                return res.status(404).json({
                    error: { message: `Issue doesn't exist!` }
                })
            }
            res.issue = issue
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeIssue(res.issue))
    })
    .delete((req, res, next) => {
        IssuesService.deleteIssue(
            req.app.get('db'),
            req.params.issue_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { issue, who, created, status, status_date, reviewed } = req.body
        const issueToUpdate = { issue, who }
        const numberOfValues = Object.values(issueToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either "issue" or "who"!`
                }
            })
        }
        issueToUpdate.created = created;
        issueToUpdate.status = status;
        issueToUpdate.status_date = status_date;
        issueToUpdate.reviewed = reviewed;
        IssuesService.updateIssue(
            req.app.get('db'),
            req.params.issue_id,
            issueToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = issuesRouter;