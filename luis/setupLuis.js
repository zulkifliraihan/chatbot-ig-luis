
const { LuisRecognizer } = require('botbuilder-ai');

class SetupLuis {
    constructor(config) {
        const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        if (luisIsConfigured) {
            // Set the recognizer options depending on which endpoint version you want to use e.g v2 or v3.
            // More details can be found in https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/luis-migration-api-v3
            const recognizerOptions = {
                apiVersion: 'v3',
                slot: 'staging',
            };

            // console.log("SetupLuis recognizerOptions" + recognizerOptions)
            this.recognizer = new LuisRecognizer(config, recognizerOptions);
        }
        
        console.log("SetupLuis Config" + config)
        console.log("SetupLuis luisIsConfigured" + luisIsConfigured)
    }

    get isConfigured() {
        return (this.recognizer !== undefined);
    }

    /**
     * Returns an object with preformatted LUIS results for the bot's dialogs to consume.
     * @param {TurnContext} context
     */
    async executeLuisQuery(context) {
        return await this.recognizer.recognize(context);
    }
}

module.exports.SetupLuis = SetupLuis;
