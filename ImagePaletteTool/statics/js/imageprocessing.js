async function processImage(file, numColors) {
    try {
        const image = await loadImage(file);
        const canvas = document.getElementById('image-canvas');
        const imageInput = document.getElementById('image-input');
        imageInput.src = image.src;

        // Resize image just once to the desired size.
        const { width, height } = resizeImage(image, 300, 300);
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, width, height);

        const { width: smallWidth, height: smallHeight } = resizeImage(image, 100, 100);

        const imageData = context.getImageData(0, 0, smallWidth, smallHeight);
        extractDistinctPalette(imageData, numColors, displayColors);

        canvas.style.display = "block"; // Make canvas visible once processing is complete
    } catch (error) {
        console.error('Error processing the image:', error);
    }
}

// Utility to load an image from a file using a Promise
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;
            
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Failed to load image'));
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        
        reader.readAsDataURL(file);
    });
}


function extractDistinctPalette(imageData, numColors, callback) {
    const pixels = extractPixels(imageData);
    const uniqueColors = getUniqueColors(pixels);

    if (uniqueColors.length <= numColors) {
        callback(uniqueColors);
        return;
    }

    const selectedColors = selectColors(uniqueColors, numColors);
    callback(selectedColors);
}

function extractPixels(imageData) {
    const pixels = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        pixels.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
    }
    return pixels;
}

function getUniqueColors(pixels) {
    return pixels.filter((color, index, self) =>
        index === self.findIndex((t) => t.toString() === color.toString())
    );
}

function selectColors(uniqueColors, numColors) {
    const selectedColors = [uniqueColors[0]];

    while (selectedColors.length < numColors && uniqueColors.length > selectedColors.length) {
        let maxDistance = 0;
        let furthestColor = null;

        for (const color of uniqueColors) {
            let minDistance = Infinity;
            for (const selectedColor of selectedColors) {
                const distance = calculateColorDistance(color, selectedColor);
                minDistance = Math.min(minDistance, distance);
            }
            if (minDistance > maxDistance) {
                maxDistance = minDistance;
                furthestColor = color;
            }
        }
        if (furthestColor) {
            selectedColors.push(furthestColor);
        } else {
            break;
        }
    }

    return selectedColors;
}

function calculateColorDistance(color1, color2) {
    const rDiff = color1[0] - color2[0];
    const gDiff = color1[1] - color2[1];
    const bDiff = color1[2] - color2[2];
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

function resizeImage(image, maxWidth, maxHeight) {
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
    }

    if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
    }

    return { width, height };
}
