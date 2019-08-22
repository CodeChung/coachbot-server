const GoalsService = {
    getGoalById(db, goalId) {
        return db
            .from('goals')
            .select('*')
            .where('id', goalId)
    },
    getAllGoals(db, userId) {
        return db
            .from('goals')
            .select(
                'title',
                'id',
                'schedule',
                'duration',
            )
            .where('user_id', userId)
    },
    insertGoal(db, goal) {
        return db
            .insert(goal)
            .into('goals')
            .returning('*')
            .then(res => {
                return this.getAllGoals(db, goal.user_id)
            })
    },
    deleteGoal(db, goalId) {
        return db('goals')
            .where('id', goalId)
            .delete()
    }
}

module.exports = GoalsService