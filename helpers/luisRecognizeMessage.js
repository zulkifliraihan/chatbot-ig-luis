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
                replyMessage = 'Hi, I’m a bot. What can I help for you?';
                break;
            }

            case 'scholarship': {
                replyMessage = 'Sampoerna University offers different types of Merit Awards ranging from 25% up to 100% .  For more detail, please call 021 520 22 234 xt.7878 or on our hotline on 0821 62 800 800. Or you can simply email us at student.recruitment@sampoernauniversity.ac.id';
                break;
            }

            case 'fee': {
                replyMessage = 'Please go to https://www.sampoernauniversity.ac.id/admissions/tuition-and-fees/'
                break;
            }

            case 'doubledegree': {
                replyMessage = `
                In the first and second year, students will obtain general education curriculum from Broward College and Sampoerna University.
                In the third and fourth year, they will obtain curriculum from University of Arizona and/or Sampoerna University at the same time.
                More information about our major please go to: https://www.sampoernauniversity.ac.id/academics/`
                break;
            }

            case 'admission': {
                replyMessage = `
                Just login to https://www.sampoernauniversity.ac.id/admissions/how-to-apply/ and follow the simple step below:
                - Fill in the online application form
                - Submit scan/copy of your last one year transcript (semester 1&2 report card of your last grade)
                - Pay IDR 500,000 application fee (non-refundable)
                - Schedule your Placement Test
                - Take our English & Math entrance test:
                    a. 1st test - Basic Skill Test (English Reading, Writing, Listening
                    b. 2nd test - Advanced Skill Test (English Reading, Writing, Mathematic)`
                break;
            }

            case 'faculty': {
                replyMessage = `In the Sampoerna University, we have 3 faculty, such as:
                1. Faculty of Business (FoB)
                    - Entrepreneurship
                    - Banking & Finance
                    - Digital Marketing
                    - Accounting
                2. Faculty of Engineering and Technology (FET)
                    - Mechanical Engineering
                    - Industrial Engineering
                    - Visual Communication Design
                    - Computer Science / (Electrical and Computer Engineering)
                    - Information Systems
                3. Faculty of Education (FOE)
                    - English Language Education
                    - Mathematics Education`
                break;
            }

            case 'facilities': {
                replyMessage = `Sampoerna University provides various facilities for all provided programs:
                    - Stock Exchange Corner for Business students wishing to practice trading either on their own or from a scheduled guide
     	            - Library facilities with resources extending to UA Online resource, Broward Online resources, and database providers JSTOR, Emerald, and E-book central
                    - Transfer Guidance counselors at SPAC (Student-Parent Advisory Center) to help and assist students in transferring credits to the US.
                    - Full standard learning facilities such as full ICT facilities, Wi-Fi access, and personal study space.
                    
                    We have the virtual campus tour; you can access it on: https://panomatics.com/virtualtours/in/sampoernauniversity/index.html
                    or if you want to schedule a visit or an appointment please call 021 502 22 234 xt.7878 or on our hotline on 0821 62 800 800.
                    Or you can simply email us at student.recruitment@sampoernauniversity.ac.id`
                break;
            }

            case 'acceptanceperiod': {
                replyMessage = `We have 2 intake, Fall (September) & Spring (January)
                Please call 021 502 22 234 or on our hotline on 0821 62 800 800
                `
                break;
            }

            case 'thanks': {
                replyMessage = 'You’re welcome. I am very happy to help you.'
                break;
            }
    
            default: {
                // Catch all for unhandled intents
                replyMessage = `
                    Sorry, we can't understand what you mean. Can you clarify that again? So far, this bot has covered several topics related to Frequently Asked Questions (FAQ), such as:
                - Scholarship Information
                - Tuition Fee
                - Double Degree Program
                - How to Apply
                - Sampoerna University's Facilities
                - Student Acceptance Period                    
                `;
            }
        }

        return replyMessage;
    }
}

module.exports.luisRecognizeMessage = luisRecognizeMessage;
