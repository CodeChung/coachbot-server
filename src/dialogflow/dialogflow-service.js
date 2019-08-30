const goalCache = require('../middleware/session-handler');
const GoalService = require('../goals/goals-service');
const LogsService = require('../logs/logs-service');
 
const projectId = process.env.DIALOGFLOW_PROJECT_ID

async function checkForNewGoal(db, goalId) {
  return GoalService.getGoalById(db, goalId)
    .then(goal => !Boolean(goal.last_logged))
}

async function createLog(db, goalId) {
  LogsService.createLog(db, goalId)
}

async function checkTodayGoalLog(db, goalId) {
  // this function checks whether today's goal has already been put in database
  return LogsService.getTodaysLog(db, goalId)
    .then(res => {
      if (!res.length) {
        createLog(db, goalId)
      }

      const log = res[0]
      return Boolean(log.notes && log.rating)
    })
}

async function getCurrentLogId(db, goalId) {
  return LogsService.getTodaysLog(db, goalId)
    .then(res => res[0].id)
}

async function logRating(db, logId, rating) {
  if (Number.isInteger(rating)) {
    return LogsService.postRating(db, logId, rating)
  }
}

function getDialogflowCredentials(goalId) {
  const dialogflowCredentials = goalCache.get(`goal-${goalId}`)
  const sessionClient = dialogflowCredentials.sessionClient
  const sessionId = dialogflowCredentials.sessionId
  
  return { sessionClient, sessionId }
}

async function sendMsgToDialogflow(db, userId, goalId, msg) {
  const isNewGoal = await checkForNewGoal(db, goalId)
  const todayLog = await checkTodayGoalLog(db, goalId)
  const logId = await getCurrentLogId(db, goalId)

  if (!isNewGoal) {
    return await newGoalDialog(db, userId, goalId)
  }

  if (todayLog) {
    return `Hey champ, you've already logged a goal in today, check back tomorrow`
  }

  const { sessionClient, sessionId } = getDialogflowCredentials(goalId)
  
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);


  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
  
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(result)
  if (result.intent) {
    const intent = result.intent.displayName
    if (intent === 'dialogflow_logging - yes - select.number') {
      const rating = parseInt(result.queryText)
      logRating(db, logId, rating)
    }
  } else {
  }
  return result.fulfillmentText
}

async function newGoalDialog(db, userId, goalId) {
  const { sessionClient, sessionId } = getDialogflowCredentials(goalId)
  
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'coachbot put that goal in',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
  
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  return result.fulfillmentText
}

module.exports = sendMsgToDialogflow