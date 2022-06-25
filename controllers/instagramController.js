require('dotenv').config();

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');
const { withFbnsAndRealtime, withFbns, withRealtime } = require('instagram_mqtt');

const { LuisRecognizer } = require('botbuilder-ai');
const { SetupLuis } = require('../setup/setupLuis');

const luisRecognizer = new SetupLuis();

const usernameIg = process.env.IG_USERNAME;
const passwordIg = process.env.IG_PASSWORD;
const idIgPrimary = process.env.IG_ID;

const ig = withFbns(new IgApiClient());
ig.state.generateDevice(usernameIg);

// (async () => {
//     const loggedInUser = await ig.account.login(usernameIg, passwordIg);
//     console.log(loggedInUser)
// })();

class InstagramController {
    constructor() {
        this.initialize();
    }
    
    async initialize() {
        await this.login();
        await this.messageInbox();
        this.webhook()
    }

    async login() {
        const loggedInUser = await ig.account.login(usernameIg, passwordIg);
    }

   async messageInbox() {
        setInterval(async() => {

            const messageInbox = await ig.feed.directInbox().items();
        
            await Promise.all(messageInbox.map(async (element) => {
                
                const arrDataMessage = element.last_permanent_item;
    
                const userIdMessage = arrDataMessage.user_id;
                const textMessage = arrDataMessage.text;

                const matchingId = userIdMessage != idIgPrimary;

                if (matchingId) {

                    const resultRecognizeMessage = await this.recognizeMessageLuis(textMessage);
                    const sendReplyMessage = this.sendMessage(userIdMessage, resultRecognizeMessage);
                    
                }

            }));

        }, 10000);

    }

    async recognizeMessageLuis (textMessage = "Hallo") {
        const luisResult = await luisRecognizer.executeLuisQuery(textMessage);

        const luisTopIntent = LuisRecognizer.topIntent(luisResult);
        
        let replyMessage = `Sorry we can't understand what you mean. Could you clarify again that again?. Or you can access our website for different information https://www.sampoernauniversity.ac.id/`;

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

        // console.log(replyMessage, textMessage);
        return replyMessage;

    }

    async sendMessage (userIdMessage, textMessage) {
        console.log(userIdMessage, textMessage);
        const thread = ig.entity.directThread([userIdMessage.toString()]);
        await thread.broadcastText(textMessage);
    }

    async webhook() { 

        ig.fbns.on('push', this.logEvent('push'));
    
        let i = 0;
        ig.fbns.on('auth', async auth => {
    
            if (i != 0) {
                this.logEvent('auth')(auth); 
            }
            i++;

        });
    
        await ig.fbns.connect();
    }

    logEvent(name) {
        return async (data) => {
            const theMessage = data.message.match(/:\s*([^:]+)$/);
            const textMessage= theMessage[1];

            const userIdMessage = data.sourceUserId;

            const matchingId = userIdMessage != idIgPrimary;

            if (matchingId) {

                const resultRecognizeMessage = await this.recognizeMessageLuis(textMessage);
                console.log(resultRecognizeMessage);
                const sendReplyMessage = this.sendMessage(userIdMessage, resultRecognizeMessage);
                
            }

        };
    }
}

module.exports.InstagramController = InstagramController;

// const webhook = async () => {
//     const loggedInUser = await ig.account.login(usernameIg, passwordIg);
//     console.log(loggedInUser);
//     ig.fbns.on('push', logEvent('push'));
    
//     let i = 0;
//     ig.fbns.on('auth', async auth => {
//         // logs the auth

//         if (i != 0) {
//             const logEvent = logEvent('auth')(auth); 
//         }
//         i++;
//         // console.log("Return Function On IF: ");
//         // console.log(auth);


//         //saves the auth
//         // loggedInUser; 
//     });

//     await ig.fbns.connect();

//     function logEvent(name) {
    
//         return (data) => {
//             // const theMessage = data.message
//             const theMessage = data.message.match(/:\s*([^:]+)$/);
//             console.log(theMessage[1], data)
//         };
//     }
// }

// module.exports.webhook = webhook;