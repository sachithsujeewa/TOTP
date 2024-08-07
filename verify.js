// Generate a POST request using Postman
let request = require('request');
const verificationUrl = 'http://localhost:3000/verify';
const totpToken = process.argv[2]; // Get the TOTP token from command line argument

const options = {
    url: verificationUrl,
    method: 'POST',
    body: totpToken,
    chunked: true,
};

request(options, (error, response, body) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Response:', body);
    }
});




