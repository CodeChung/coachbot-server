const LogsService = {
    didUserLog(knex, goalId) {
        // returns Boolean whether user already submitted goal log for today
        return Boolean(this.getTodaysLog(knex, goalId).length)
    },
    getTodaysLog(knex, goalId) {
        let currentDate = new Date()
        currentDate.setUTCHours(0,0,0,0)
        const date = currentDate.toISOString()
        
        return knex('goal_logs')
            .where('goal_id', goalId)
            .where('date', '>=', date)
            .then(res => res)
    },
    createLog(knex, goalId) {
        return knex('goal_logs')
            .insert({ goal_id: goalId })
            .into('goal_logs')
            .returning('*')
            .then(res => res[0])
    },
    postRating(knex, logId, rating) {
        return knex('goal_logs')
            .update({ rating })
            .where({ id: logId })
    },
    getAllUserLogs(knex, goalId) {
        return knex('goal_logs')
            .where('goal_id', goalId)
            .orderBy('date','asc')
    },
    getWeeklyRatings(knex, goalId) {
        return knex('goal_logs')
            .select(knex.raw(`date_trunc('week', date + interval '1 day') - interval '1 day' AS "week" , sum(rating), count('*')`))
            .where('goal_id', goalId)
            .whereRaw(`date > now() + interval '1 day' - interval '12 months'`)
            .groupBy(1)
    },
    getDailyRatings(knex, goalId) {
        return knex('goal_logs')
            .select(knex.raw(`date_trunc('day', date) AS "day", rating`))
            .where('goal_id', goalId)
            .whereRaw(`date > now()- interval '1 month'`)
            .orderBy(1)
    },
    getGoalStats(knex, goalId) {
        return knex('goal_logs')
            .count('*')
            .where('goal_id', goalId)
            .then(res => res[0])
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