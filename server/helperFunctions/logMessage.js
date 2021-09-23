module.exports = function logMessage(socket, message) {
  console.log('Received message from ' + socket.id);
  console.log(message.toString());
};
