var websms = require('./index.js');

var client = new websms.Client('abcd', '1234');
var message = new websms.TextMessage('Huhu', ['1234']);
var binmessage = new websms.BinaryMessage(["BQAD/AIBWnVzYW1tZW4=", "BQAD/AICZ2Vmw7xndC4="], ['1234']);

client.send(message, 1, false, function (error, response) {
    if (error) {
        console.log(error);
    }
    client.send(binmessage, 1, false, function (error, response) {
        if (error) {
            return console.log(error);
        }
    });
});