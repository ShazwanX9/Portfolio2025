
function showTooltip(event) {
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    const x = event.offsetX;
    const y = event.offsetY;
    const tooltip = document.getElementById('tooltip');
    const pixelData = ctx.getImageData(x - 1, y - 1, 3, 3).data;
    let tooltipContent = '<div class="tooltip-grid">';
    for (let i = 0; i < 9; i++) {
        const r = pixelData[i * 4];
        const g = pixelData[i * 4 + 1];
        const b = pixelData[i * 4 + 2];
        tooltipContent += `<div class="tooltip-pixel" style="background-color: rgb(${r}, ${g}, ${b});"></div>`;
    }
    tooltipContent += '</div>';
    tooltip.innerHTML = tooltipContent;
    tooltip.style.display = 'block';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

function pickColor(event) {
    const canvas = document.getElementById('image-canvas');
    const ctx = canvas.getContext('2d');
    const x = event.offsetX;
    const y = event.offsetY;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const color = {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
        a: pixel[3] / 255
    };
    const format = document.getElementById('color-format').value;
    let colorString;
    switch (format) {
        case 'hex':
            colorString = rgbToHex(color.r, color.g, color.b);
            break;
        case 'rgba':
            colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            break;
        case 'hsl':
            colorString = rgbToHsl(color.r, color.g, color.b);
            break;
    }
    addColorToPalette([color.r, color.g, color.b]);
}