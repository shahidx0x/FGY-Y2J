const Signup = require("./auth.model");
const jwt = require("jsonwebtoken");
const config = require("../../configs/config");
const logger = require("../../configs/logger");

const crypto = require("crypto");

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
        .json({ message: "User already registered with this email" });
    }

    // Generate a salt using a random value and iterations
    const salt = crypto.randomBytes(16).toString("hex");
    const iterations = 10000; // You can adjust the number of iterations as needed

    // Hash the password using PBKDF2
    const hashBuffer = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      32,
      "sha512"
    );

    // Concatenate the salt and the hash with a delimiter (e.g., ":")
    const passwordHash = `${salt}:${hashBuffer.toString("hex")}`;

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
      password: passwordHash, // Store the concatenated salt and hash in the database
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
      message: "Signup successful",
      status: 200,
      jwt: token,
      data: result,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: 500 });
  }
};
exports.signInUser = async (req, res) => {
  let registered;
  try {
    const { email, password } = req.body;
    registered = await Signup.findOne({ email: email });

    if (registered) {
      const [salt, storedPasswordHash] = registered.password.split(":");
      const iterations = 10000; // Ensure it matches the value used during sign-up

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
        return res.status(200).json({
          message: "signin successful",
          status: 200,
          jwt: token,
          data: registered,
        });
      } else {
        return res.status(400).json({ message: "Wrong password", status: 400 });
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
};
