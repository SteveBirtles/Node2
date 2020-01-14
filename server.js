const express = require('express');
const http = require('http');
const ws = require('ws');

const app = express();

const server = http.createServer(app);

const wsServer = new ws.Server({ server });

let clientCount = 0;

let history = [];

wsServer.on('connection', client => {

    clientCount++;
    client.id = clientCount;

    for (let item of history) {
      client.send(`<span style="color:silver">${item}</span>`);
    }
    if (history.length > 0) client.send('<hr>');
    client.send(`<strong>Welcome!</strong> You are client ${client.id}.`);

    let greeting = `<strong>Client ${client.id} joined!</strong>`;
    wsServer.clients.forEach(c => {
        if (c != client) c.send(greeting);
    });
    console.log(greeting);
    history.push(greeting);

    client.on('message', message => {

        let broadcast = `<strong>Client ${client.id}:</strong> ${message}`;
        wsServer.clients.forEach(c => {
            if (c != client) c.send(broadcast);
        });
        console.log(broadcast);
        history.push(broadcast);

    });

    client.on('close', () => {

      let farewell = `<strong>Client ${client.id} disconnected!</strong>`;
      wsServer.clients.forEach(c => {
          if (c != client) c.send(farewell);
      });
      console.log(farewell);
      history.push(farewell);

    });

});

app.use('/client',
    (req, res, next) => {
        console.log("Serving static content: " + req.path);
        next();
    },
    express.static('client')
);

const httpPort = 8081;
const wsPort = 8082;

app.listen(httpPort, function(){
  console.log(`HTTP server started on port ${httpPort}`);
});

server.listen(wsPort, () => {
    console.log(`WebSocket server started on port ${wsPort}`);
});
