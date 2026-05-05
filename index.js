import http from 'node:http'
import path from 'node:path'
import { log } from 'node:console';

import "dotenv/config"
import express from "express";
import { Server, Socket } from 'socket.io'

import { publisher, subscriber, redis } from './redis-connection.js'
import { channel, subscribe } from 'node:diagnostics_channel';

const RATE_LIMIT_WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS) || 5000;
const CHECKBOX_SIZE = Number(process.env.CHECK_COUNT) || 500;
const CHECKBOX_STATE_KEY = 'checkbox-state-v1';


//For handling rate limiting fo per user tick checkboxes
const rateLimitingHashMap = new Map();

//In memory database to store the state of the checkboxes in a array format

async function main() {
    const PORT = process.env.PORT || 5000;


    const app = express();
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    await subscriber.subscribe('internal-server:checkbox:change')
    subscriber.on('message', (channel, message) => {
        if (channel === 'internal-server:checkbox:change') {
            const { index, checked } = JSON.parse(message)
            io.emit('server:checkbox:change', { index, checked });

        }

    })

    //Socket io handler
    io.on('connection', (socket) => {
        console.log(`Socket connected`, { id: socket.id })

        socket.on('client:checkbox:change', async (data) => {
            console.log(`[Socket: ${socket.id}]:client:checkbox:change`, data);

            const lastOperationTime = await redis.get(`rate:limiting:${socket.id}`)
            if (lastOperationTime) {
                const timeElapsed = Date.now() - lastOperationTime;
                if (timeElapsed < RATE_LIMIT_WINDOW) {
                    socket.emit('server:error', { error: `Please wait` });
                    return
                }
            }
            await redis.set(`rate:limiting:${socket.id}`, Date.now());

            const existingState = await redis.get(CHECKBOX_STATE_KEY);
            if (existingState) {
                const remoteData = JSON.parse(existingState);
                remoteData[data.index] = data.checked;
                await redis.set(CHECKBOX_STATE_KEY, JSON.stringify(remoteData));
            } else {
                await redis.set(
                    CHECKBOX_STATE_KEY,
                    JSON.stringify(new Array(CHECKBOX_SIZE).fill(false)),
                )
            }

            // io.emit('ser ver:checkbox:change',data)
            // state.checkboxes[data.index] =  data.checked
            await publisher.publish(
                'internal-server:checkbox:change',
                JSON.stringify(data),
            );

        })
    })


    //Express Handler
    app.use(express.static(path.resolve('./public')));

    app.get('/health', (req, res) => res.json({ healthy: true }));

    //this api  is to restore the previous state of the checkboxes for the new user
    app.get('/checkboxes', async (req, res) => {
        const existingState = await redis.get(CHECKBOX_STATE_KEY);
        if (existingState) {
            const remoteData = JSON.parse(existingState);
            return res.json({ checkboxes: remoteData })
        }
        return res.json({ checkboxes: new Array(CHECKBOX_SIZE).fill(false) })
    })



    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);

    });

}

main()