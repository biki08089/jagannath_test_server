const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
require("dotenv").config();

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const sendMail = async (doc) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tour and Travels Details</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 95%;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1, h3 {
                color: #2c3e50;
                text-align: center;
            }
            table {
                width: 100%;
                margin-bottom: 20px;
                border-collapse: collapse;
                position: relative;
            }
            th, td {
                padding: 8px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }
            th {
                background-color: #f3f3f3;
            }
            .terms {
                margin-top: 20px;
            }
            .terms h4 {
                margin-bottom: 5px;
            }
            .terms p {
                font-weight: 300;
            }
            .confirmImg {
                width: 150px;
                height: auto;
                object-fit: contain;
                transform: rotate(-10deg);
                position: absolute;
                top: 4rem;
                right: 2rem;
                z-index: 1;
            }
            .customer-details {
                position: relative;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Tour and Travel Details</h1>
            <h3>Welcome to "Jagannath Tour and Travel", Mr/Mrs. ${
              doc.customerDetails.name
            }</h3>
            <p>We are delighted to create your booking with us. Below are your travel details:</p>

            <div class="customer-details">
                <table>
                    <tr>
                        <th colspan="2">Customer Details</th>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>${doc.customerDetails.name}</td>
                    </tr>
                    <tr>
                        <td>Age</td>
                        <td>${doc.customerDetails.age}</td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>${doc.customerDetails.phone}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>${doc.customerDetails.email}</td>
                    </tr>
                    <tr>
                        <td>From</td>
                        <td>${doc.customerDetails.from}</td>
                    </tr>
                    <tr>
                        <td>To</td>
                        <td>${doc.customerDetails.to}</td>
                    </tr>
                    <tr>
                        <td>Start Date</td>
                        <td>${new Date(
                          doc.customerDetails.startDate
                        ).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>End Date</td>
                        <td>${new Date(
                          doc.customerDetails.endDate
                        ).toLocaleDateString()}</td>
                    </tr>
                </table>
            </div>

            <table>
                <tr>
                    <th colspan="2">Price Details</th>
                </tr>
                <tr>
                    <td>Price</td>
                    <td>Rs.${doc.priceDetails.price}</td>
                </tr>
                <tr>
                    <td>GST</td>
                    <td>${doc.priceDetails.GST}%</td>
                </tr>
            </table>

            <table>
                <tr>
                    <th colspan="2">Itinerary Details</th>
                </tr>
                ${doc.itenaryDetails
                  .map(
                    (item, index) =>
                      `<tr>
                        <td>Day ${index + 1}</td>
                        <td>${item.place}</td>
                    </tr>`
                  )
                  .join("")}
            </table>

            <p>Thank you for choosing us. We look forward to providing you with an unforgettable experience.</p>
            <h2>Best Regards</h2>
            <p>Jagannath Tour And Travel</p>
        </div>
    </body>
    </html>
  `;

  // PDF generation function
  const generatePDF = (content) => {
    return new Promise((resolve, reject) => {
      pdf.create(content, { format: "A4" }).toBuffer((err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });
  };

  try {
    // Generate PDF
    const pdfBuffer = await generatePDF(htmlContent);
    // Save PDF to file
    const pdfPath = path.join(__dirname, "tour-details.pdf");
    console.log("i am dir--->", pdfPath);

    await writeFileAsync(pdfPath, pdfBuffer);
    console.log("PDF generated successfully!");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "futureai941@gmail.com",
        pass: "alkzmoispjhwdqrg",
      },
    });

    const info = await transporter.sendMail({
      from: "Tours And Travels",
      to: doc.customerDetails.email,
      subject: "Tours And Travels Details",
      text: "Welcome to Tour and Travels. Find the file attached",
      html: htmlContent,
      attachments: [
        {
          filename: "tour-details.pdf",
          path: pdfPath,
        },
      ],
    });

    console.log("Email sent successfully");

    // Clean up: remove the temporary PDF file after email is sent
    await unlinkAsync(pdfPath);
    console.log("Temporary PDF file removed");

    return "Email Sent successfully.";
  } catch (error) {
    console.error("Error in sendMail function:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

module.exports = sendMail;
