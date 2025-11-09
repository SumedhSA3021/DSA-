module.exports = (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    const jsPath = path.join(process.cwd(), 'public', 'script.js');
    
    if (fs.existsSync(jsPath)) {
        const js = fs.readFileSync(jsPath, 'utf8');
        res.setHeader('Content-Type', 'application/javascript');
        res.status(200).send(js);
    } else {
        res.status(404).send('// JS not found');
    }
};

