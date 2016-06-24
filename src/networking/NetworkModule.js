'use strict';

var socketConnection = require("./SocketConnection");

//написати десь в другому місці поки хз де
socketConnection.openConnection();
socketConnection.setIncomingMessageResolver(incomingMessageResolver);

var shootCallback;
function setBulletCallback(shootCallback){
    this.shootCallback = shootCallback;
}

var playerAppearCallback;
function setPlayerAppearCallback(playerAppearCallback){
    this.enemyCallback = playerAppearCallback;
}

function sendAuthRequest(login, password) {
    var message = {
        login : login,
        password : password,
        clientKeyHash : clientKeyHash
    };
    socketConnection.sendMessage(message);
    console.log("send authorization request");
}

function sendMoveCommand(buttonCode, isDown){
    var message = {
        buttonCode : buttonCode,
        isDown : isDown,
        clientHash : clientKeyHash
    };
    socketConnection.sendMessage(message);
    console.log("send move command");
}

function sendShootCommand(gunId){
    var message = {
        gunId : gunId,
        clientHash : clientKeyHash
    };
    socketConnection.sendMessage(message);
    console.log("send shoot command");
}

var isAuthorized;
var clientKeyHash;
//add move checking and refactor this peace of code with methods for checking and loop
function incomingMessageResolver(message){
    var json = JSON.parse(message);
    if(isAuthorized){
        for(var i = 0;i < messagesHandler.length;i++){
            messagesHandler[i].checkCommand(json);
        }
    } else {
        if (json.hasOwnProperty("clientKeyHash")) {
            this.isAuthorized = true;
            clientKeyHash = json.clientKeyHash;
            authCallback(json.clientKeyHash);
        }
    }
}

var messagesHandler = [
    new CommandHandler(checkMovePlayerCommand, moveCallback),
    new CommandHandler(checkShootCommand, shootCallback),
    new CommandHandler(checkAppearPlayerCommand, playerAppearCallback)
]

function checkMovePlayerCommand(json){
    return json.hasOwnProperty("player");
}

function checkShootCommand(json){}

function checkAppearPlayerCommand(json){}

function CommandHandler(checkFunction, callback){
    this.checkFunction = checkFunction;
    this.callback = callback;
}

CommandHandler.prototype.checkCommand = function(json){
    if(this.checkFunction(json)){
        this.callback(json);
        return true;
    }
    return false;
}

module.exports = {
    sendAuthRequest : sendAuthRequest,
    setAuthorizeCallback : null,
    sendShootCommand : sendShootCommand,
    setBulletCallback : setBulletCallback,
    sendMoveCommand : sendMoveCommand,
    setEnemyAppearCallback : setPlayerAppearCallback,
    sendAbilityCommand : null,
    setAbilityCallback : null,
    setMoveCallback : null
};
