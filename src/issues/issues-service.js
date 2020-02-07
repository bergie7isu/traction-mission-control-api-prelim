const IssuesService = {
    getAllIssues(knex) {
        return knex.select('*').from('issues')
    },
    insertIssue(knex, newIssue) {
        return knex
            .insert(newIssue)
            .into('issues')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('issues').select('*').where('id', id).first()
    },
    deleteIssue(knex, id) {
        return knex('issues')
            .where({ id })
            .delete()
    },
    updateIssue(knex, id, newIssueFields) {
        return knex('issues')
            .where({ id })
            .update(newIssueFields)
    },
};

module.exports = IssuesService;