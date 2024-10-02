// const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
require("dotenv").config();
// const fs = require("fs");
// const path = require("path");
// const revisedQuotation = require("./revisedQuotation");
// const { type } = require("os");

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
        /* Image styling inside the table */
        .confirmImg {
            width: 150px;
            height: auto;
            object-fit: contain;
            
            transform: rotate(-10deg); /* Slight rotation */
            position: absolute;
            top: 4rem;
            right: 2rem;
            z-index: 1; /* Ensure it stays on top but does not cover text */
        }
        .customer-details {
            position: relative; /* Make table relative to position image inside */
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

        <!-- Customer Details Section -->
        <div class="customer-details">
            <img 
                src="https://res.cloudinary.com/dnw1ttr02/image/upload/v1727775815/Jagannath/hehgqf6i99wwnzznktww.jpg" 
                alt="Confirmed" 
                class="confirmImg"
            />
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

        <!-- Price Details Section -->
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

        <!-- Itinerary Details Section -->
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

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: "tour-details.pdf", format: "A4" });

  await browser.close();
  console.log("PDF generated successfully!");

  try {
    // console.log(__dirname + "../docs/UDEMY.pdf");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "futureai941@gmail.com",
        pass: "alkzmoispjhwdqrg",
      },
    });

    // if(doc.email)

    const info = await transporter.sendMail({
      from: "Tours And Travels",
      to: doc.customerDetails.email,
      subject: "Tours And Travels Details",
      text: "Welcome to Tour and Travels.find the file attached",
      html: htmlContent,
      attachments: [
        {
          filename: "tour-details.pdf",
          path: "./tour-details.pdf",
        },
      ],
    });
    console.log("info------>", info);

    if (info) {
      console.log(info);
      return;
    }
    return "Email Sent successfully.";
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
