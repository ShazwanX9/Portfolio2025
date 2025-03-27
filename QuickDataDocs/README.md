# Quick Data Docs

Quick Data Docs is a powerful tool designed to transform your template documents with data from Excel and export them as PDFs. This tool provides a seamless workflow for uploading templates, uploading data, previewing formatted content, and exporting documents.

![Workflow Steps](Snapshots.png)

## Features

- Upload Word templates (.docx)
- Upload Excel data (.xlsx, .xls)
- Real-time template and data preview
- Format and preview documents with data
- Export formatted documents as PDFs
- Batch export all documents as a ZIP file
- Clean, minimalist user interface
- Interactive tutorial for first-time users

## Usage

1. Open the application in your web browser.
2. Upload your Word template by dragging and dropping the file or using the file chooser.
3. Upload your Excel data file by dragging and dropping the file or using the file chooser.
4. Select a row from the Excel data to preview the formatted document.
5. Use the "Preview" button to see the formatted content.
6. Use the "Copy" button to copy the formatted content to your clipboard.
7. Use the "Download PDF" button to save the formatted document as a PDF.
8. Use the "Download All ZIP" button to batch export all documents as a ZIP file.

## Technical Details

This project uses:
- Vanilla JavaScript
- [XLSX.js](https://github.com/SheetJS/sheetjs) for Excel file processing
- [JSZip](https://stuk.github.io/jszip/) for ZIP file creation
- [PDF-Lib](https://pdf-lib.js.org/) for PDF generation
- Pure CSS for styling

## Browser Support

The application works on all modern browsers that support:
- File API
- Clipboard API
- ES6+ JavaScript features

## Development

To run the project locally:
1. Clone the repository.
2. Open `index.html` in your web browser.
3. No build process required!

## License

MIT License