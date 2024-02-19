const express = require('express');
const fs = require('fs'); 
const app = express();
const port = 3000;

app.use('/', express.static('public'));

let budgetData = {};

const rawData = fs.readFileSync('budget_data.json');
budgetData = JSON.parse(rawData);

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    res.json(budgetData);
});

app.listen(port, () => {
    console.log(`Example app liostening at http://localhost:${port}`);
});