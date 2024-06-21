/* eslint-disable */
// @ts-nocheck
const fs = require('fs');
const { exec } = require('child_process');
const markdownIt = require('markdown-it');
const md = new markdownIt();

// Paths to your files
const markdownFile = './src/pages/cv.md';
const htmlFile = './public/cv.html';
const pdfFile = './public/cv.pdf';
const cssFile = 'cv-styles.css';

// Read the markdown file
const markdown = fs.readFileSync(markdownFile, 'utf-8');

// Convert markdown to HTML
const htmlContent = md.render(markdown);

// Wrap HTML content with HTML boilerplate and link to the CSS file
const fullHtmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="${cssFile}">
  </head>
  <body>
    ${htmlContent}
  </body>
  </html>
`;

// Write the HTML content to a file
fs.writeFileSync(htmlFile, fullHtmlContent);

// Use WeasyPrint to convert the HTML file to PDF
exec(`weasyprint ${htmlFile} ${pdfFile}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
