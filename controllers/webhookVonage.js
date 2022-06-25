require('dotenv').config();

// Vonage
const Vonage = require('@vonage/server-sdk');
const MessengerText = require('@vonage/server-sdk/lib/Messages/MessengerText');

const { setupVonage } = require('../setup/setupVonage');
const { LuisRecognizer } = require('botbuilder-ai');
const { SetupLuis } = require('../setup/setupLuis');

const luisRecognizer = new SetupLuis();

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
            const luisResult = await luisRecognizer.executeLuisQuery(receiveMessage);
            
            const luisTopIntent = LuisRecognizer.topIntent(luisResult);

            switch (luisTopIntent) {
            
                case 'greetings': {
                    replyMessage = 'Hi, I’m a bot. What can I help for you?';
                    break;
                }
    
                case 'scholarship': {
                    replyMessage = 'Sorry, we already close our scholarship in this year. Don’t forget to follow our Instagram to get the newest information from us. Thank you!';
                    break;
                }
    
                case 'fee': {
                    replyMessage = 'For the enrollment fee is 20 million rupiah, or you access the information at https://www.sampoernauniversity.ac.id/admissions/tuition-and-fees/'
                    break;
                }
    
                case 'program': {
                    replyMessage = 'Double degree with Arizona University is available for Faculty of Engineering and Technology: Mechanical Engineering, Industrial Engineering, Computer Science / Electrical Computer Engineering, and Information System / Applied Computing. Then, for Faculty of Business is available only for Management.'
                    break;
                }
    
                case 'apply': {
                    replyMessage = 'You can access it on: https://www.sampoernauniversity.ac.id/admissions/how-to-apply-sampoerna-university-now/'
                    break;
                }
                case 'facilities': {
                    replyMessage = 'We have the virtual campus tour; you can access it on: https://panomatics.com/virtualtours/in/sampoernauniversity/index.html'
                    break;
                }
        
                default: {
                    // Catch all for unhandled intents
                    replyMessage = `Sorry we can't understand what you mean. Could you clarify again that again?. Or you can access our website for different information https://www.sampoernauniversity.ac.id/`;
                    break;
                }
            }

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

