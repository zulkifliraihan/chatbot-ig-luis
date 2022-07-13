const { LuisRecognizer } = require('botbuilder-ai');
const { SetupLuis } = require('../setup/setupLuis');

const luisRecognizer = new SetupLuis();


class luisRecognizeMessage {

    async recognizer(textMessage) {
        
        console.log("The Message :  ", textMessage);

        // Call LUIS and gather any potential intents details. (Note the TurnContext has the response to the prompt)
        const luisResult = await luisRecognizer.executeLuisQuery(textMessage);

        console.log("Luis Result : " , luisResult);
        
        const luisTopIntent = LuisRecognizer.topIntent(luisResult);
        console.log("Luis Top Intent : " , luisTopIntent);
        
        let replyMessage = `Sorry we can't understand what you mean. Could you clarify again that again?. Or you can access our website for different information https://www.sampoernauniversity.ac.id/`;

        switch (luisTopIntent) {
            
            case 'greetings': {
                replyMessage = 'Hi, my name is Jasmine. I’m Bot AI. What can I help for you?';
                break;
            }

            case 'scholarship': {
                replyMessage = 'STT Terpadu Nurul FIkri offers different types of Scholarship up to 100% .  For more detail, please call 021-786.3191 or on our whatsapp on 0857-1624-3174. Or you can simply email us at info@nurulfikri.ac.id';
                break;
            }

            case 'fee': {
                replyMessage = 'Please go to https://nurulfikri.ac.id/penerimaan-mahasiswa-baru/ for information fee about study'
                break;
            }

            case 'admission': {
                replyMessage = `Just login to https://admisi.nurulfikri.ac.id/ and follow the simple step below:
- Pay IDR 300,000 application fee (non-refundable)
- Fill in the online application form
- Submit scan/copy of your last one year transcript (semester 1-7 report card of your last grade)
- Take our English & Math entrance test`
                break;
            }

            case 'faculty': {
                replyMessage = `In the STT Terpadu Nurul Fikri, we have 3 faculty, such as:
- Bisnis Digital
- Sistem Informasi
- Teknik Informatika`
                break;
            }

            case 'facilities': {
                replyMessage = `
                STT Terpadu Nurul Fikri provides various facilities for all provided programs:
- Auditorium
- Musholla B2 
- Library
- Full standard learning facilities such as full ICT facilities, Wi-Fi access, and personal study space.

if you want to schedule a visit or an appointment please call 021-786.3191 or on our whatsapp on 0857-1624-3174.
Or you can simply email us at info@nurulfikri.ac.id`
                break;
            }

            case 'acceptanceperiod': {
                replyMessage = `We acceptance period on September
Please call 021-786.3191 or on our whatsapp on 0857-1624-3174.
                `
                break;
            }

            case 'thanks': {
                replyMessage = 'You’re welcome. I am very happy to help you. Sayonara. See you'
                break;
            }
    
            default: {
                // Catch all for unhandled intents
                replyMessage = `Sorry, we cannot understand what you mean. Can you clarify that again? So far, this bot has covered several topics related to Frequently Asked Questions (FAQ), such as:    
- Scholarship Information
- Tuition Fee
- How to Apply
- STT Terpadu Nurul Fikri Facilities
- Student Acceptance Period                 
                `;
            }
        }

        return replyMessage;
    }
}

module.exports.luisRecognizeMessage = luisRecognizeMessage;
