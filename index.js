const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from public directory
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Route for home page
app.get('*', (req, res) => {
    // Try multiple possible paths for Vercel
    const possiblePaths = [
        path.join(__dirname, '..', 'public', 'index.html'),
        path.join(process.cwd(), 'public', 'index.html'),
        path.join(__dirname, 'public', 'index.html'),
        path.join(process.cwd(), 'index.html')
    ];
    
    let indexPath = null;
    for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
            indexPath = possiblePath;
            break;
        }
    }
    
    if (indexPath) {
        res.sendFile(indexPath);
    } else {
        // Return a helpful error with debug info
        const debugInfo = {
            __dirname: __dirname,
            cwd: process.cwd(),
            possiblePaths: possiblePaths,
            filesInDir: fs.existsSync(__dirname) ? fs.readdirSync(__dirname) : 'dir not found',
            filesInParent: fs.existsSync(path.join(__dirname, '..')) ? fs.readdirSync(path.join(__dirname, '..')) : 'parent not found'
        };
        res.status(404).json({
            error: 'index.html not found',
            debug: debugInfo
        });
    }
});

module.exports = app;

