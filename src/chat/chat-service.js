const ChatService = {
    async checkTodayConvo(db, goalId) {
        // checking to see if today's conversation was already added to db
        return db('conversations')
            .select('*')
            .where('goal_id', goalId)
            .where('date', new Date())
            .then(res => res)
    },
    async getConversation(db, goalId) {
        const convo = await this.checkTodayConvo(db, goalId)
        if (!convo.length) {
            db.into('conversations')
                .insert({
                    date: new Date(),
                    goal_id: goalId
                })
                .returning('*')
                .then(res => res[0])
        }
        return convo[0]
    }
}

module.exports = ChatService