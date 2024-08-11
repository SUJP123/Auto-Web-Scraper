const express = require('express');

const app = express();
app.use(express.static(__dirname + '/dist/frontend'));
app.get('/*', function(req,res) {
    res.sendFile(__dirname+
    '/dist/frontend/index.html'); });

app.listen(process.env.PORT || 8080);
console.log("running");