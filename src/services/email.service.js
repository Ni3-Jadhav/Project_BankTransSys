const net = require("net");

const socket = net.createConnection(587, "smtp.gmail.com");

socket.on("connect", () => {
  console.log("Connected to Gmail SMTP");
  socket.end();
});

socket.on("error", (err) => {
  console.error(err);
});

socket.setTimeout(10000);

socket.on("timeout", () => {
  console.log("Timeout");
  socket.destroy();
});


const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

dns.lookup("smtp.gmail.com", { all: true }, (err, addresses) => {
  console.log(addresses);
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
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
  updatedBalance,
) {
  const subject = "Transaction Successful - BankTransSys";

  const text = `
                  Dear ${userName},

                  Your transaction has been completed successfully.

                  Transaction Details:
                  - Amount: ₹${amount}
                  - From Account: ${fromAccount}
                  - To Account: ${toAccount}
                  - Updated Balance: ₹${updatedBalance}
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
                        <td style="padding:8px;"><strong>Updated Balance</strong></td>
                        <td style="padding:8px;">₹${updatedBalance}</td>
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

async function sendEmailOnLogin(userEmail, userName) {
  const subject = "Security Alert: Login Successful - BankTransSys";

  const text = `
                  Dear ${userName},

                  Your BankTransSys account was accessed successfully.

                  If this login was performed by you, no action is required.

                  If you do not recognize this activity, please reset your password immediately and contact support.

                  Thank you,
                  BankTransSys Security Team
               `;

  const html = `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                      <h2>Login Successful</h2>
                    </div>

                    <div style="padding: 25px;">
                      <p>Hello <strong>${userName}</strong>,</p>

                      <p>Your BankTransSys account was accessed successfully.</p>

                      <div style="background: #eff6ff; padding: 15px; border-left: 4px solid #2563eb;">
                        <strong>Status:</strong> Login Successful
                      </div>

                      <p style="margin-top:20px;">
                        If this login was performed by you, no action is required.
                      </p>

                      <p>
                        If you do not recognize this activity, please reset your password immediately and contact support.
                      </p>

                      <p>
                        Regards,<br>
                        <strong>BankTransSys Security Team</strong>
                      </p>
                    </div>
                  </div>
                `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendEmailOnFailedLogin(userEmail, userName) {
  const subject = "Security Alert: Failed Login Attempt - BankTransSys";

  const text = `
                  Dear ${userName},

                  We detected a failed login attempt on your BankTransSys account.

                  If this was you, please verify your credentials and try again.

                  If this was not you, someone may be attempting to access your account.

                  We recommend:
                  - Resetting your password.
                  - Using a strong password.
                  - Contacting support if suspicious activity continues.

                  Regards,
                  BankTransSys Security Team
                `;

  const html = `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
                      <h2>Failed Login Attempt Detected</h2>
                    </div>

                    <div style="padding: 25px;">
                      <p>Hello <strong>${userName}</strong>,</p>

                      <p>We detected a failed login attempt on your account.</p>

                      <div style="background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626;">
                        <strong>Status:</strong> Failed Login Attempt
                      </div>

                      <p style="margin-top:20px;">
                        If this was you, please verify your credentials and try again.
                      </p>

                      <p>
                        If this was not you, someone may be attempting to access your account.
                      </p>

                      <ul>
                        <li>Reset your password.</li>
                        <li>Use a strong password.</li>
                        <li>Contact support if suspicious activity continues.</li>
                      </ul>

                      <p>
                        Regards,<br>
                        <strong>BankTransSys Security Team</strong>
                      </p>
                    </div>
                  </div>
                `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendEmailOnLogout(userEmail, userName) {
  const subject = "Logout Confirmation - BankTransSys";

  const text = `
                  Dear ${userName},

                  You have successfully logged out of your BankTransSys account.

                  If you initiated this logout, no further action is required.

                  If you did not perform this action, please log in immediately and change your password.

                  Thank you for using BankTransSys.

                  Regards,
                  BankTransSys Team
                `;

  const html = `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <div style="background-color: #6b7280; color: white; padding: 20px; text-align: center;">
                      <h2>Logout Confirmation</h2>
                    </div>

                    <div style="padding: 25px;">
                      <p>Hello <strong>${userName}</strong>,</p>

                      <p>You have successfully logged out of your BankTransSys account.</p>

                      <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #6b7280;">
                        <strong>Status:</strong> Logged Out Successfully
                      </div>

                      <p style="margin-top:20px;">
                        If you initiated this logout, no further action is required.
                      </p>

                      <p>
                        If you did not perform this action, please log in immediately and update your password.
                      </p>

                      <p>
                        Thank you for using BankTransSys.
                      </p>

                      <p>
                        Regards,<br>
                        <strong>BankTransSys Team</strong>
                      </p>
                    </div>
                  </div>
                `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendEmailOnRegistration,
  sendEmailOnSuccessfullTransaction,
  sendEmailOnFailedTransaction,
  sendEmailOnLogin,
  sendEmailOnFailedLogin,
  sendEmailOnLogout,
};
