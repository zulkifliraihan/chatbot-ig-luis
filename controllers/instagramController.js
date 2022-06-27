require('dotenv').config();

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');
const { withFbnsAndRealtime, withFbns, withRealtime } = require('instagram_mqtt');

const { luisRecognizeMessage } = require('../helpers/luisRecognizeMessage');


const usernameIg = process.env.IG_USERNAME;
const passwordIg = process.env.IG_PASSWORD;
const idIgPrimary = process.env.IG_ID;

const ig = withFbns(new IgApiClient());
ig.state.generateDevice(usernameIg);

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
       let i = 0;
        setInterval(async() => {

            const messageInbox = await ig.feed.directInbox().items();
        
            await Promise.all(messageInbox.map(async (element) => {
                
                const arrDataMessage = element.last_permanent_item;
    
                console.log(arrDataMessage);
                const userIdMessage = arrDataMessage.user_id;
                const textMessage = arrDataMessage.text;
                
                const matchingId = userIdMessage != idIgPrimary;

                if (matchingId) {

                    const resultRecognizeMessage = await new luisRecognizeMessage().recognizer(textMessage);
                    const sendReplyMessage = this.sendMessage(userIdMessage, resultRecognizeMessage);
                    
                }

            }));

            console.log(`Done Interval Part : ${i++}`);

        }, 100000);

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