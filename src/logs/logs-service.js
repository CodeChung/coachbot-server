const LogsService = {
    didUserLog(knex, goalId) {
        // returns Boolean whether user already submitted goal log for today
        return Boolean(this.getTodaysLog(knex, goalId).length)
    },
    getTodaysLog(knex, goalId) {
        return knex('goal_logs')
            .where('goal_id', goalId)
            .where('date', new Date())
            .then(res => res)
    },
    postLog(knex, log) {
        return knex
            .insert(log)
            .into('goal_logs')
            .returning('*')
            .then(res => res[0])
    },
    getAllUserLogs(knex, goalId) {
        return knex('goal_logs')
            .where('goal_id', goalId)
            .orderBy('date','asc')
    }
}

module.exports = LogsService;