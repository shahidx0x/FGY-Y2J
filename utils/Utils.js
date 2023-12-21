const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = crypto.createHash("sha256").update("12345").digest();
const iv = crypto.createHash("md5").update("45678").digest();

function Encryption(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function Decryption(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

function getClientIp(req) {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
}

function getUserAgent(req) {
  return req.headers["user-agent"];
}

module.exports = {
  Encryption,
  Decryption,
  getClientIp,
  getUserAgent,
};
