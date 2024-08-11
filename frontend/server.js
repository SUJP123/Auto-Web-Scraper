const express = require('express');

const app = express();
app.use(express.static(__dirname + '/dist/browser/frontend'));

app.listen(process.env.PORT || 8080);


app.get('/*', function(req,res) {
    res.sendFile(__dirname+
    '/dist/frontend/browser/index.html'); });


console.log("running");