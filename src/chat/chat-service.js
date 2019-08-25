const ChatService = {
    async checkTodayConvo(db, goalId) {
        // checking to see if today's conversation was already added to db
        return db('conversations')
            .select('*')
            .where('goal_id', goalId)
            .where('date', new Date())
            .then(res => res)
    },
    async setupConversation(db, goalId) {
        // returns id, date, goal_id of current conversation
        const convo = await this.checkTodayConvo(db, goalId)
        if (!convo.length) {
            return db.into('conversations')
                .insert({
                    date: new Date(),
                    goal_id: goalId
                })
                .returning('*')
                .then(res => res[0])
        }
        return convo[0]
    },
    async getConversation(db, goalId) {
        const conversation = await this.setupConversation(db, goalId)

        return db('messages')
            .where('convo_id', conversation.id)
            .orderBy('date', 'asc')
            .then(res => res)
    }
}

module.exports = ChatService