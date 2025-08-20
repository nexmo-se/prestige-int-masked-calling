import { vcr, Voice } from "@vonage/vcr-sdk";
import express from 'express';

const app = express();
const port = process.env.VCR_PORT;

const DEST_NUMBER = process.env.DEST_NUMBER;

const session = vcr.createSession();
const voice = new Voice(session);

await voice.onCall('answer');
await voice.onCallEvent({ callback: "event" });

app.use(express.json());
app.use(express.static('public'));

app.get('/_/health', async (req, res) => {
    res.sendStatus(200);
});

app.get('/_/metrics', async (req, res) => {
    res.sendStatus(200);
});

app.post('/answer', async (req, res) => {
    console.log(`/answer | req.body: ${JSON.stringify(req.body)}`);
    const { to } = req.body;

    const ncco = [{
        "action": "talk",
        "text": "Please wait while we connect you"
    }, {
        "action": "connect",
        "from": to,
        "endpoint": [{
            "type": "phone",
            "number": DEST_NUMBER
        }]
    }]
    res.json(ncco);
});

app.post('/event', async (req, res) => {
    console.log(`/event | req.body: ${JSON.stringify(req.body)}`);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});