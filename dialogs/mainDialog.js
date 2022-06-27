// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory, InputHints } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { luisRecognizeMessage } = require('../helpers/luisRecognizeMessage');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {
    constructor(luisRecognizer) {
        super('MainDialog');

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        // Define the main dialog and its related components.
        // This is a sample "order a pizza" dialog.
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                // this.introStep.bind(this),
                this.actStep.bind(this),
                // this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * First step in the waterfall dialog. Prompts the user for a command.
     * Currently, this expects an order request like, "Order a pepperoni pizza".
     * Note that there's no logic to catch additional pizzas not on the menu. The LUIS app returns
     * the requested pizza type based on the entity found.
     */
    async introStep(stepContext) {
        if (!this.luisRecognizer.isConfigured) {
            const messageText = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(messageText, null, InputHints.IgnoringInput);
            return await stepContext.next();
        }

        const messageText = stepContext.options.restartMsg ? stepContext.options.restartMsg : 'Welcome to Instagram Sampoerna University Bot';
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
    }

    /**
     * Second step in the waterfall.  This will use LUIS to attempt to extract the pizza type.
     * Then, it hands off to the orderDialog child dialog to confirm the order.
     */
    async actStep(stepContext) {

        if (!this.luisRecognizer.isConfigured) {
            // LUIS is not configured, we just run the orderDialog path.
            return await stepContext.beginDialog('error');
        }

        const textMessage = stepContext.context._activity.text;
        
        const resultRecognizeMessage = await new luisRecognizeMessage().recognizer(textMessage);

        await stepContext.context.sendActivity(resultRecognizeMessage, resultRecognizeMessage, InputHints.IgnoringInput);

        return await stepContext.next();
    }

    /**
     * This is the final step in the main waterfall dialog.
     * It wraps up the sample "order a pizza" interaction with a simple confirmation.
     */
    // async finalStep(stepContext) {
    //     // If the order dialog ("orderDialog") was cancelled or the user failed to confirm, the Result here will be null.
    //     if (stepContext.result) {
    //         const result = stepContext.result;
    //         const msg = `I have your order for a ${ result.type } pizza!`;
    //         await stepContext.context.sendActivity(msg, msg, InputHints.IgnoringInput);
    //     }

    //     // Restart the main dialog with a different message the second time around
    //     return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
    // }
}

module.exports.MainDialog = MainDialog;
