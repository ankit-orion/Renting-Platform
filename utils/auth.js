const nodemailer = require('nodemailer');


export async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Define the email options
    const mailOptions = {
        from:{
            name : 'OTP VERIFICATION',
            address : process.env.USER
        },
        to: to,
        subject: subject ,
        html: text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // testing fork and pull request
}




