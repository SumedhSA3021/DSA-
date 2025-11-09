const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for home page
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
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

