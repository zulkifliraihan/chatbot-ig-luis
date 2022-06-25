// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required packages
const path = require('path');

// Note: Ensure you have a .env file and include LuisAppId, LuisAPIKey and LuisAPIHostName.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Restify
const restify = require('restify');

// Vonage
// const { vonageInboundMessage, vonageStatusMessage } = require('./controllers/webhookVonage');

// const Vonage = require('@vonage/server-sdk');
// const MessengerText = require('@vonage/server-sdk/lib/Messages/MessengerText');

// const credentialsVonage = new Vonage({
//     apiKey: process.env.VONAGE_API_KEY,
//     apiSecret: process.env.VONAGE_API_SECRET,
//     applicationId: process.env.VONAGE_APPLICATION_ID,
//     privateKey: process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH
// }, {
//     apiHost: 'https://messages-sandbox.nexmo.com'
// });

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    ConversationState,
    createBotFrameworkAuthenticationFromConfiguration,
    InputHints,
    MemoryStorage,
    UserState
} = require('botbuilder');

const { SetupLuis } = require('./setup/setupLuis');

// This bot's main dialog.
const { DialogAndWelcomeBot } = require('./bots/dialogAndWelcomeBot');
const { MainDialog } = require('./dialogs/mainDialog');

// Webhooks Facebook Controller 
const { verifyWebhookFacebook, getDataWebhookFacebook } = require('./controllers/webhookFacebook');

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    let onTurnErrorMessage = 'The bot encountered an error or bug.';
    await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
    onTurnErrorMessage = 'To continue to run this bot, please fix the bot source code.';
    await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
    // Clear out state
    await conversationState.delete(context);
};

// Set the onTurnError for the singleton CloudAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Define a state store for your bot. See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state store to persist the dialog and user state between messages.

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// If configured, pass in the SetupLuis.  (Defining it externally allows it to be mocked for tests)
// const { LuisAppId, LuisAPIKey, LuisAPIHostName } = process.env;
// const luisConfig = { applicationId: LuisAppId, endpointKey: LuisAPIKey, endpoint: LuisAPIHostName };

// const luisRecognizer = new SetupLuis(luisConfig);
const luisRecognizer = new SetupLuis();

// Create the main dialog.
const dialog = new MainDialog(luisRecognizer);
const bot = new DialogAndWelcomeBot(conversationState, userState, dialog);

// Create HTTP server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.listen(process.env.port || process.env.PORT || 3898, function() {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

server.get('/',  async (req, res, next) =>  {
    res.send({
        status: "OK",
        message: "success",
    });
    return next();
});

// Listen for incoming activities and route them to your bot main dialog.
server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing
    await adapter.process(req, res, (context) => bot.run(context));
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', async (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);

    // Set onTurnError for the CloudAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;

    await streamingAdapter.process(req, socket, head, (context) => bot.run(context));
});


// Webhook for Facebook
server.get('/webhook', verifyWebhookFacebook);

server.post('/webhook', getDataWebhookFacebook);


// Vonage

// server.post('/vonage/inbound', vonageInboundMessage)
// server.post('/vonage/status', vonageStatusMessage)

// server.post('/vonage/inbound', (req, res) => {
//     console.log('Inbound : ');
//     console.log(req.body);

//     const fromId = req.body.from;
//     const toId = req.body.to;
//     const messageType = req.body.message_type;
//     const channel = req.body.channel;

//     // Vonage.Message
//     if (channel == "messenger") {
        
//         if (messageType == "text") {
//             credentialsVonage.messages.send(
//                 new MessengerText(
//                     'Hallo Cantik :)', // This is the message
//                     fromId, // This is for the receive message 
//                     toId, // This is for the sender message
//                 ),
//                 (err, data) => {
//                     if (err) {
//                         console.error(err);
//                     } else {
//                         console.log(data.message_uuid);
//                     }
//                 }
//             );
//         }
//         else {
//             credentialsVonage.messages.send(
//                 new MessengerText(
//                     'Hallo Cantik :)',
//                     req.body.from,
//                     req.body.to,
//                 ),
//                 (err, data) => {
//                     if (err) {
//                         console.error(err);
//                     } else {
//                         // console.log(data.message_uuid);
//                     }
//                 }
//             );
//         }

