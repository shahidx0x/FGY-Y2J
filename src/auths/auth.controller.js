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
  checkSession: async (req, res) => {
    res.status(200).json({ status: 200, message: "session is valid" });
  },
  createUser: async (req, res) => {
    let accessToken, refreshToken;

    try {
      const { email, password, firebaseFCM } = req.body;

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
        ...req.body,
        password: passwordHash,
      });

      const result = await newUser.save();

      if (result) {
        accessToken = jwt.sign(
          { email: result.email, id: result._id, fcm: firebaseFCM },
          config.jwt.secret,
          {
            expiresIn: config.jwt.accessExpire,
          }
        );

        // refreshToken = jwt.sign(
        //   { email: registered.email, id: registered._id },
        //   config.refressToken.secret,
        //   { expiresIn: config.refressToken.accessExpire }
        // );

        // result.refreshToken = refreshToken;
        // await result.save();
      }

      let resultObject = result.toObject();
      delete resultObject.password;
      delete resultObject.cardNumber;
      // delete resultObject.refreshToken;

      res.status(200).json({
        message: "Signup successful",
        status: 200,
        jwt: accessToken,
        data: resultObject,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  },
  updateUser: async (req, res) => {
    try {
      const fieldsToUpdate = [
        "cartNumber",
        "role",
        "company",
        "location",
        "zipCode",
        "firstName",
        "lastName",
        "subscription",
        "paymentMethod",
        "profilePicture",
        "phoneNumber",
        "cardNumber",
        "isAccountActive",
        "firebaseFCM",
      ];

      const { email, password } = req.body;
      const userToUpdate = await Signup.findOne({ email });
      if (!userToUpdate) {
        return res
          .status(404)
          .json({ message: "User not found with this email" });
      }

      fieldsToUpdate.forEach((field) => {
        if (field in req.body) {
          userToUpdate[field] = req.body[field];
        }
      });

      if (password) {
        const salt = crypto.randomBytes(16).toString("hex");
        const iterations = 10000;
        const hashBuffer = crypto.pbkdf2Sync(
          password,
          salt,
          iterations,
          32,
          "sha512"
        );
        userToUpdate.password = `${salt}:${hashBuffer.toString("hex")}`;
      }

      const result = await userToUpdate.save();

      let resultObject = result.toObject();
      delete resultObject.password;
      delete resultObject.cardNumber;

      res.status(200).json({
        message: "User updated successfully",
        status: 200,
        data: resultObject,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Internal server error", status: 500 });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const totalUsers = await Signup.countDocuments();
      const users = await Signup.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalAdmin = await Signup.find({ role: "admin" });
      const total_page = Math.ceil(totalUsers / limit);

      res.status(200).json({
        status: 200,
        meta: {
          total_user: totalUsers,
          total_admin: totalAdmin.length,
          total_page: total_page,
          current_page: page,
          per_page: limit,
        },
        data: users,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  },
  getUserByEmail: async (req, res) => {
    try {
      const user = await Signup.findOne({ email: req.query.email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  },
  signInUser: async (req, res) => {
    let registered;
    let accessToken, refreshToken;
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
          accessToken = jwt.sign(
            { email: registered.email, id: registered._id },
            config.jwt.secret,
            { expiresIn: config.jwt.accessExpire }
          );

          refreshToken = jwt.sign(
            { email: registered.email, id: registered._id },
            config.refressToken.secret,
            { expiresIn: config.refressToken.accessExpire }
          );

          registered.refreshToken = refreshToken;
          await registered.save();

          let resultObject = registered.toObject();
          delete resultObject.password;
          delete resultObject.refreshToken;
          return res.status(200).json({
            message: "signin successful",
            status: 200,
            jwt: accessToken,
            refreshToken,
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
      const hours = Math.floor((resetExpires - Date.now()) / 3600000);
      const minutes = Math.floor(
        ((resetExpires - Date.now()) % 3600000) / 60000
      );
      const expiresIn = `${hours} hour(s) and ${minutes} minute(s)`;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: config.email.host,
        // service: "hotmail",
        port: 465,
        secure: true,
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
              // from: config.email.user,
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
  verify_otp: async (req, res) => {
    const { email, token } = req.body;
    try {
      const user = await Signup.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ msg: "No user found with that email address" });
      }
      if (user.resetPasswordToken === token) {
        user.resetPasswordToken = 0;
        user.resetPasswordExpires = 0;
        await user.save();
        res.status(200).json({ message: "otp varified" });
      } else if (user.resetPasswordToken === 0) {
        res
          .status(404)
          .json({ message: "otp already been used or invalid otp" });
      }
      res.status(404).json({ message: "invalid otp" });
    } catch (error) {}
  },
  send_verification_email: async (req, res) => {
    const { email } = req.body;
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
        host: config.email.host,
        // service: "hotmail",
        port: 465,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
      let cypher = Encryption(`${resetToken}/${email}`);
      const data = {
        link: `${config.domain}/verify/email/${cypher}`,
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
              // from: config.email.user,
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
      console.log(err);
    }
  },
  verify_email: async (req, res) => {
    const { cypher } = req.params;
    const de_cypher = Decryption(cypher);
    const email = de_cypher.split("/")[1];
    const token = Number(de_cypher.split("/")[0]);
    const user = await Signup.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No user found with that email address" });
    }

    try {
      const user = await Signup.findOne({ email: email });

      if (user.resetPasswordToken === token) {
        user.resetPasswordToken = 0;
        user.isEmailVerified = true;
        await user.save();
        fs.readFile(
          path.join(__dirname, "email_var_success.view.html"),
          "utf8",
          (err, data) => {
            if (err) {
              res.status(500).json({ message: "internal server error", err });
              return;
            }
            res.send(data);
          }
        );
      } else if (user.isEmailVerified === true) {
        res.status(200).send({ message: "email already verified" });
      } else {
        res.status(400).json({ message: "invalid token or url" });
      }
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  },
  verify_refresh_token: async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(400).send("Refresh token is required");

    try {
      const decoded = jwt.verify(refreshToken, config.refressToken.secret);
      const user = await Signup.findOne({ refreshToken: refreshToken });
      if (!user)
        return res
          .status(401)
          .json({ status: 401, message: "Invalid refresh token" });
      const accessToken = jwt.sign({ id: decoded.id }, config.jwt.secret, {
        expiresIn: config.jwt.accessExpire,
      });
      res.json({
        message: "jwt token generated successfully",
        status: 200,
        jwt: accessToken,
      });
    } catch (error) {
      res.status(401).json({ status: 401, message: "Invalid refresh token" });
    }
  },
  gen_invoice: async (req, res) => {
    try {
      const transporter = nodemailer.createTransport({
        host: config.email.host,
        // service: "hotmail",
        port: 465,
        secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
      const data = { companyName: "shahid" };
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
              // from: config.email.user,
              subject: `Invoice Mail From FGY-Y2J`,
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
    } catch (err) {}
  },
  resetPassword: async (req, res) => {
    try {
      const { email } = req.query;
      const { password } = req.query;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await Signup.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
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
      const hashedPassword = `${salt}:${hashBuffer.toString("hex")}`;

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset Password Error: ", error);
      return res.status(500).json({ message: "Error resetting password" });
    }
  },
};

module.exports = authController;
