import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({

  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

});


export const sendVerificationEmail = async (
  email: string,
  name: string,
  otp: string
) => {

  await transporter.sendMail({

    from: process.env.EMAIL_FROM,

    to: email,

    subject: "Welcome to Roop Rang - Verify Your Email",

    html: `
      <h2>Hello ${name}</h2>

      <p>Welcome to Roop Rang 🎉</p>

      <p>Your verification OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP is valid for 10 minutes.</p>

      <br/>

      <p>Thank you,<br/>
      Roop Rang Team</p>
    `

  });

};