const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.match(/\bfont-serif\b/)) {
                content = content.replace(/\bfont-serif\b/g, '');
                // Cleanup multiple spaces inside classNames without messing up formatting too much
                // It's safer to just replace '  ' with ' ' inside double quotes?
                // The easiest way is to let Tailwind compiler handle the extra spaces in class names.
                // We'll replace ` font-serif` with `` or `font-serif ` with ``
                content = content.replace(/ font-serif /g, ' ');
                content = content.replace(/ font-serif"/g, '"');
                content = content.replace(/"font-serif /g, '"');
                fs.writeFileSync(fullPath, content);
                console.log('Fixed: ' + fullPath);
            }
        }
    });
}

processDir(path.join(__dirname, 'src'));
console.log('Done removing font-serif.');
