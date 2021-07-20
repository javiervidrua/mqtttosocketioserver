/**
 * Connects to a Socket.io server and prints the messages that get sent to the specified topic
 */

const io = require("socket.io-client");

const server = "http://localhost:3000";
const port = 3000;
const topic = "topic";

const socket = io(server);

console.log(socket.id); // undefined
socket.on("connect", () => {
  console.log(socket.id); // 'G5p5...'
});

socket.on(topic, (message) => {
  console.log(message);
});
