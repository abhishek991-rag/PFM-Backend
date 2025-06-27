// server/utils/emailService.js
// const nodemailer = require('nodemailer'); // Agar aap email send karna chahte hain toh Nodemailer install karein: npm install nodemailer

const sendEmail = async (options) => {
    // --- Nodemailer setup (example) ---
    // const transporter = nodemailer.createTransport({
    //     host: process.env.SMTP_HOST,
    //     port: process.env.SMTP_PORT,
    //     secure: process.env.SMTP_PORT == 465 ? true : false, // true for 465, false for other ports
    //     auth: {
    //         user: process.env.SMTP_USER,
    //         pass: process.env.PASSWORD_KEY,
    //     },
    // });

    // const mailOptions = {
    //     from: `<span class="math-inline">\{process\.env\.FROM\_NAME\} <</span>{process.env.FROM_EMAIL}>`,
    //     to: options.email,
    //     subject: options.subject,
    //     html: options.message,
    // };

    // await transporter.sendMail(mailOptions);
    // --- End Nodemailer setup ---

    // Abhi ke liye, hum sirf console par log karenge
    console.log(`
    --- EMAIL SENT ---
    To: ${options.email}
    Subject: ${options.subject}
    Message: ${options.message}
    ------------------
    `);

    // Real production environment mein, aapko Nodemailer setup ko uncomment karna hoga
    // aur .env mein SMTP details add karni hongi.
};

module.exports = sendEmail;