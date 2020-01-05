const express = require('express');
const http = require('http');
const ws = require('ws');

const app = express();

const server = http.createServer(app);

const wsServer = new ws.Server({ server });

let clientCount = 0;

wsServer.on('connection', client => {

    clientCount++;
    client.id = clientCount;

    console.log("Client connected [" + client.id + "]");
    client.send(`Welcome! You are client ${client.id}.`);

    client.isAlive = true;

    client.on('pong', () => {
        console.log("Pong [" + client.id + "]");
        client.isAlive = true;
    });

    client.on('message', message => {

        console.log(`Recieved [${client.id}]: ${message}`);

        wsServer.clients.forEach(c => {
            if (c != client) {
                c.send(message);
            }
        });

    });

    client.on('close', () => {
        console.log("Client disconnected [" + client.id + "]");
    });

});

setInterval(() => {

    wsServer.clients.forEach(client => {

        if (!client.isAlive) {
            console.log("Client lost [" + client.id + "]");
            return client.terminate();
        }

        client.isAlive = false;
        console.log("Ping [" + client.id + "]");
        client.ping(null, false, true);

    });

}, 10000);

server.listen(8082, () => {

    console.log(`WebSocket Server started on port ${server.address().port}`);

});
