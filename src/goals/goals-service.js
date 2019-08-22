const GoalsService = {
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
            .then(res => console.log('goal', res))
    } 
}

module.exports = GoalsService