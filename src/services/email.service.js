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

async function sendEmailOnSuccessfullTransaction(
  userEmail,
  userName,
  amount,
  toAccount,
  fromAccount,
) {
  const subject = "Transaction Successful - BankTransSys";

  const text = `
                  Dear ${userName},

                  Your transaction has been completed successfully.

                  Transaction Details:
                  - Amount: ₹${amount}
                  - From Account: ${fromAccount}
                  - To Account: ${toAccount}
                  - Status: Successful

                  Thank you for using BankTransSys.

                  If you did not authorize this transaction, please contact support immediately.

                  Regards,
                  BankTransSys Team
               `;

  const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  
                  <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin:0;">Transaction Successful</h2>
                  </div>

                  <div style="padding: 25px;">
                    <p>Hello <strong>${userName}</strong>,</p>

                    <p>Your transaction has been completed successfully.</p>

                    <table style="width:100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding:8px;"><strong>Amount</strong></td>
                        <td style="padding:8px;">₹${amount}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px;"><strong>From Account</strong></td>
                        <td style="padding:8px;">${fromAccount}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px;"><strong>To Account</strong></td>
                        <td style="padding:8px;">${toAccount}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px;"><strong>Status</strong></td>
                        <td style="padding:8px; color: green;"><strong>Successful</strong></td>
                      </tr>
                    </table>

                    <p style="margin-top:20px;">
                      If you did not authorize this transaction, please contact support immediately.
                    </p>

                    <p>
                      Thank you for using <strong>BankTransSys</strong>.
                    </p>
                  </div>

                  <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
                    © ${new Date().getFullYear()} BankTransSys. All rights reserved.
                  </div>

                </div>
              `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendEmailOnFailedTransaction(
  userEmail,
  userName,
  amount,
  toAccount,
  fromAccount,
) {
  const subject = "Transaction Failed - BankTransSys";

  const text = `
                  Dear ${userName},

                  We were unable to process your transaction.

                  Transaction Details:
                  - Amount: ₹${amount}
                  - From Account: ${fromAccount}
                  - To Account: ${toAccount}
                  - Status: Failed

                  Possible reasons:
                  - Insufficient balance
                  - Invalid account details
                  - Temporary banking service issue

                  Please verify the transaction details and try again.

                  Regards,
                  BankTransSys Team
          `;

  const html = `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    
                    <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                      <h2 style="margin:0;">Transaction Failed</h2>
                    </div>

                    <div style="padding: 25px;">
                      <p>Hello <strong>${userName}</strong>,</p>

                      <p>
                        Unfortunately, we were unable to process your transaction.
                      </p>

                      <table style="width:100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding:8px;"><strong>Amount</strong></td>
                          <td style="padding:8px;">₹${amount}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px;"><strong>From Account</strong></td>
                          <td style="padding:8px;">${fromAccount}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px;"><strong>To Account</strong></td>
                          <td style="padding:8px;">${toAccount}</td>
                        </tr>
                        <tr>
                          <td style="padding:8px;"><strong>Status</strong></td>
                          <td style="padding:8px; color: red;"><strong>Failed</strong></td>
                        </tr>
                      </table>

                      <div style="background:#fef2f2; border-left:4px solid #dc2626; padding:12px; margin-top:20px;">
                        <strong>Possible Reasons:</strong>
                        <ul>
                          <li>Insufficient account balance</li>
                          <li>Invalid recipient account details</li>
                          <li>Temporary banking service issue</li>
                        </ul>
                      </div>

                      <p style="margin-top:20px;">
                        Please verify the transaction details and try again.
                      </p>

                      <p>
                        If the issue persists, contact our support team.
                      </p>
                    </div>

                    <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
                      © ${new Date().getFullYear()} BankTransSys. All rights reserved.
                    </div>

                  </div>
          `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendEmailOnRegistration,
  sendEmailOnSuccessfullTransaction,
  sendEmailOnFailedTransaction,
};
