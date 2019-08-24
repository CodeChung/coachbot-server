const dialogflow = require('dialogflow');
const goalCache = require('../middleware/session-handler');
const uuid = require('uuid');
 
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */

 const intents = {

 }

async function sendMsgToDialogflow(userId, goalId, msg) {
  const projectId = process.env.DIALOGFLOW_PROJECT_ID
  console.log(projectId, 'PROJECTID!!!!!!')

  const dialogflowCredentials = goalCache.get(`goal-${goalId}`)
  console.log('credentials', dialogflowCredentials)
  const sessionClient = dialogflowCredentials.sessionClient
  const sessionId = dialogflowCredentials.sessionId
 
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

module.exports = sendMsgToDialogflow