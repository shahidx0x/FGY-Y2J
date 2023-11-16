const invoiceController = {
  gen_invoice: async (req, res) => {
    const email = req.params.email;
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
      const data = { code: resetToken, time: resetExpires };
      ejs.renderFile(path.join(__dirname, "invoice.ejs"), data, (err, html) => {
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
      });
    } catch (err) {}
  },
};

module.exports = invoiceController;
