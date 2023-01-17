const path = require('path');
const express = require('express');
const app = express();
const port = 3003;

app.route('/').get((_req, res) => {
	res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.use(express.static(__dirname + '/../client'));
app.use(express.static(__dirname + '/../../../dist'));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
