const config = require('../config')
const chatUtils = require('./chat-utils')


const CoachService = {
    name(db, id) {
        return chatUtils.getName(db, id)
            
    },
    async getNewChat(db, goalId, userId) {
        const name = await chatUtils.getName(db, userId)
        const goal = await chatUtils.getGoal(db, goalId)
        const duration = await chatUtils.getGoalDuration(db, goalId)

        const messages = [
            `Hey ${name}, Coach here. Don't forget, we have the ${goal} state championship in ${duration} days.`,
            'We stay focused, stay hungry, and keep our eyes on the prize champ.',
            'Are you ready to start practicing?'
         ]
        return {
            messages,
            intent: 'get started'
        }
    }
}

module.exports = CoachService