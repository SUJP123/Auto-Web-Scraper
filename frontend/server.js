const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/frontend'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+
'/dist/frontend/src/index.html'));});
console.log("running");
app.listen(8080);