// Function to apply a smoother linear gradient background to the page
function applyGradientBackground(colors) {
    let gradientString = 'linear-gradient(135deg, ';

    // Check if there are too many colors and blend them smoothly
    const blendedColors = blendColors(colors);

    // Use evenly spaced color stops for smooth transitions
    blendedColors.forEach((color, index) => {
        const stop = (index / (blendedColors.length - 1)) * 100; // Calculate percentage stop position
        gradientString += `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.8) ${stop}%`;
        if (index < blendedColors.length - 1) gradientString += ', ';
    });

    gradientString += ')';

    const gradientBackground = document.querySelector('.gaussian-blur-background');
    gradientBackground.style.background = gradientString;
    document.body.classList.add('gradient-active');

    const blurAmount = 10;
    gradientBackground.style.filter = `blur(${blurAmount}px)`;
    gradientBackground.style.transform = 'scale(1.1)';
    gradientBackground.style.transition = 'filter 0.3s ease, transform 0.3s ease';

    // Handle movement of the gradient background on mouse move
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        gradientBackground.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    });

    window.addEventListener('mouseout', () => {
        gradientBackground.style.transform = 'scale(1.1)';
    });
}

// Function to blend the colors smoothly if the palette is large
function blendColors(colors) {
    if (colors.length <= 3) {
        return colors; // If there are few colors, no need to blend
    }

    // Create a new array with smoothly blended colors
    let blendedColors = [];
    const numSteps = 50; // Number of gradient steps for smooth blending

    // Calculate steps between colors
    for (let i = 0; i < numSteps; i++) {
        let ratio = i / (numSteps - 1);
        let startColor = colors[Math.floor(ratio * (colors.length - 1))];
        let endColor = colors[Math.ceil(ratio * (colors.length - 1))];
        let blendedColor = blendTwoColors(startColor, endColor, ratio);
        blendedColors.push(blendedColor);
    }

    return blendedColors;
}

// Function to blend two colors based on the ratio
function blendTwoColors(color1, color2, ratio) {
    const r = Math.round(color1[0] * (1 - ratio) + color2[0] * ratio);
    const g = Math.round(color1[1] * (1 - ratio) + color2[1] * ratio);
    const b = Math.round(color1[2] * (1 - ratio) + color2[2] * ratio);
    return [r, g, b];
}


// Display the colors in the palette
function displayColors(colors) {
    const paletteContainer = document.getElementById('palette-container');
    paletteContainer.innerHTML = '';
    colors.forEach(color => addColorToPalette(color));
}

// Add a color to the palette
function addColorToPalette(color) {
    const paletteContainer = document.getElementById('palette-container');
    const colorBox = createColorBox(color);

    if (!isColorInPalette(colorBox, paletteContainer)) {
        paletteContainer.appendChild(colorBox);
        updateGradientBackground(paletteContainer);
    }
}

// Create a color box element with information
function createColorBox(color) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-card';
    colorBox.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    const colorInfo = createColorInfo(color);
    colorBox.appendChild(colorInfo);

    // Set text color based on contrast (black or white)
    colorInfo.style.opacity = 0;
    addEventListeners(colorBox, colorInfo, color);

    return colorBox;
}

// Create the color info display inside the color box
function createColorInfo(color) {
    const hexColor = rgbToHex(color[0], color[1], color[2]);

    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-info';

    const colorValueDisplay = document.createElement('div');
    colorValueDisplay.className = 'color-value';
    colorValueDisplay.textContent = hexColor;

    const contrastColor = getContrastColor(color);
    colorValueDisplay.style.color = contrastColor;
    colorValueDisplay.style.display = contrastColor;

    colorInfo.appendChild(colorValueDisplay);
    return colorInfo;
}

// Function to calculate luminance and determine if the text should be black or white
function getContrastColor(color) {
    const r = color[0] / 255;
    const g = color[1] / 255;
    const b = color[2] / 255;

    // Using the luminance formula (Relative luminance from the W3C)
    const luminance = 0.2126 * (r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2))
                   + 0.7152 * (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2))
                   + 0.0722 * (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2));

    // If luminance is dark, return white, else return black
    return luminance > 0.5 ? 'black' : 'white';
}

// Add hover event listeners to the color box
function addEventListeners(colorBox, colorInfo, color) {
    colorBox.addEventListener('mouseenter', () => {
        updateColorValueDisplay(colorInfo, colorBox);
        colorInfo.style.opacity = 1;
    });

    colorBox.addEventListener('mouseleave', () => {
        colorInfo.style.opacity = 0;
    });

    const hexColor = rgbToHex(color[0], color[1], color[2]);
    const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const hslColor = rgbToHsl(color[0], color[1], color[2]);
    colorBox.addEventListener('click', () => copyColorToClipboard(colorInfo, colorBox, hexColor, rgbColor, hslColor));
}

// Function to update the displayed color value based on the selected format
function updateColorValueDisplay(colorInfo, colorBox) {
    const format = document.getElementById('color-format').value;
    const rgbColor = colorBox.style.backgroundColor;

    // Extract RGB values from the rgb() string
    const rgbValues = rgbColor.match(/\d+/g).map(Number);
    const hexColor = rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
    const hslFull = rgbToHslFull(rgbValues[0], rgbValues[1], rgbValues[2]);
    const hslNorm = rgbToHslNorm(rgbValues[0], rgbValues[1], rgbValues[2]);
    const rgbNorm = rgbValues.map(val => (val / 255).toFixed(2));

    let colorString;
    switch (format) {
        case 'hex':
            colorString = hexColor;
            break;
        case 'rgb-norm':
            colorString = `rgb(${rgbNorm.join(', ')})`; // RGB norm (0-1)
            break;
        case 'rgb-full':
            colorString = `rgb(${rgbValues.join(', ')})`; // RGB full (0-255)
            break;
        case 'hsl-norm':
            colorString = hslNorm; // HSL norm (0-1)
            break;
        case 'hsl-full':
            colorString = hslFull; // HSL full (0-360, 0-100%)
            break;
        default:
            colorString = hexColor; // Default to HEX if anything else
    }
    colorInfo.querySelector('.color-value').textContent = colorString;
}

// Check if the color is already in the palette
function isColorInPalette(colorBox, paletteContainer) {
    return Array.from(paletteContainer.children).some(box => box.style.backgroundColor === colorBox.style.backgroundColor);
}

// Update the gradient background based on the colors in the palette
function updateGradientBackground(paletteContainer) {
    const colors = Array.from(paletteContainer.children).map(box => {
        const rgb = box.style.backgroundColor.match(/\d+/g);
        return [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])];
    });
    applyGradientBackground(colors);
}

// Copy the color value to the clipboard and update the text display
function copyColorToClipboard(colorInfo, colorValueDisplay, hexColor, rgbColor, hslColor) {
    const format = document.getElementById('color-format').value;
    const colorString = format === 'hex' ? hexColor : format === 'rgb' ? rgbColor : hslColor;

    navigator.clipboard.writeText(colorString)
        .then(() => {
            // Change the text to 'Copied'
            const data = colorValueDisplay.textContent;
            colorInfo.querySelector('.color-value').textContent = 'Copied';
            setTimeout(() => {
                colorInfo.querySelector('.color-value').textContent = data;
            }, 2000);
        })
        .catch(error => {
            alert('Failed to copy color code to clipboard: ' + error);
        });
}
