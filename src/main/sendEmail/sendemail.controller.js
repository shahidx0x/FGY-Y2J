const config = require("../../../configs/config");
const nodemailer = require("nodemailer");

const send_email_controller = {
  new_user_registration_mail: async (req, res) => {
    const { name, user_email, address, contact, company } = req.body;
    const email = config.email.user;
    try {
      const user = {
        email: email,
      };

      const transporter = nodemailer.createTransport({
        host: config.server_email.host,
        port: 465,
        secure: true,
        auth: {
          user: config.server_email.user,
          pass: config.server_email.password,
        },
      });

      const mailOptions = {
        to: user.email,
        from: config.server_email.user,
        subject: `New User Registration Notification`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>New User Registration Notification</title>
            <style>
              body {
                font-family: "Arial", sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
              }
        
              .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
        
              h1 {
                color: #333;
              }
        
              p {
                color: #555;
              }
        
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>New User Registration Notification</h1>
              <p>
                Hello Admin, A new user has registered on our platform. Here are the
                details:
              </p>
        
              <ul style="list-style: none; padding: 0">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${user_email}</li>
                <li><strong>User Address:</strong> ${address}</li>
                <li><strong>User Contact:</strong> ${contact}</li>
                <li><strong>Registerd Company:</strong> ${company}</li>
             
               
              </ul>
        
              <p>Please review the registration from dashbord</p>
              <p>Internal Mail From FGY-Y2J</p>
            </div>
          </body>
        </html>
    
                    `,
      };
      transporter.sendMail(mailOptions, (mailErr) => {
        if (mailErr) {
          console.error(mailErr);
          return res
            .status(500)
            .json({ message: "Error sending status email" });
        }
        return res
          .status(200)
          .json({ message: "Status email sent successfully" });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  user_accept_reject_email: async (req, res) => {
    const status = req.params.status;
    const email = req.params.email;

    try {
      const user = {
        email: email,
      };

      const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: 465,
        secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      let subject, message;

      if (status === "accept") {
        subject = "Account Accepted";
      } else if (status === "reject") {
        subject = "Account Rejected";
      } else {
        return res.status(400).json({ message: "Invalid status parameter" });
      }

      const mailOptions = {
        to: user.email,
        from: config.email.user,
        subject: subject,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Notification</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              text-align: center;
            }
        
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            h1 {
              color: #333;
            }
        
            p {
              color: #555;
            }
        
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
            }
        
            .accept {
              background-color: #28a745;
            }
        
            .reject {
              background-color: #dc3545;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Email Notification</h1>
            <p>Hello User,</p>
        
            <p>
              Your account status has been updated. Here are the details:
            </p>
        
            <div class="message">
              <p class="status-message">Status: 
                <span class="status ${
                  status === "accept" ? "accept" : "reject"
                }">${status}</span>
              </p>
              <p class="details">
                ${
                  status === "accept"
                    ? "Congratulations! Your account has been accepted. You can now log in."
                    : "We regret to inform you that your account has been rejected. Please contact support for further assistance."
                }
              </p>
            </div>
        
            <p>If you have any questions or concerns, please contact our support team.</p>
        
            <p>Best regards,<br> The Platform Team</p>
          </div>
        </body>
        </html>
        
        `,
      };

      transporter.sendMail(mailOptions, (mailErr) => {
        if (mailErr) {
          console.error(mailErr);
          return res
            .status(500)
            .json({ message: "Error sending status email" });
        }
        return res
          .status(200)
          .json({ message: "Status email sent successfully" });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  send_admin_information: async (req, res) => {
    try {
      const { email, password } = req.body;

      const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: 465,
        secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      const mailOptions = {
        to: email,
        from: config.email.user,
        subject: "Admin Account Created",
        html: `
          <p>Your admin account has been created successfully. Here are your login credentials:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>You can now use these credentials to log in to your admin account.</p>
          <p>Best regards,<br>The Admin Team</p>
        `,
      };

      transporter.sendMail(mailOptions, (mailErr) => {
        if (mailErr) {
          console.error(mailErr);
          return res.status(500).json({ message: "Error sending email" });
        }
        return res
          .status(200)
          .json({ message: "Email sent with admin credentials." });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  send_user_pending_email: async (req, res) => {
    try {
      const email = req.params.email;
      const name = req.params.name;

      const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: 465,
        secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      const mailOptions = {
        to: email,
        from: config.email.user,
        subject: "Registration Successful",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Registration Successful</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              text-align: center;
            }
        
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            h1 {
              color: #333;
            }
        
            p {
              color: #555;
            }
        
            .signature {
              margin-top: 20px;
              color: #888;
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <h1>Registration Successful</h1>
            <p>
              Hello ${name}, your registration on our platform was successful.
              Please wait for admin confirmation. You will receive another email
              once your account is confirmed.
            </p>
        
            <p class="signature">Best regards,<br>FGY-Y2J Team</p>
          </div>
        </body>
        
        </html>
        
        `,
      };

      transporter.sendMail(mailOptions, (mailErr) => {
        if (mailErr) {
          console.error(mailErr);
          return res.status(500).json({ message: "Error sending email" });
        }
        return res.status(200).json({ message: "Email sent to user." });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
module.exports = send_email_controller;
