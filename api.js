/**
 * Creates a Socket.io server on the specified port.
 * Connects to the specified MQTT server on the specified topic.
 * Each MQTT message received gets sent to all of the Socket.io clients.
 */

const mqtt = require('mqtt');
const http = require('http');

const port = process.env.PORT ?? 3000; // For Heroku
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com:1883'); // Free MQTT broker with relatively good performance
const mqttTopic = 'topic';
const socketioTopic = 'topic';

// Create the server
const serverHttp = http.createServer();
const io = require('socket.io')(serverHttp, {
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});
serverHttp.listen(port,"0.0.0.0");

// Socket.io
io.origins((origin, callback) => {
    callback(null, true);
});
io.on('connection', (socket) => {
    console.log("[*] New Socket.io connection");
    socket.on(socketioTopic, (message) => {
        console.log(`[*] New Socket.io message: ${message}`);
        console.log(`[+] Sending MQTT message: ${message} to the topic: ${mqttTopic}`);
        client.publish(mqttTopic, message, {"qos": 2});
    });
});

// MQTT
mqttClient.on('connect', function () {
    mqttClient.subscribe(mqttTopic, function (err) {
        if (err) {
            console.log(`[-] Error: connect: Error connecting to the MQTT topic: ${mqttTopic}`);
        }
        else {
            console.log(`[*] Connected to the MQTT server on the topic: ${mqttTopic}`);
        }
    })
})
mqttClient.on('message', function (topic, message) {
    // message is a Buffer
    console.log(`[*] New MQTT message: ${message.toString()} to the topic ${topic}`);
    //mqttClient.end() // To end the MQTT socket
    console.log(`[+] Sending Socket.io message: ${message} to all Socket.io clients`);
    io.emit('message', message.toString());
})