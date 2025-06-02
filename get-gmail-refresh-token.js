const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  '971369038189-ggs5j4058cco4lp4qod2vb20t3kg9sc7.apps.googleusercontent.com',
  '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',
  'http://localhost'
);

const SCOPES = ['https://mail.google.com/'];

const url = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this url:', url);

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question('Enter the code from that page here: ', (code) => {
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('Your refresh token:', token.refresh_token);
    readline.close();
  });
}); 