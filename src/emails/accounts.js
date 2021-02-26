const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'siddharthpatel177@gmail.com',
        subject : 'Thanks for joining in',
        text : `Welcome to task manager App ${name}. Let me know how you get along with the app :)`
    })
}

const sendDeletionMail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'siddharthpatel177@gmail.com',
        subject : 'Thanks for joining. See you next time',
        text : `Hope you had fun. See you next time :)`
    })
}


module.exports = {
    sendWelcomeMail,
    sendDeletionMail
}