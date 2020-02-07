const TodosService = {
    getAllTodos(knex) {
        return knex.select('*').from('todos')
    },
    insertTodo(knex, newTodo) {
        return knex
            .insert(newTodo)
            .into('todos')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('todos').select('*').where('id', id).first()
    },
    deleteTodo(knex, id) {
        return knex('todos')
            .where({ id })
            .delete()
    },
    updateTodo(knex, id, newTodoFields) {
        return knex('todos')
            .where({ id })
            .update(newTodoFields)
    },
};

module.exports = TodosService;