module.exports = (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    // Try multiple possible paths
    const possiblePaths = [
        path.join(process.cwd(), 'public', 'script.js'),
        path.join(__dirname, '..', 'public', 'script.js'),
        path.join(process.cwd(), 'script.js')
    ];
    
    let jsContent = null;
    for (const jsPath of possiblePaths) {
        if (fs.existsSync(jsPath)) {
            jsContent = fs.readFileSync(jsPath, 'utf8');
            break;
        }
    }
    
    if (jsContent) {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.status(200).send(jsContent);
    } else {
        res.status(404).send('// JS not found');
    }
};
