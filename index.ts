const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
const port = 3020
const cors = require('cors')
const bodyParser = require('body-parser')
const appPassword = 'sidlzikxswmfqqpd';

let allowlist = ['http://localhost:3000', 'http://localhost:3020']
let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true, credentials: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let smtp_login = process.env.SMTP_LOGIN || '---';
let smtp_password = process.env.SMTP_PASSWORD || '---';


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: "dimakurgan123789@gmail.com",
        pass: appPassword
    }
});

app.get('/', cors(corsOptionsDelegate), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for an allowed domain.'})
})


app.post('/send-message',cors(corsOptionsDelegate), async (req, res) => {

    let {message, email, name} = req.body;

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'dimakurgan123789@gmail.com', // sender address
        to: "dimakurgan123789987@gmail.com", // list of receivers
        subject: "Offer to work", // Subject line
        text: "I am sending messages", // plain text body
        html: `<div>
                    <div><b>${message}</b></div>
                    <div>Hr name:${name}</div>
                    <div>contscts:{<b>${email}</b>}</div>

                </div>`, // html body
    });
    res.send(req.body);

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

