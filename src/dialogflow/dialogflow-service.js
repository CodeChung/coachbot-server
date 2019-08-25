const dialogflow = require('dialogflow');
const goalCache = require('../middleware/session-handler');
const uuid = require('uuid');
const knex = require('knex');
const GoalService = require('../goals/goals-service');
 
const projectId = process.env.DIALOGFLOW_PROJECT_ID

async function checkForNewGoal(db, goalId) {
  return GoalService.getGoalById(db, goalId)
    .then(goal => !Boolean(goal.last_logged))
}



function getDialogflowCredentials(goalId) {
  const dialogflowCredentials = goalCache.get(`goal-${goalId}`)
  console.log('credentials', dialogflowCredentials)
  const sessionClient = dialogflowCredentials.sessionClient
  const sessionId = dialogflowCredentials.sessionId
  
  return { sessionClient, sessionId }
}

async function sendMsgToDialogflow(db, userId, goalId, msg) {
  const isNewGoal = await checkForNewGoal(db, goalId)
  console.log('newGoal', isNewGoal)

  if (!isNewGoal) {
    return await newGoalDialog(db, userId, goalId)
  }

  console.log('msggggg', msg)

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

async function newGoalDialog(db, userId, goalId) {
  const { sessionClient, sessionId } = getDialogflowCredentials(goalId)
  
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'new goal',
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