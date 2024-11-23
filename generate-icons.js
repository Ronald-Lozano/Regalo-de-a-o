const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = './Fotos/Snapchat-910110381.jpg'; // Tu imagen base de alta resolución
const outputDir = 'icons';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

sizes.forEach(size => {
    sharp(inputImage)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
        .then(info => console.log(`Generado icon-${size}x${size}.png`))
        .catch(err => console.error(`Error generando icon-${size}x${size}.png:`, err));
});