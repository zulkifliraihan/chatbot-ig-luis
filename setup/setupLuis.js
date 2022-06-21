require('dotenv').config();

const { LuisRecognizer } = require('botbuilder-ai');

class SetupLuis {
    // constructor(config) {
    constructor() {
        const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
        const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: LuisAPIHostName };

        const luisIsConfigured = luisConfig && luisConfig.applicationId && luisConfig.endpointKey && luisConfig.endpoint;
        // const luisIsConfigured = config && config.applicationId && config.endpointKey && config.endpoint;
        
        if (luisIsConfigured) {
            // Set the recognizer options depending on which endpoint version you want to use e.g v2 or v3.
            // More details can be found in https://docs.microsoft.com/en-gb/azure/cognitive-services/luis/luis-migration-api-v3
            let recognizerOptions;
            if (process.env.APPENV == "local" || process.env.APPENV == "staging") {
                recognizerOptions = {
                    apiVersion: 'v3',
                    slot: 'staging',
                };
            }
            else {
                recognizerOptions = {
                    apiVersion: 'v3',
                    slot: 'production',
                };
            }

            this.recognizer = new LuisRecognizer(luisConfig, recognizerOptions);
        }
        
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
