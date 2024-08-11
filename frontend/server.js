const express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist/frontend/browser'));

app.get('/*', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(__dirname +  '/dist/frontend/browser/index.html');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
