const Signup = require("./auth.model");
const jwt = require("jsonwebtoken");
const config = require("../../configs/config");
const logger = require("../../configs/logger");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const { Encryption, Decryption } = require("../../utils/Utils");

const authController = {
  createUser: async (req, res) => {
    let token;
    try {
      const {
        email,
        cartNumber,
        company,
        location,
        zipCode,
        firstName,
        lastName,
        subscription,
        paymentMethod,
        cardNumber,
        password,
      } = req.body;

      const existingUser = await Signup.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already registered with this email" });
      }

      const salt = crypto.randomBytes(16).toString("hex");
      const iterations = 10000;

      const hashBuffer = crypto.pbkdf2Sync(
        password,
        salt,
        iterations,
        32,
        "sha512"
      );

      const passwordHash = `${salt}:${hashBuffer.toString("hex")}`;

      const newUser = new Signup({
        cartNumber,
        email,
        company,
        location,
        zipCode,
        firstName,
        lastName,
        subscription,
        paymentMethod,
        cardNumber,
        password: passwordHash,
      });

      const result = await newUser.save();

      if (result) {
        token = jwt.sign(
          { email: result.email, id: result._id },
          config.jwt.secret,
          {
            expiresIn: config.jwt.accessExpire,
          }
        );
      }
      let resultObject = result.toObject();
      delete resultObject.password;
      res.status(200).json({
        message: "Signup successful",
        status: 200,
        jwt: token,
        data: resultObject,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  },

  signInUser: async (req, res) => {
    let registered;
    try {
      const { email, password } = req.body;
      registered = await Signup.findOne({ email: email });

      if (registered) {
        const [salt, storedPasswordHash] = registered.password.split(":");
        const iterations = 10000;

        const hashBuffer = crypto.pbkdf2Sync(
          password,
          salt,
          iterations,
          32,
          "sha512"
        );
        const inputPasswordHash = hashBuffer.toString("hex");

        if (inputPasswordHash === storedPasswordHash) {
          token = jwt.sign(
            { email: registered.email, id: registered._id },
            config.jwt.secret,
            { expiresIn: config.jwt.accessExpire }
          );
          let resultObject = registered.toObject();
          delete resultObject.password;
          return res.status(200).json({
            message: "signin successful",
            status: 200,
            jwt: token,
            data: resultObject,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Wrong password", status: 400 });
        }
      } else {
        return res
          .status(404)
          .json({ message: "User not registered", status: 404 });
      }
    } catch (error) {
      logger.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  },

  forgot_password: async (req, res) => {
    const email = req.params.email;
    try {
      const user = await Signup.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "No user found with that email address" });
      }

      const resetToken = Math.floor(Math.random() * 900000) + 100000;
      const resetExpires = new Date(Date.now() + 5 * 60 * 1000);
      // const hours = Math.floor((resetExpires - Date.now()) / 3600000);
      // const minutes = Math.floor(
      //   ((resetExpires - Date.now()) % 3600000) / 60000
      // );
      // const expiresIn = `${hours} hour(s) and ${minutes} minute(s)`;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      const transporter = nodemailer.createTransport({
        // host: config.email.host,
        service: "Gmail",
        port: 465,
        // secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
      const data = { code: resetToken, time: resetExpires };
      ejs.renderFile(
        path.join(__dirname, "forgot_password.view.ejs"),
        data,
        (err, html) => {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
          } else {
            const mailOptions = {
              to: user.email,
              from: config.email.admin,
              subject: `Password Reset Code : ${resetToken}`,
              html: html,
            };

            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Error sending password reset email" });
              }

              return res
                .status(200)
                .json({ message: "Password reset email sent" });
            });
          }
        }
      );
    } catch (err) {
      logger.error(err);
    }
  },
  send_verify_email: async (req, res) => {
    const email = req.params.email;
    try {
      const user = await Signup.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "No user found with that email address" });
      }
      const resetToken = Math.floor(Math.random() * 900000) + 100000;
      user.resetPasswordToken = resetToken;
      await user.save();
      const transporter = nodemailer.createTransport({
        // host: config.email.host,
        service: "Gmail",
        port: 465,
        // secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
      let cypher = Encryption(`${resetToken}/${email}`);
      const data = {
        link: `http://${config.host}:${config.port}/${cypher}`,
      };
      ejs.renderFile(
        path.join(__dirname, "verify_email.view.ejs"),
        data,
        (err, html) => {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
          } else {
            const mailOptions = {
              to: user.email,
              from: config.email.admin,
              subject: `Verify Your Email`,
              html: html,
            };

            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .json({ message: "Error sending verification email" });
              }

              return res
                .status(200)
                .json({ message: "Verification email sent" });
            });
          }
        }
      );
    } catch (err) {
      logger.error(err);
    }
  },
  verify_email: async (req, res) => {
    const { cypher } = req.params;
    let de_cypher = Decryption(cypher);

    try {
      const user = await Signup.findOne({ email: de_cypher.split("/")[1] });

      if (user.resetPasswordToken === Number(de_cypher.split("/")[0])) {
        fs.readFile(
          path.join(__dirname, "email_var_success.view.html"),
          "utf8",
          (err, data) => {
            if (err) {
              console.error("Error reading the HTML file:", err);
              res.status(500).send("Internal Server Error");
              return;
            }
            res.send(data);
          }
        );
      } else {
        res.status(400).send("Invalid token or email.");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = authController;
