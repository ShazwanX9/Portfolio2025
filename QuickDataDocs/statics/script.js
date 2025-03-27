document.addEventListener('DOMContentLoaded', function () {
    initializeFileUpload('wordUploadArea', 'wordFile', handleWordFile);
    initializeFileUpload('excelUploadArea', 'excelFile', handleExcelFile);
    document.getElementById('formatPreviewButton').addEventListener('click', previewFormattedContent);
    document.getElementById('downloadButton').addEventListener('click', downloadPDF);
    document.getElementById('copyButton').addEventListener('click', copyFormattedContent);
    document.getElementById('batchDownloadButton').addEventListener('click', batchDownloadPDFs);

    // Initial step display control
    const workflowSteps = document.querySelectorAll('.workflow-step');
    for (let i = 1; i < workflowSteps.length; i++) {
        workflowSteps[i].style.display = 'none';
    }

    // Add tutorial message
    addTutorialButton();
    addTutorialMessage();
});

let tutorialOverlayVisible = false;
let tutorialButton;

function toggleTutorialOverlay(show) {
    if (show) {
        addTutorialMessage();
        tutorialButton.style.color = '#f9f9f9';
    } else {
        const overlay = document.querySelector('.tutorial-overlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.3s ease-in-out';
            overlay.style.opacity = 0;
            setTimeout(() => {
                overlay.remove();
                tutorialOverlayVisible = false;
                tutorialButton.style.color = '#007bff';
            }, 300);
        }
    }
}

function addTutorialButton() {
    tutorialButton = document.createElement('button');
    tutorialButton.innerHTML = '<i class="fas fa-question-circle"></i>';
    tutorialButton.classList.add('tutorial-button');
    document.body.appendChild(tutorialButton);

    tutorialButton.addEventListener('click', function () {
        toggleTutorialOverlay(!tutorialOverlayVisible);
    });
}

function addTutorialMessage() {
    tutorialOverlayVisible = true;

    const tutorialMessage = document.createElement('div');
    tutorialMessage.innerHTML = `
        <div class="tutorial-overlay">
            <div class="tutorial-content">
                <h2>Document Upload Tutorial</h2>
                <p><strong>Step 1: Upload Template</strong></p>
                <p>Please upload a Word document (.docx) containing placeholders where you want the Excel data to be inserted. Placeholders should be in the format <span class="emphasis"><code>{{ColumnName}}</code></span>.</p>
                <p><strong>Step 2: Upload Data</strong></p>
                <p>Upload an Excel file (.xlsx or .xls) with the data you want to use. <span class="emphasis">The first row of the Excel file must contain the column headers that match the placeholders in your Word document.</span></p>
                <p><strong>Example:</strong></p>
                <p>Word Document: "Hello <span class="emphasis"><code>{{Name}}</code></span>, your order number is <span class="emphasis"><code>{{OrderNumber}}</code></span>."</p>
                <p>Excel File Headers:</-p>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>OrderNumber</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>John Doe</td>
                            <td>12345</td>
                        </tr>
                        <tr>
                            <td>Jane Smith</td>
                            <td>67890</td>
                        </tr>
                    </tbody>
                </table>
                <button id="closeTutorial">Got it!</button>
            </div>
        </div>
    `;
    document.body.appendChild(tutorialMessage);

    const overlay = document.querySelector('.tutorial-overlay');
    overlay.style.opacity = 0;

    setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s ease-in-out';
        overlay.style.opacity = 1;
        overlay.classList.add('show');
    }, 10);

    document.getElementById('closeTutorial').addEventListener('click', function () {
        toggleTutorialOverlay(false); // Close the overlay using the function
    });
}

function initializeFileUpload(uploadAreaId, fileInputId, fileChangeHandler) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);

    uploadArea.addEventListener('click', function () {
        fileInput.click();
    });

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });

    uploadArea.addEventListener('dragover', function () {
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function () {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (event) {
        uploadArea.classList.remove('dragover');
        const file = event.dataTransfer.files[0];
        if (!file) return;

        fileInput.files = event.dataTransfer.files;
        if (fileChangeHandler) {
            fileChangeHandler({ target: fileInput });
            showNextStep(); // Show the next step after file drop
        }
    });

    if (fileChangeHandler) {
        fileInput.addEventListener('change', (event) => {
            fileChangeHandler(event);
            showNextStep(); // Show the next step after file selection
        });
    }
}

let wordDocumentContent = '';
let excelData = [];
let currentStep = 0; // Track the current step

function showNextStep() {
    const workflowSteps = document.querySelectorAll('.workflow-step');
    if (currentStep < workflowSteps.length - 1) {
        // workflowSteps[currentStep].classList.add('slide-out'); // Add slide-out animation

        setTimeout(() => {
            // workflowSteps[currentStep].style.display = 'none';
            // workflowSteps[currentStep].classList.remove('slide-out'); // Remove slide-out class

            currentStep++;
            workflowSteps[currentStep].style.display = 'block';
            workflowSteps[currentStep].classList.add('slide-in'); // Add slide-in animation

            setTimeout(() => {
                workflowSteps[currentStep].classList.remove('slide-in'); // Remove slide-in class after animation
            }, 300); // Match animation duration (300ms)
        }, 300); // Match animation duration (300ms)
    }
}

function handleWordFile(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const arrayBuffer = e.target.result;
            const zip = new JSZip();
            zip.loadAsync(arrayBuffer).then(function (zip) {
                return zip.file("word/document.xml").async("string");
            }).then(function (content) {
                wordDocumentContent = preprocessContent(content);
                document.getElementById('templatePreview').innerHTML = `<p>Uploaded File: ${file.name}</p><br><p>${(content)}</p>`;
            });
        };
        reader.readAsArrayBuffer(file);
    } else {
        showError('Please upload a valid Word document.');
    }
}

