
const fs = require('fs');
const http = require('http');

let connectionCounter = 1;

http.createServer(function (request, response) {


    // response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Access-Control-Request-Method', '*');
    // response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    // response.setHeader('Access-Control-Allow-Headers', '*');

    if (request.url === '/') {

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(fs.readFileSync('index.html'));
        response.end();

    } else if (request.url === '/events') {

        let currentConnection = connectionCounter++;
        let currentEvent = 1;

        console.log(
            'Client connected (connection #'
            + currentConnection
            + ', Last-Event-Id: '
            + request.headers['last-event-id']
            + ')'
        );

        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'Keep-Alive'
        });

        const timerId = setInterval(() => {
            // const eventStream =
            //     'event: my-event\n' +
            //     'id: ' + (currentConnection + currentEvent) + '\n' +
            //     `data: {"event": "# ${currentEvent++}", "connection": "# ${currentConnection}"}\n\n`

            const eventStream = 'event: my-event\n' +
                'id: ' + (currentConnection + currentEvent) + '\n' +
                'data: event #' + currentEvent++
                + ' of connection #' + currentConnection + '\n\n'

            response.write(eventStream);
        }, 2000);


        request.on('close', () => {
            console.log('Client disconnected (connection #' + currentConnection + ')');
            response.end();
            clearInterval(timerId);
        });

    } else {
        response.writeHead(404);
        response.end();
    }

}).listen(3000);