const { LuisRecognizer } = require('botbuilder-ai');
const { SetupLuis } = require('../setup/setupLuis');

const luisRecognizer = new SetupLuis();


class luisRecognizeMessage {

    async recognizer(textMessage) {
        
        // Call LUIS and gather any potential intents details. (Note the TurnContext has the response to the prompt)

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

            case 'doubledegree': {
                replyMessage = 'Double degree with Arizona University is available for Faculty of Engineering and Technology: Mechanical Engineering, Industrial Engineering, Computer Science / Electrical Computer Engineering, and Information System / Applied Computing. Then, for Faculty of Business is available only for Management.'
                break;
            }

            case 'admission': {
                replyMessage = 'You can access it on: https://www.sampoernauniversity.ac.id/admissions/how-to-apply-sampoerna-university-now/'
                break;
            }

            case 'faculty': {
                replyMessage = 'In the Sampoerna University, we have 3 faculty, there are Faculty of Engineering and Technology (FET), Faculty of Business (FOB), and Faculty of Education (FOE).'
                break;
            }

            case 'facilities': {
                replyMessage = 'We have the virtual campus tour; you can access it on: https://panomatics.com/virtualtours/in/sampoernauniversity/index.html'
                break;
            }

            case 'acceptanceperiod': {
                replyMessage = 'For the student acceptance period, we have acceptance from date until date. For the information of student acceptance, you can access it on direct to Website or Instagram post'
                break;
            }

            case 'thanks': {
                replyMessage = 'You’re welcome. I am very happy to help you.'
                break;
            }
    
            default: {
                // Catch all for unhandled intents
                replyMessage = `Sorry we can't understand what you mean. Could you clarify again that again?. Or you can access our website for different information https://www.sampoernauniversity.ac.id/`;
            }
        }

        return replyMessage;
    }
}

module.exports.luisRecognizeMessage = luisRecognizeMessage;
