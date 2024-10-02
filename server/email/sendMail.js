const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
require("dotenv").config();

const sendMail = async (doc) => {
  const pdfPath = "tour-details.pdf";

  // Create a PDF document using PDFKit
  const pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(pdfPath)); // Pipe to a file

  // Adding content to the PDF
  pdfDoc
    .fontSize(25)
    .text("Tour and Travel Details", { align: "center" })
    .moveDown()
    .fontSize(20)
    .text(
      `Welcome to "Jagannath Tour and Travel", Mr/Mrs. ${doc.customerDetails.name}`,
      { align: "center" }
    )
    .moveDown()
    .fontSize(16)
    .text("Customer Details")
    .moveDown()
    .text(`Name: ${doc.customerDetails.name}`)
    .text(`Age: ${doc.customerDetails.age}`)
    .text(`Phone: ${doc.customerDetails.phone}`)
    .text(`Email: ${doc.customerDetails.email}`)
    .text(`From: ${doc.customerDetails.from}`)
    .text(`To: ${doc.customerDetails.to}`)
    .text(
      `Start Date: ${new Date(
        doc.customerDetails.startDate
      ).toLocaleDateString()}`
    )
    .text(
      `End Date: ${new Date(doc.customerDetails.endDate).toLocaleDateString()}`
    )
    .moveDown();

  // Price Details
  pdfDoc
    .fontSize(16)
    .text("Price Details")
    .moveDown()
    .text(`Price: Rs. ${doc.priceDetails.price}`)
    .text(`GST: ${doc.priceDetails.GST}%`)
    .moveDown();

  // Itinerary Details
  pdfDoc.fontSize(16).text("Itinerary Details").moveDown();
  doc.itenaryDetails.forEach((item, index) => {
    pdfDoc.text(`Day ${index + 1}: ${item.place}`).moveDown();
  });

<<<<<<< HEAD
  // Closing the PDF document
  pdfDoc.end();

  // Wait until the PDF is written to the file system
  await new Promise((resolve, reject) => {
    pdfDoc.on("finish", resolve);
    pdfDoc.on("error", reject);
  });
=======
  const page = await browser.newPage();
  
  await page.setContent(htmlContent);
  await page.pdf({ path: "tour-details.pdf", format: "A4" });
>>>>>>> 00e5e02c7da673f544228dedb56d31b052b2e3a2

  console.log("PDF generated successfully!");

  try {
    // Configure nodemailer for sending the email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SMTP_USER, // your Gmail user
        pass: process.env.SMTP_PASSWORD, // your Gmail password
      },
    });

    // Send the email with the generated PDF attached
    const info = await transporter.sendMail({
      from: '"Tours And Travels" <your-email@gmail.com>',
      to: doc.customerDetails.email,
      subject: "Tours And Travels Details",
      text: "Welcome to Tour and Travels. Find the file attached.",
      html: htmlContent, // You can include the original HTML content
      attachments: [
        {
          filename: "tour-details.pdf",
          path: pdfPath, // Path to the generated PDF file
        },
      ],
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
