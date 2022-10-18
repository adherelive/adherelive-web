const fs = require("fs");
const PDFDocument = require("pdfkit");

async function createReport(items, path) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateCustomerInformation(doc);
  generateInvoiceTable(doc, items);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateCustomerInformation(doc) {
  doc.fillColor("#444444").fontSize(20).text("Flash Card Report", 50, 160);

  generateHr(doc, 185);
}

function generateInvoiceTable(doc, items) {
  let i;
  const invoiceTableTop = 220;

  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Questions", "Answers");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, position, item.que, item.ans);

    generateHr(doc, position + 20);
  }
}

function generateTableRow(doc, y, item, lineTotal) {
  doc.fontSize(10).text(item, 50, y).text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}
module.exports = {
  createReport,
};
