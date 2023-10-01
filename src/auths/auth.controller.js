const Signup = require("./auth.model");
const jwt = require("jsonwebtoken");
const config = require("../../configs/config");
const logger = require("../../configs/logger");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

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
      const resetExpires = Date.now() + 3600000;
      const hours = Math.floor((resetExpires - Date.now()) / 3600000);
      const minutes = Math.floor(
        ((resetExpires - Date.now()) % 3600000) / 60000
      );
      const expiresIn = `${hours} hour(s) and ${minutes} minute(s)`;

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
      const data = { code: resetToken, time: expiresIn };
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
              subject: `Email Verification Code : ${resetToken}`,
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
};

module.exports = authController;
