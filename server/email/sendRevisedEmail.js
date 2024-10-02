// const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const puppeteer = require("puppeteer");
require("dotenv").config();

const sendRevisedEmail = async (data) => {
  //   console.log(data);
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revised Quotation</title>
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
        h2 {
            color: #2c3e50;
            text-align: start;
        }
        table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
            page-break-inside: auto;
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
        .highlight {
            font-weight: bold;
            color: #e74c3c;
        }
        /* Page Break Rules */
        h1, h2, h3 {
            page-break-after: avoid;
        }
        table, p {
            page-break-inside: avoid;
        }
        .container {
            page-break-inside: avoid;
        }
        .regards {
             max-width: 95%;
            margin: 5rem auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .status {
          
            color: green;
           
        }
       .paidAmount{
            color:green
        }
        .pendingAmount{
            color:red
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
      
        <h1>Revised Trip Details</h1>
        <h3>Hello, Mr/Mrs.${data?.quotation?.customerDetails?.name}</h3>
        <p>We are pleased to provide you with a revised quotation for your upcoming trip. Please find the details below:</p>

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
                <td>${data?.quotation?.customerDetails?.name}</td>
            </tr>
            <tr>
                <td>Age</td>
                <td>${data?.quotation?.customerDetails?.age}</td>
            </tr>
            <tr>
                <td>Phone</td>
                <td>${data?.quotation?.customerDetails?.phone}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>${data?.quotation?.customerDetails?.email}</td>
            </tr>
            <tr>
                <td>From</td>
                <td>${data?.quotation?.customerDetails?.from}</td>
            </tr>
            <tr>
                <td>To</td>
                <td>${data?.quotation?.customerDetails?.to}</td>
            </tr>
            <tr>
                <td>Start Date</td>
                <td>${new Date(
                  data?.quotation?.customerDetails?.startDate
                ).toLocaleDateString()}</td>
            </tr>
            <tr>
                <td>End Date</td>
                <td>${new Date(
                  data?.quotation?.customerDetails?.endDate
                ).toLocaleDateString()}</td>
            </tr>
        </table>
        </div>
         <table>
            <tr>
                <th colspan="2">Journey</th>
            </tr>
            <tr>
                <td>Status</td>
                <td class="status">Confirmed</td>
            </tr>
            
        </table>

        <!-- Price Details Section -->
        <table>
            <tr>
                <th colspan="2">Price Details</th>
            </tr>
            <tr>
                <td>Original Price</td>
                <td>Rs.${data?.quotation?.priceDetails?.price}</td>
            </tr>
            <tr>
                <td>GST</td>
                <td>${data?.quotation?.priceDetails?.GST}%</td>
            </tr>
            <tr>
                <td>Revised Price</td>
                <td class="highlight">Rs.${data?.discountedPrice}</td>
            </tr>
            <tr>
                <td>Revised Percentage</td>
                <td>${data?.discountedPercentage}%</td>
            </tr>
            <tr>
                <td>Paid Amount</td>
                <td class="paidAmount" >Rs.${data?.paidAmount}</td>
            </tr>
            <tr>
                <td>Pending Amount</td>
                <td class="pending">Rs.${data?.pendingAmount}</td>
            </tr>
        </table>

        <!-- Itinerary Details Section -->
       

        
    </div>
    <div class="regards">
     <table>
            <tr>
                <th colspan="2">Original Itinerary Details</th>
            </tr>
            ${data?.quotation?.itenaryDetails
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
      to: data.quotation.customerDetails.email,
      subject: "Tours And Travels Details",
      text: "Welcome to Jagannath Tour and Travel. Here is your revised tour details. find the file attached below. Thank you.",
      html: htmlContent,
      attachments: [
        {
          filename: "tour-details.pdf",
          path: "./tour-details.pdf",
        },
      ],
    });

    return "Revised Email Sent successfully.";
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendRevisedEmail;
