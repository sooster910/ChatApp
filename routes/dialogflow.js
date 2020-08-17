
require("dotenv").config();
const router = require('express').Router();
const dialogflow = require('dialogflow');
const {asyncMiddleware} = require('../utils/async');
const {uuid} = require('uuidv4');



const projectId = process.env.googleProjectID;
console.log('projectId',projectId)
// const sessionId = process.env.dialogFlowSessionID;
const sessionId= uuid();
const langCode = 'en-US';
console.log(process.env.credentialsFilePath)
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    projectId,
    keyFilename:'/Users/hyunsujoo/Downloads/jobbot-ciex-88138f0df1d0.json',
  });
  console.log(sessionClient);
const sessionPath = sessionClient.sessionPath(projectId,sessionId);

// //text query route
router.post('/textquery', asyncMiddleware(async(req,res)=>{

  const query = req.body.text;
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode:langCode,
      },
    },
  }; 
 
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  // console.log(`Query: ${result.queryText}`);
  // console.log(`Response: ${result.fulfillmentText}`);
  // if (result.intent) {
  //   console.log(`Intent: ${result.intent.displayName}`);
  // } else {
  //   console.log(`  No intent matched.`);
  // }
  console.log('result',result);
  res.send(result);

}))


//event query route


module.exports = router;