function preprocessContent(content) {
    return content.replace(/<[^>]+>/g, function (match) {
        if (match.startsWith("{{") && match.endsWith("}}")) {
            return match;
        } else {
            return "";
        }
    });
}

function handleExcelFile(event) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        document.getElementById('excelPreview').innerHTML = `<p>Uploaded File: ${file.name}</p>`;
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const previewDropdown = document.getElementById('previewDropdown');
            previewDropdown.innerHTML = '<option value="">Choose a row...</option>';
            for (let i = 1; i < excelData.length; i++) {
                const firstColumnValue = excelData[i][0];
                previewDropdown.innerHTML += `<option value="${i}">Row ${i}: ${firstColumnValue}</option>`;
            }

            const tableHtml = generateTableHtml(excelData);
            document.getElementById('excelPreview').innerHTML += tableHtml;
        };
        reader.readAsArrayBuffer(file);
    } else {
        showError('Please upload a valid Excel file.');
    }
}

function generateTableHtml(data) {
    let tableHtml = '<table>';
    data.forEach((row, rowIndex) => {
        tableHtml += '<tr>';
        row.forEach((cell) => {
            if (rowIndex === 0) {
                tableHtml += `<th>${cell}</th>`;
            } else {
                tableHtml += `<td>${cell}</td>`;
            }
        });
        tableHtml += '</tr>';
    });
    tableHtml += '</table>';
    return tableHtml;
}

function showError(message) {
    console.error(message);
    // Display error message to the user
}

function replacePlaceholders(str, dataMap) {
    return str.replace(/{{(.*?)}}/g, function (match, p1) {
        return dataMap[p1] || '';
    });
}

function previewFormattedContent() {
    const selectedRow = document.getElementById('previewDropdown').value;
    if (selectedRow && wordDocumentContent && excelData.length > 0) {
        const header = excelData[0];
        const rowData = excelData[selectedRow];
        const dataMap = {};
        for (let i = 0; i < header.length; i++) {
            dataMap[header[i]] = rowData[i];
        }
        const updatedContent = replacePlaceholders(wordDocumentContent, dataMap);
        document.getElementById('formattedPreview').innerHTML = `<pre>${updatedContent}</pre>`;
        showNextStep(); // Show the next step after preview
    } else {
        showError('Please select a valid row and ensure both files are uploaded.');
    }
}

async function downloadPDF() {
    const selectedRow = document.getElementById('previewDropdown').value;
    if (selectedRow && wordDocumentContent && excelData.length > 0) {
        const header = excelData[0];
        const rowData = excelData[selectedRow];
        const dataMap = {};
        for (let i = 0; i < header.length; i++) {
            dataMap[header[i]] = rowData[i];
        }
        const updatedContent = replacePlaceholders(wordDocumentContent, dataMap);

        const { PDFDocument, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);

        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const lines = updatedContent.split('\n');
        let y = 750;
        const lineHeight = 14;
        lines.forEach(line => {
            page.drawText(line, {
                x: 50,
                y: y,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
            });
            y -= lineHeight;
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'document.pdf';
        link.click();
    } else {
        showError('Please select a valid row and ensure both files are uploaded.');
    }
}

function copyFormattedContent() {
    const formattedPreview = document.getElementById('formattedPreview');
    if (formattedPreview && formattedPreview.textContent) {
        navigator.clipboard.writeText(formattedPreview.textContent)
            .then(() => alert('Formatted content copied to clipboard!'))
            .catch(err => console.error('Could not copy text: ', err));
    } else {
        showError('No formatted content to copy.');
    }
}

async function batchDownloadPDFs() {
    if (!excelData || excelData.length <= 1) {
        showError('No Excel data available for batch download.');
        return;
    }

    const zip = new JSZip();
    const header = excelData[0];

    for (let i = 1; i < excelData.length; i++) {
        const rowData = excelData[i];
        const dataMap = {};
        for (let j = 0; j < header.length; j++) {
            dataMap[header[j]] = rowData[j];
        }
        const updatedContent = replacePlaceholders(wordDocumentContent, dataMap);

        const { PDFDocument, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);

        const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const lines = updatedContent.split('\n');
        let y = 750;
        const lineHeight = 14;
        lines.forEach(line => {
            page.drawText(line, {
                x: 50,
                y: y,
                size: 12,
                font: font,
                color: rgb(0, 0, 0),
            });
            y -= lineHeight;
        });

        const pdfBytes = await pdfDoc.save();
        zip.file(`document_row_${i}.pdf`, pdfBytes);
    }

    zip.generateAsync({ type: 'blob' })
        .then(function (content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'documents.zip';
            link.click();
        });
}