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
    },
    getWeeklyRatings(knex, goalId) {
        return knex('goal_logs')
            .select(knex.raw(`date_trunc('week', date + interval '1 day') - interval '1 day' AS "Week" , sum(rating), count('*')`))
            .where('goal_id', goalId)
            .whereRaw(`date > now() + interval '1 day' - interval '12 months'`)
            .groupBy(1)
    },
    getDailyRatings(knex, goalId) {
        return knex('goal_logs')
            .select(knex.raw(`date_trunc('day', date), rating`))
            .where('goal_id', goalId)
            .whereRaw(`date > now()- interval '1 month'`)
            .orderBy(1)
    }

}

/*
Weekly Ratings:
    SELECT date_trunc('week', date + interval '1 day') - interval '1 day' AS "Week" , sum(rating), count('*')
    FROM goal_logs
    WHERE date > now() + interval '1 day' - interval '12 months' 
    GROUP BY 1
    ORDER BY 1;

Daily Ratings:
    SELECT date_trunc('day', date), rating
    FROM goal_logs
    WHERE date > now()- interval '1 month' 
    ORDER BY 1 ASC;
*/

module.exports = LogsService;