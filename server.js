const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Route for home page
app.get('/', (req, res) => {
    // Try multiple possible paths for Vercel
    const possiblePaths = [
        path.join(__dirname, 'public', 'index.html'),
        path.join(process.cwd(), 'public', 'index.html'),
        path.join(__dirname, 'index.html')
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
        // Debug info
        console.log('__dirname:', __dirname);
        console.log('process.cwd():', process.cwd());
        console.log('Looking for index.html in:', possiblePaths);
        res.status(404).send('index.html not found. Please check the file structure.');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Export for Vercel
module.exports = app;

// Start server (only if not in Vercel environment)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, '0.0.0.0', (err) => {
        if (err) {
            console.error('Error starting server:', err);
            return;
        }
        console.log(`\n✅ Server is running successfully!`);
        console.log(`📍 Local: http://localhost:${PORT}`);
        console.log(`📍 Network: http://YOUR_IP:${PORT}`);
        console.log(`   (Find your IP with: ipconfig)\n`);
    });
}

