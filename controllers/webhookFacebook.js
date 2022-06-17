// Log Console
const { Console } = require("console");
const fs = require("fs");

// make a new logger
const myLogger = new Console({
    stdout: fs.createWriteStream("app.log"),
    stderr: fs.createWriteStream("error.log"),
});

require('dotenv').config();


// let getDataWebhookFacebook = async (req, res, next) => {
//     res.send(400, {
//         status: "OK",
//         message: "success webhook"
//     });

// }

// let verifyWebhookFacebook = async (req, res) => {
//     // Your verify token. Should be a random string.
//     let VERIFY_TOKEN = process.env.FacebookPageAccessToken;

//     // Parse the query params
//     let mode = req.query['hub.mode'];
//     let token = req.query['hub.verify_token'];
//     let challenge = req.query['hub.challenge'];

//     myLogger.log("Input Query : ");
//     myLogger.log(req.query);
//     myLogger.log("Verify Token : ");
//     myLogger.log(VERIFY_TOKEN);

//     // Checks if a token and mode is in the query string of the request
//     if (mode && token) {

//         // Checks the mode and token sent is correct
//         if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
//             // Responds with the challenge token from the request
//             console.log('WEBHOOK_VERIFIED');
//             return challenge;
//             // res.send(200, challenge);

//         } else {
//             // Responds with '403 Forbidden' if verify tokens do not match
//             res.send(403);      
//         }
//     }
// };

let verifyWebhookFacebook = async (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.FacebookVerifyToken;

    // Parse the query params
    let mode = req.query['hub_mode'];
    let token = req.query['hub_verify_token'];
    let challenge = req.query['hub_challenge'];

    myLogger.log("Input Query : ");
    myLogger.log(req.query);
    myLogger.log("Verify Token : ");
    myLogger.log(VERIFY_TOKEN);

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            // res.send(200, challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.send(403);      
        }
    }
}

let getDataWebhookFacebook = async (req, res) => {

    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

        });

        // Return a '200 OK' response to all events
        res.send(200, 'EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.send(404);
    }

}

module.exports = {
    verifyWebhookFacebook: verifyWebhookFacebook,
    getDataWebhookFacebook: getDataWebhookFacebook
};