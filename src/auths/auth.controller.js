const Signup = require("./auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../configs/config");
const logger = require("../../configs/logger");

exports.createUser = async (req, res) => {
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
    const existingSignup = await Signup.findOne({ email });
    if (existingSignup) {
      return res
        .status(400)
        .json({ message: "user already registered with this email" });
    }
    const passHashed = await bcrypt.hash(password, 7);
    const newSignup = new Signup({
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
      password: passHashed,
    });
    const result = await newSignup.save();
    if (result) {
      token = jwt.sign(
        { email: result.email, id: result._id },
        config.jwt.secret,
        {
          expiresIn: config.jwt.accessExpire,
        }
      );
    }

    res.status(200).json({
      message: "signup successful",
      status: 200,
      jwt: token,
      data: result,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "internal server error", status: 500 });
  }
};

exports.signInUser = async (req, res) => {
  let token;
  try {
    const { email, password } = req.body;
    const resgisterd = await Signup.findOne({ email: email });
    if (resgisterd) {
      const checkPassword = await bcrypt.compare(password, resgisterd.password);
      if (checkPassword) {
        token = jwt.sign(
          { email: resgisterd.email, id: resgisterd._id },
          config.jwt.secret,
          { expiresIn: config.jwt.accessExpire }
        );
        return res.status(200).json({
          message: "signin successful",
          status: 200,
          jwt: token,
          data: resgisterd,
        });
      } else {
        return res.status(400).json({ message: "wrong password", status: 400 });
      }
    } else {
      return res
        .status(404)
        .json({ message: "user not registered", status: 404 });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "internal server error", status: 500 });
  }
};
