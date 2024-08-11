const express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist/frontend/browser'));

app.get('/*', (req, res) => {
    const type = mime.getType(req.path);
    if (type) {
      res.setHeader('Content-Type', type);
    }
    res.sendFile(__dirname +  '/dist/frontend/browser/index.html');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
