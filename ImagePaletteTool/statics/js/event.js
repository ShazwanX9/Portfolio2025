document.addEventListener('DOMContentLoaded', function () {
    // Get the elements
    const imageInput = document.getElementById('image-input');
    const extractButton = document.getElementById('extract-button');
    const imagePreview = document.getElementById('image-preview');
    const imageCanvas = document.getElementById('image-canvas');
    const dropArea = document.getElementById('drop-area');
    const loader = document.getElementById('loader');  // Reference the loader element
    const jellyTriangle = document.getElementById('jelly-triangle');
    const backgroundShape = document.getElementById('background-shape');
    const uploadText = document.getElementById('upload-text');

    let size = 30;
    let opacity = 0;
    let growing = true;

    // Show loader function
    function showLoader() {
        loader.style.display = 'flex';  // Make the loader visible
    }

    // Hide loader function
    function hideLoader() {
        updateTextColorBasedOnBackground();
        loader.style.display = 'none';  // Hide the loader
    }

    // Image input change event
    imageInput.addEventListener('change', async function (event) {
        const file = event.target.files[0];
        if (file) {
            const numColors = parseInt(document.getElementById('num-colors').value, 10);
            
            // Show the loader during file processing
            showLoader();
            
            // Show the image preview using FileReader
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
            };
            
            // Process the image after preview is shown
            reader.onloadend = async function () {
                await processImage(file, numColors);
                hideLoader();  // Hide loader after processing is done
            };

            reader.readAsDataURL(file);
        }
    });

    // Extract button click event
    extractButton.addEventListener('click', async function () {
        const file = imageInput.files[0];
        if (file) {
            const numColors = parseInt(document.getElementById('num-colors').value, 10);

            // Show the loader during file processing
            showLoader();

            // Process image
            await processImage(file, numColors);
            hideLoader();  // Hide loader after processing is done
        } else {
            alert('Please choose an image first.');
        }
    });


    // Extract button click event
    extractButton.addEventListener('click', function () {
        const file = imageInput.files[0];
        if (file) {
            const numColors = parseInt(document.getElementById('num-colors').value, 10);

            // Show the loader during file processing
            showLoader();
            
            processImage(file, numColors);
        } else {
            alert('Please choose an image first.');
        }
    });

    // Image preview and canvas interaction
    ['mousemove', 'mouseout', 'click'].forEach(eventType => {
        imagePreview.addEventListener(eventType, eventType === 'click' ? pickColor : showTooltip);
        imageCanvas.addEventListener(eventType, eventType === 'click' ? pickColor : showTooltip);
    });

    ['mouseout'].forEach(eventType => {
        imagePreview.addEventListener(eventType, hideTooltip);
        imageCanvas.addEventListener(eventType, hideTooltip);
    });

    // Drop area events
    dropArea.addEventListener('click', function () {
        imageInput.click();
    });

    // File drag-and-drop events
    dropArea.addEventListener('dragover', function (event) {
        event.preventDefault();
        dropArea.classList.add("highlight");
    });

    dropArea.addEventListener('dragleave', function () {
        dropArea.classList.remove("highlight");
    });

    dropArea.addEventListener('drop', async function (event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const numColors = parseInt(document.getElementById('num-colors').value, 10);

            // Show the loader during file processing
            showLoader();

            // Process image
            await processImage(file, numColors);

            // Show the image preview using FileReader
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
            };
            reader.onloadend = function () {
                hideLoader();  // Hide loader after preview is ready
            };
            reader.readAsDataURL(file);
        }
        dropArea.classList.remove("highlight");
    });

    // Copy color code to clipboard
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', function () {
            const colorCode = button.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(colorCode).then(() => {
                alert(`Copied: ${colorCode}`);
            });
        });
    });

    // Loader animation
    function animateLoader() {
        function updateAnimation() {
            if (growing) {
                size += 2;
                opacity += 0.1;
            } else {
                size -= 2;
                opacity -= 0.1;
            }

            if (size > 40) growing = false;
            if (size < 30) growing = true;

            // Apply updated values directly to the DOM
            jellyTriangle.setAttribute('size', size);
            backgroundShape.style.width = size + 'px';
            backgroundShape.style.height = size + 'px';
            backgroundShape.style.opacity = opacity;

            // Call requestAnimationFrame to update the next frame
            requestAnimationFrame(updateAnimation);
        }

        // Start the animation loop
        requestAnimationFrame(updateAnimation);

        // Text animation
        let text = uploadText.textContent;
        uploadText.textContent = "";
        let index = 0;

        function animateText() {
            if (index < text.length) {
                uploadText.textContent += text[index];
                index++;
            } else {
                index = 0;
                uploadText.textContent = "";
            }
            
            // Call requestAnimationFrame to update text every frame
            requestAnimationFrame(animateText);
        }

        // Start the text animation loop
        requestAnimationFrame(animateText);
    }

    animateLoader();

});

// Utility function to get the number of colors from input
function getNumColors() {
    return parseInt(document.getElementById('num-colors').value, 10);
}

// Input validation
function validateInput(input) {
    if (input.value.length > 2) input.value = input.value.slice(0, 2);
    if (input.value > 99) input.value = 99;
    if (input.value < 1 && input.value !== '') input.value = 1;
}

// Helper function to calculate luminance based on RGB values
function calculateLuminance(r, g, b) {
    // Normalize RGB values to the range [0, 1]
    r /= 255;
    g /= 255;
    b /= 255;

    // Apply the formula to calculate relative luminance
    const a = [r, g, b].map(function (v) {
        return (v <= 0.03928) ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    // Return the luminance
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Function to get the background color of the .gaussian-blur-background element
function getBackgroundColor() {
    const element = document.querySelector('.gaussian-blur-background');
    const style = window.getComputedStyle(element);
    return style.backgroundColor;
}

// Function to extract RGB from the background color
function extractRGB(color) {
    const match = color.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [255, 255, 255]; // Default to white if the color isn't found
}

// Function to update text color based on the background luminosity
function updateTextColorBasedOnBackground() {
    const bgColor = getBackgroundColor();
    const rgb = extractRGB(bgColor);
    const luminance = calculateLuminance(rgb[0], rgb[1], rgb[2]);

    const textColor = luminance > 0.5 ? 'black' : 'white'; // If luminance > 0.5, choose dark text, else light text

    // Update all the text color in the page
    document.body.style.color = textColor;
    // Optionally, you can change colors for other specific sections
    const headers = document.querySelectorAll('header h1, header p, footer p, .upload-part, .drop-area p, .controls label, #image-preview-container p');
    headers.forEach(header => header.style.color = textColor);
}

// Call the function when the page loads
window.onload = function() {
    updateTextColorBasedOnBackground();
};
