const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        code: 200,
        status: true,
        message: 'Automation API is running'
    })
})

module.exports = app;