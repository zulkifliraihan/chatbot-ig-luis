require('dotenv').config();

// Vonage
const Vonage = require('@vonage/server-sdk');
const MessengerText = require('@vonage/server-sdk/lib/Messages/MessengerText');

const { setupVonage } = require('../setup/setupVonage');

const { luisRecognizeMessage } = require('../helpers/luisRecognizeMessage');

const credentialsVonage = new setupVonage(process.env).isConfiguredVonage;

const vonageInboundMessage = async (req, res) => {

    console.log('Inbound : ');
    console.log(req.body);

    const fromId = req.body.from;
    const toId = req.body.to;
    const messageType = req.body.message_type;
    const channel = req.body.channel;
    const receiveMessage = req.body.text;
    
    let replyMessage;
    
    // Vonage.Message
    if (channel == "messenger") {

        replyMessage = `Sorry we can't understand what you mean. Could you clarify again that again?. Or you can access our website for different information https://www.sampoernauniversity.ac.id/`;

        if (messageType == "text") {
            replyMessage = await new luisRecognizeMessage().recognizer(textMessage);

            credentialsVonage.messages.send(
                new MessengerText(
                    replyMessage, // This is the message
                    fromId, // This is for the receive message 
                    toId, // This is for the sender message
                ),
                (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(data.message_uuid);
                    }
                }
            );
        }
        else {
            credentialsVonage.messages.send(
                new MessengerText(
                    replyMessage,
                    req.body.from,
                    req.body.to,
                ),
                (err, data) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log(data.message_uuid);
                    }
                }
            );
        }

    }

    res.send('ok');
};

const vonageStatusMessage = (req, res) => {
    console.log('Status : ');
    console.log(req.body);
    res.send('ok');
}

module.exports = {
    vonageInboundMessage: vonageInboundMessage,
    vonageStatusMessage: vonageStatusMessage,
};

