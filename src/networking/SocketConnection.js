"use strict";

var networkConfig = require("./../config/NetworkConfig");
var socket;

function openConnection(callback){
    socket = new WebSocket(networkConfig.GAME_SERVER_ADDRESS);

    socket.onopen = function() {
        console.log("Соеденение установлено!");
        if(callback) callback();
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log('Соединение закрыто чисто');
        } else {
            console.log('Обрыв соединения'); // например, "убит" процесс сервера
        }
        console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

    socket.onmessage = function(event) {
        console.log("Получены данные " + event.data);
        if(resolveFunction)
            resolveFunction(event.data);
        else
            console.log("Ошибка с насначением обработчика");
    };

    this.socket.onerror = function(error) {
        console.log("Ошибка " + error.message);
    };
}

function sendMessage(messageObject){
    this.socket.send(JSON.stringify(messageObject));
}

var resolveFunction;
function setIncomingMessageResolver(resolveFunction){
    this.resolveFunction = resolveFunction;
}

function closeConnection(){
    this.socket.close();
}

module.exports = {
    openConnection : openConnection,
    sendMessage : sendMessage,
    setIncomingMessageResolver : setIncomingMessageResolver,
    closeConnection : closeConnection
};