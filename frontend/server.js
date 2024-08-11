const express = require('express');
const path = require('path');

const app = express();
const staticPath = path.join(__dirname, 'dist/frontend/browser');

app.use((req, res, next) => {
    const mime = import('mime');

  app.use((req, res, next) => {
    const type = mime.getType(req.path);
    if (type) {
      res.setHeader('Content-Type', type);
    }
    next();
    });
});

app.use(express.static(staticPath));

app.get('/*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
