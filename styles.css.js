module.exports = (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    const cssPath = path.join(process.cwd(), 'public', 'styles.css');
    
    if (fs.existsSync(cssPath)) {
        const css = fs.readFileSync(cssPath, 'utf8');
        res.setHeader('Content-Type', 'text/css');
        res.status(200).send(css);
    } else {
        res.status(404).send('/* CSS not found */');
    }
};

