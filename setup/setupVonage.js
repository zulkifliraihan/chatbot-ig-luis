require('dotenv').config();

const Vonage = require('@vonage/server-sdk');

class setupVonage {
    constructor(env) {
    
        if (process.env.APPENV == "production") {

            this.credentialsVonage = new Vonage({
                apiKey: env.VONAGE_API_KEY,
                apiSecret: env.VONAGE_API_SECRET,
                applicationId: env.VONAGE_APPLICATION_ID,
                privateKey: env.VONAGE_APPLICATION_PRIVATE_KEY_PATH
            });
            
        } else {
            
            this.credentialsVonage = new Vonage({
                apiKey: env.VONAGE_API_KEY,
                apiSecret: env.VONAGE_API_SECRET,
                applicationId: env.VONAGE_APPLICATION_ID,
                privateKey: env.VONAGE_APPLICATION_PRIVATE_KEY_PATH
            }, {
                apiHost: 'https://messages-sandbox.nexmo.com'
            });
        }

    }

    get isConfiguredVonage() {
        return this.credentialsVonage;
    }
}

module.exports.setupVonage = setupVonage;