// app.js
const express = require('express');
const app = express();
const PORT = 3000;
const VERSION = '2.0';
app.get('/', (req, res) => {
 res.json({
 message: 'Hello from the CI/CD pipeline!',
 version: VERSION
 });
});
app.listen(PORT, () => {
 console.log(`App running on port ${PORT}, version ${VERSION}`);
});