require('dotenv').config();
const nodemailer = require('nodemailer');
const { CONSTANTS } = require('../constants/index');
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            rejectUnauthorized: true,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail(
            {
                from: process.env.SMTP_USER,
                to,
                subject: 'Активация аккаунта на ' + process.env.API_URL,
                text: '',
                html: `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
            },
            (err) => {
                if (err) console.log(err.message);
            }
        );
    }
}

module.exports = new MailService();