//     }

//     res.send('ok');

// });

// server.post('/vonage/status', (req, res) => {
//     console.log('Status : ');
//     console.log(req.body);
//     res.send('ok');
// });

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');
const { withFbnsAndRealtime, withFbns, withRealtime } = require('instagram_mqtt');

// Instagram Private API

server.get('/package/instagram-private-api', async (req, res) => {
    const ig = new IgApiClient();

    const usernameIg= '2022lulus';
    const passwordIg= 'Shafana22';

    ig.state.generateDevice(usernameIg);

    await ig.simulate.preLoginFlow();

    const loggedInUser = await ig.account.login(usernameIg, passwordIg);
    const messageInbox = await ig.feed.directInbox().items();
    const unread = messageInbox.filter( message => message.read_state > 0 );
        
    messageInbox.forEach(element => {
        
        console.log("Message Inbox");
        console.log(element.last_permanent_item);
    });

    // console.log(loggedInUser);
    // console.log(await ig.feed.directInbox().items());

    // unread.forEach( (message) => {
    //     console.log(`ThreadID: ${message.thread_id}`);
        
    //     // let date = moment(Number(message.last_permanent_item.timestamp) / 1000);

    //     console.log(`Conversation with: ${message.thread_title}`);
    //     // console.log(`Received at: ${date}`);
    //     console.log(`Message: ${message.last_permanent_item.text}`);

    // });

    res.send('ok');

});

server.get('/package/instagram-private-api-sendmessage', async (req, res) => {
    const ig = new IgApiClient();

    const usernameIg= '2022lulus';
    const passwordIg= 'Shafana22';

    ig.state.generateDevice(usernameIg);

    await ig.simulate.preLoginFlow();
    
    const loggedInUser = await ig.account.login(usernameIg, passwordIg);
    console.log(loggedInUser);
    // setInterval(async() => {
        process.nextTick(async () => await ig.simulate.postLoginFlow());
        const userId = 1608525449;
        const thread = ig.entity.directThread([userId.toString()]);
        await thread.broadcastText('Message from node');

    // }, 7000);

    res.send('ok');

});

server.get('/package/instagram-private-api-v2', async (req, res) => {
    var PrivateAPI = require('instagram-private-api');
    var server = PrivateAPI.ProxyServer;

    const usernameIg= '2022lulus';
    const passwordIg= 'Shafana22';

    server.run({
        port: 8080,
        socketPort: 8888,
        host: "0.0.0.0",
        databaseDir: './databases',
        cookiesDir: './cookies'
    });
    
    // this will run socket server 8888
    
    var ClientProxy = PrivateAPI.ProxyClient.V1;
    var server = new ClientProxy.Server('0.0.0.0', '8080', '8888');
    var session = new ClientProxy.Session(server);
    
    session.create(usernameIg, passwordIg)
        .then(function(session) {
             ClientProxy.Thread.subscribeAll(session, function(thread){
                   // this -> socket connection
                   console.log(thread, "thread change")
              })
        });

    res.send('ok');

});

const { InstagramController } = require('./controllers/instagramController');

new InstagramController();

// const ig = new IgApiClient();
const ig = withFbns(new IgApiClient());
const usernameIg= '2022lulus';
const passwordIg= 'Shafanea22';

// (async () => {
//     ig.state.generateDevice(usernameIg);
//     // Execute all requests prior to authorization in the real Android application
//     // Not required but recommended
//     // await ig.simulate.preLoginFlow();
//     const loggedInUser = await ig.account.login(usernameIg, passwordIg);
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
//     // ig.realtime.on('receive', (topic, messages) => console.log('receive', topic, messages));
//     // console.log(loggedInUser);
// })();


// function logEvent(name) {
//     // (data) => {
//     //     console.log(data.message)
//     // }
//     return (data) => {
//         // const theMessage = data.message
//         const theMessage = data.message.match(/:\s*([^:]+)$/);
//         console.log(theMessage[1], data)
//     };
// }

