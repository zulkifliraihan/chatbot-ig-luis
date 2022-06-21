// // Vonage
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

// class webhookVonage {

//     vonageInboundMessage = (req, res) => {
    
//         console.log('Inbound : ');
//         console.log(req.body);
    
//         const fromId = req.body.from;
//         const toId = req.body.to;
//         const messageType = req.body.message_type;
//         const channel = req.body.channel;
    
//         // Vonage.Message
//         if (channel == "messenger") {
            
//             if (messageType == "text") {
//                 credentialsVonage.messages.send(
//                     new MessengerText(
//                         'Hallo Cantik :)', // This is the message
//                         fromId, // This is for the receive message 
//                         toId, // This is for the sender message
//                     ),
//                     (err, data) => {
//                         if (err) {
//                             console.error(err);
//                         } else {
//                             console.log(data.message_uuid);
//                         }
//                     }
//                 );
//             }
//             else {
//                 credentialsVonage.messages.send(
//                     new MessengerText(
//                         'Hallo Cantik :)',
//                         req.body.from,
//                         req.body.to,
//                     ),
//                     (err, data) => {
//                         if (err) {
//                             console.error(err);
//                         } else {
//                             // console.log(data.message_uuid);
//                         }
//                     }
//                 );
//             }
    
//         }
    
//         res.send('ok');
//     };

//     vonageStatusMessage = (req, res) => {
//         console.log('Status : ');
//         console.log(req.body);
//         res.send('ok');
//     }
// }

// module.exports.webhookVonage = webhookVonage;

