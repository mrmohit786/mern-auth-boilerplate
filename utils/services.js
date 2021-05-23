const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// mail service
exports.mailService = async mailOptions => {
  try {
    // create oAuth client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // set google client refresh token in auth client
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    // generate access token
    const accessToken = await oAuth2Client.getAccessToken();

    // create nodemailer transport
    const transport = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        type: process.env.NODEMAILER_AUTH_TYPE,
        user: process.env.EMAIL_FROM,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        accessToken: accessToken.token,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send transport promise
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    return false;
  }
};
