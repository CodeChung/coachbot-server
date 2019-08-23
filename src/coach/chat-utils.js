const chatUtils = {
    // returns json name
    async getName(knex, userId) {
        return knex('users')
            .where('id', userId)
            .select('name')
            .then(res => res[0].name)
    },
    async getGoal(knex, goalId) {
        return knex('goals')
            .where('id', goalId)
            .select('title')
            .then(res => res[0].title)
    },
    async getGoalDuration(knex, goalId) {
        return knex('goals')
            .where('id', goalId)
            .select('duration')
            .then(res => res[0].duration)
    }

}

module.exports = chatUtils