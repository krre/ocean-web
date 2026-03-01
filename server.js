import { handler } from './build/handler.js';
import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();
const port = 3000;

const sslOptions = {
    key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH))
};

app.use(handler);

https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
});
