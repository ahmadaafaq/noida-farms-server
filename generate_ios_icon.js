import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateAppIcon() {
    const inputPath = path.join(__dirname, '../noida-farm/src/assets/app_images/logo_nf.png');
    const outDir = path.join(__dirname, '../noida-farm/ios/NoidaFarms/Images.xcassets/AppIcon.appiconset');
    const outputPath = path.join(outDir, 'icon_1024.png');

    try {
        await sharp(inputPath)
            .resize(1024, 1024, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            // Remove alpha channel (Apple requires no transparency for App Icons)
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .toFile(outputPath);

        console.log('Successfully generated 1024x1024 app icon.');

        const contentsJson = {
            "images": [
                {
                    "filename": "icon_1024.png",
                    "idiom": "universal",
                    "platform": "ios",
                    "size": "1024x1024"
                }
            ],
            "info": {
                "author": "xcode",
                "version": 1
            }
        };

        fs.writeFileSync(path.join(outDir, 'Contents.json'), JSON.stringify(contentsJson, null, 2));
        console.log('Successfully updated Contents.json');

    } catch (err) {
        console.error('Error generating icon:', err);
    }
}

generateAppIcon();
