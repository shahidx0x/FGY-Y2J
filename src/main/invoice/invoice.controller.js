const config = require("../../../configs/config");
const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const htmlPdf = require("html-pdf");

const invoiceController = {
  gen_invoice: async (req, res) => {
    const email = req.params.email;
    const info = req.body;

    const items = info.rowData.items.map((item) => ({
      name: item.product_name,
      quantity: item.product_quantity,
      price: item.product_price,
    }));
    let dateTimeString = info.rowData.createdAt;
    let date = new Date(dateTimeString);

    let formattedDate = date.toLocaleDateString();
    let formattedTime = date.toLocaleTimeString();

    try {
      // Demo user data
      const user = {
        email: email,
        name: info.rowData.user_name,
      };

      // Demo invoice data
      const invoiceData = {
        companyName: "FGY-Y2J",
        companyAddress: "South New York,New Iceland,USA",
        invoiceNumber: info.rowData._id,
        createdDate: formattedDate + " " + formattedTime,
        dueDate: info.rowData.pickup_time || "Not Provided",
        clientName: user.name,
        clientEmail: user.email,
        clientAddress: info.rowData.user_address,
        items: items,
        total: info.rowData.totalCost,
      };
      let htmlInvoice = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  font-size: 10px;
              }
              .container {
                  width: 100%;
                  margin: 0 auto;
                  padding: 20px;
                  box-sizing: border-box;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid black;
                  padding: 5px;
              }
              th {
                  background-color: #f2f2f2;
              }
              .total {
                  text-align: right;
                  margin-top: 20px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Invoice</h1>
                  <p><strong>${invoiceData.companyName}</strong></p>
                  <p>${invoiceData.companyAddress}</p>
              </div>
      
              <p>Invoice Number: ${invoiceData.invoiceNumber}</p>
              <p>Date: ${invoiceData.createdDate}</p>
              <p>Due Date: ${invoiceData.dueDate}</p>
              <p>Client Name: ${invoiceData.clientName}</p>
              <p>Client Email: ${invoiceData.clientEmail}</p>
              <p>Client Address: ${invoiceData.clientAddress}</p>
      
              <table>
                  <thead>
                      <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                      </tr>
                  </thead>
                  <tbody>`;

      invoiceData.items.forEach((item) => {
        htmlInvoice += `
                      <tr>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td>$${item.price.toFixed(2)}</td>
                      </tr>`;
      });

      htmlInvoice += `
                  </tbody>
              </table>
      
              <div class="total">
                  <p><strong>Total:</strong> $${invoiceData.total.toFixed(
                    2
                  )}</p>
              </div>
          </div>
      </body>
      </html>`;

      const transporter = nodemailer.createTransport({
        host: config.email.host,
        port: 465,
        secure: true,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });

      const pdfPath = "./invoice.pdf";
      console.log(pdfPath);
      const pdfOptions = {
        format: "Letter",
        border: {
          top: "0.5in",
          right: "0.5in",
          bottom: "0.5in",
          left: "0.5in",
        },
      };
      htmlPdf
        .create(htmlInvoice, pdfOptions)
        .toFile(pdfPath, (pdfErr, pdfRes) => {
          if (pdfErr) {
            console.error(pdfErr);
            return res.status(500).json({ msg: "Error creating PDF" });
          } else {
            const mailOptions = {
              to: user.email,
              from: config.email.admin,
              subject: `Invoice Mail From FGY-Y2J`,
              html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8" />
                        <meta http-equiv="x-ua-compatible" content="ie=edge" />
                        <title>Password Reset</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <style type="text/css">
                        /**
                     * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
                     */
                        @media screen {
                            @font-face {
                            font-family: "Source Sans Pro";
                            font-style: normal;
                            font-weight: 400;
                            src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
                                url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                                format("woff");
                            }

                            @font-face {
                            font-family: "Source Sans Pro";
                            font-style: normal;
                            font-weight: 700;
                            src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                                url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                                format("woff");
                            }
                        }

                        body,
                        table,
                        td,
                        a {
                            -ms-text-size-adjust: 100%;
                            /* 1 */
                            -webkit-text-size-adjust: 100%;
                            /* 2 */
                        }

                        /**
                     * Remove extra space added to tables and cells in Outlook.
                     */
                        table,
                        td {
                            mso-table-rspace: 0pt;
                            mso-table-lspace: 0pt;
                        }

                        /**
                     * Better fluid images in Internet Explorer.
                     */
                        img {
                            -ms-interpolation-mode: bicubic;
                        }

                        div[style*="margin: 16px 0;"] {
                            margin: 0 !important;
                        }

                        body {
                            width: 100% !important;
                            height: 100% !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }

                        table {
                            border-collapse: collapse !important;
                        }

                        a {
                            color: #1a82e2;
                        }

                        img {
                            height: auto;
                            line-height: 100%;
                            text-decoration: none;
                            border: 0;
                            outline: none;
                        }
                        </style>
                    </head>

                    <body style="background-color: #e9ecef">
                        <!-- start preheader -->
                        <div
                        class="preheader"
                        style="
                            display: none;
                            max-width: 0;
                            max-height: 0;
                            overflow: hidden;
                            font-size: 1px;
                            line-height: 1px;
                            color: #fff;
                            opacity: 0;
                        "
                        ></div>
                        <!-- end preheader -->

                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" bgcolor="#e9ecef">
                            <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="max-width: 600px"
                            >
                                <tr>
                                <td
                                    align="left"
                                    bgcolor="#ffffff"
                                    style="
                                    padding: 36px 24px 0;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    border-top: 3px solid #d4dadf;
                                    "
                                >
                                    <h1
                                    style="
                                        margin: 0;
                                        font-size: 32px;
                                        font-weight: 700;
                                        letter-spacing: -1px;
                                        line-height: 48px;
                                    "
                                    >
                                    Order Information
                                    </h1>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" bgcolor="#e9ecef">
                            <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="max-width: 600px"
                            >
                                <!-- start copy -->
                                <tr>
                                <td
                                    align="left"
                                    bgcolor="#ffffff"
                                    style="
                                    padding: 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                    "
                                >
                                    <p style="margin: 0">
                                    You are receiving this email because your order has been updated to the folowing status :
                                    </p>
                                    <p style="margin-top: 10">

                                    </p>
                                </td>
                                </tr>
                                <tr>
                                <td align="left" bgcolor="#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" bgcolor="#ffffff" style="padding: 12px">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                            <td
                                                align="center"
                                                bgcolor="#1a82e2"
                                                style="border-radius: 6px"
                                            >
                                                <div
                                                style="
                                                    display: inline-block;
                                                    padding: 16px 36px;
                                                    font-family: 'Source Sans Pro', Helvetica, Arial,
                                                    sans-serif;
                                                    font-size: 16px;
                                                    color: #ffffff;
                                                    text-decoration: none;
                                                    border-radius: 6px;
                                                "
                                                >
                                                ${"Approved"}
                                                </div>
                                            </td>
                                            </tr>

                                        </table>
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>

                                <tr>
                                <td
                                    align="left"
                                    bgcolor="#ffffff"
                                    style="
                                    padding: 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                    "
                                >
                                    <p style="margin: 0">

                                    </p>
                                </td>
                                </tr>

                                <tr>
                                <td
                                    align="left"
                                    bgcolor="#ffffff"
                                    style="
                                    padding: 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 16px;
                                    line-height: 24px;
                                    border-bottom: 3px solid #d4dadf;
                                    "
                                >
                                    <p style="margin: 0">
                                    Cheers,<br />
                                    FGI-Y2J
                                    </p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" bgcolor="#e9ecef" style="padding: 24px">
                            <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="max-width: 600px"
                            >
                                <tr>
                                <td
                                    align="center"
                                    bgcolor="#e9ecef"
                                    style="
                                    padding: 12px 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 14px;
                                    line-height: 20px;
                                    color: #666;
                                    "
                                >
                                    <p style="margin: 0">

                                    </p>
                                </td>
                                </tr>
                                <tr>
                                <td
                                    align="center"
                                    bgcolor="#e9ecef"
                                    style="
                                    padding: 12px 24px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                    font-size: 14px;
                                    line-height: 20px;
                                    color: #666;
                                    "
                                >
                                    <p style="margin: 0">
                                    To stop receiving these emails, you can
                                    <a>unsubscribe</a>
                                    at any time.
                                    </p>
                                    <p style="margin: 0"></p>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </body>
                    </html>

                    `,
              attachments: [
                {
                  filename: "invoice.pdf",
                  path: pdfPath,
                },
              ],
            };
            transporter.sendMail(mailOptions, (mailErr) => {
              if (mailErr) {
                console.error(mailErr);
                return res
                  .status(500)
                  .json({ message: "Error sending invoice email" });
              }
              return res
                .status(200)
                .json({ message: "Invoice email sent successfully" });
            });
          }
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  order_status: async (req, res) => {
    const email = req.query.email;
    const status = req.query.status;
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

      const mailOptions = {
        to: user.email,
        from: config.email.admin,
        subject: `Order Status Mail`,
        html: `
      
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Order Status Update</title>
    <style>
      body {
        font-family: "Arial", sans-serif;
        background-color: #f7f7f7;
        margin: 0;
        padding: 0;
        text-align: center;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
        color: #333;
      }

      p {
        font-size: 16px;
        color: #555;
        line-height: 1.5;
      }

      .status-badge {
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #fff;
        border-radius: 5px;
        margin-top: 20px;
      }

      .status-accept {
        background-color: #28a745;
      }

      .status-reject {
        background-color: #dc3545;
      }

      .signature {
        margin-top: 30px;
        border-top: 1px solid #ddd;
        padding-top: 20px;
        font-size: 14px;
        color: #777;
      }

      .unsubscribe {
        color: #3498db;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>Order Status Update</h1>
      <p>Thank you for your order. Your order status has been updated:</p>

      <div
        class="status-badge"
        style="background-color: ${
          status === "pending"
            ? "#28a745"
            : status === "cancled"
            ? "#dc3545"
            : ""
        }"
      >
        ${
          status === "accept"
            ? "Accepted"
            : status === "reject"
            ? "Rejected"
            : ""
        }
      </div>

      <div class="signature">
        <p>Best regards,<br />FGY-Y2J</p>
      </div>
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

module.exports = invoiceController;
