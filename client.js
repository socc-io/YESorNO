var io = require('socket.io-client'),
socket = io.connect('localhost', {
    port: 3000
});
socket.on('connect', function () { console.log("socket connected"); });
