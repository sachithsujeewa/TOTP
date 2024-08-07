const otplib = require('otplib');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const path = require('path');


// Secret for TOTP generation
const secret = otplib.authenticator.generateSecret();  

// Generate TOTP
const token = otplib.authenticator.generate(secret);  

// Display TOTP
console.log('Generated TOTP:', token);

// Generate a QR code for easier scanning by an authenticator app
const otpauth = otplib.authenticator.keyuri('user@example.com', 'YourAppName', secret);
qrcode.toDataURL(otpauth, (err, imageUrl) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
console.log('QR code image URL:', imageUrl);

// Create an HTML page to display the QR code image
const html = `
<!DOCTYPE html>
<html>
<head>
    <title>QR Code</title>
</head>
<body>
    <img src="${imageUrl}" alt="QR Code">
</body>
</html>
`;

// Save the HTML page to a file
const htmlPath = path.join(__dirname, 'qrcode.html');
fs.writeFile(htmlPath, html, (err) => {
    if (err) {
        console.error('Error saving HTML file:', err);
        return;
    }
    console.log('HTML file saved:', htmlPath);
});
});


// Create a server to handle the verification process
http.createServer((req, res) => {
    if (req.url === '/verify') {
        // Get the submitted TOTP token from the request body
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const submittedToken = body.trim();

            // Verify the submitted TOTP token
            const isValid = otplib.authenticator.check(submittedToken, secret);

            // Send the verification result as the response
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(isValid ? 'Verification successful' : 'Verification failed');
        });

    } else {
        // Serve the QR code image
        const htmlPath = path.join(__dirname, 'qrcode.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
}).listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

