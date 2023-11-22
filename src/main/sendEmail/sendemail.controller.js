const config = require("../../../configs/config");
const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const htmlPdf = require("html-pdf");

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
};
module.exports = send_email_controller;
