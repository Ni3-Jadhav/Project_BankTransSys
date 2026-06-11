const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BankTransSys Project" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendEmailOnRegistration(userEmail, userName) {
  const subject = "Welcome to BankTransSys - Account Created Successfully";

  const text = `
                    Dear ${userName},

                    Welcome to BankTransSys!

                    Your account has been successfully created and is now ready to use.

                    You can securely manage your transactions, track account activity, and access banking services through our platform.

                    For your security:
                    - Never share your password with anyone.
                    - Use a strong and unique password.
                    - Contact support immediately if you notice any suspicious activity.

                    If you have any questions, feel free to reach out to our support team.

                    Thank you for choosing BankTransSys.

                    Regards,
                    BankTransSys Team
                `;

  const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    
                    <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">BankTransSys</h1>
                    </div>

                    <div style="padding: 30px;">
                    <h2>Hello ${userName},</h2>

                    <p>
                        Welcome to <strong>BankTransSys</strong>! Your account has been
                        successfully created.
                    </p>

                    <p>
                        You can now securely manage your transactions, monitor account activity,
                        and access banking features through our platform.
                    </p>

                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Security Tips</h3>
                        <ul>
                        <li>Never share your password with anyone.</li>
                        <li>Use a strong and unique password.</li>
                        <li>Keep your account information confidential.</li>
                        <li>Report suspicious activity immediately.</li>
                        </ul>
                    </div>

                    <p>
                        If you need assistance, our support team is always available to help.
                    </p>

                    <p>
                        Thank you for choosing BankTransSys.
                    </p>

                    <p>
                        Best Regards,<br />
                        <strong>BankTransSys Team</strong>
                    </p>
                    </div>

                    <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                    © ${new Date().getFullYear()} BankTransSys. All rights reserved.
                    </div>

                </div>
               `;

  await sendEmail(userEmail, subject, text, html);
}
module.exports = {
  sendEmailOnRegistration,
};
