module.exports = (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    // Try to find index.html
    const possiblePaths = [
        path.join(process.cwd(), 'public', 'index.html'),
        path.join(__dirname, '..', 'public', 'index.html'),
        path.join(process.cwd(), 'index.html')
    ];
    
    let htmlContent = null;
    let foundPath = null;
    
    for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
            foundPath = filePath;
            htmlContent = fs.readFileSync(filePath, 'utf8');
            break;
        }
    }
    
    if (htmlContent) {
        // Fix paths in HTML to work with Vercel (absolute paths)
        htmlContent = htmlContent.replace(/href=["']styles\.css["']/g, 'href="/styles.css"');
        htmlContent = htmlContent.replace(/src=["']script\.js["']/g, 'src="/script.js"');
        htmlContent = htmlContent.replace(/href=["']\.\/styles\.css["']/g, 'href="/styles.css"');
        htmlContent = htmlContent.replace(/src=["']\.\/script\.js["']/g, 'src="/script.js"');
        
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(htmlContent);
    } else {
        res.status(404).json({
            error: 'index.html not found',
            debug: {
                cwd: process.cwd(),
                __dirname: __dirname,
                checkedPaths: possiblePaths,
                files: fs.existsSync(process.cwd()) ? fs.readdirSync(process.cwd()) : 'cwd not found'
            }
        });
    }
};
