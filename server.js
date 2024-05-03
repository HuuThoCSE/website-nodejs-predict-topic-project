const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware để xử lý dữ liệu dạng JSON
app.use(bodyParser.json());

// Route để xác nhận webhook (GET request)
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Route để xử lý các sự kiện từ Messenger (POST request)
app.post('/webhook', (req, res) => {
    let body = req.body;

    // Kiểm tra xem có phải sự kiện từ page không
    if (body.object === 'page') {
        body.entry.forEach(function(entry) {
            let webhook_event = entry.messaging[0];
            console.log('Webhook event received:', webhook_event);
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
