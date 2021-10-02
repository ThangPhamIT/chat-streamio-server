import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import chalk from 'chalk';
import twilio from 'twilio';

// config
config();
const app = express();
const port = process.env.SERVER_PORT || 9000;

// twilio 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
import authRoute from './routes/auth';

// set the view engine to ejs
// app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Express' });
});

// middleware router
app.use('/auth', authRoute);

// app.post('/', (req, res) => {
//     const { message, user: sender, type, members } = req.body;

//     if (type === 'message.new') {
//         members
//             .filter((member) => member.user_id !== sender.id)
//             .forEach(({ user }) => {
//                 if (!user.online) {
//                     twilioClient.messages.create({
//                         body: `You have a new message from ${message.user.fullName} - ${message.text}`,
//                         messagingServiceSid: messagingServiceSid,
//                         to: user.phoneNumber
//                     })
//                     .then(() => console.log('Message sent!'))
//                     .catch((err) => console.log(err));
//                 }
//             })

//         return res.status(200).send('Message sent!');
//     }

//     return res.status(200).send('Not a new message request');
// });

app.listen(port, err => {
    if (err) {
        console.log(chalk.red(err.message));
    } else {
        console.log(chalk.greenBright(`Server is listening on port: ${port}`));
    }
});