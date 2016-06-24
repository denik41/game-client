'use strict';

var SocketConnection = require("./../networking/SocketConnection.js");
var GameLogic = require("./../GameLogic");

var connection = SocketConnection.connection;
var messageSender;
var messageReceiver;
var game;

function initialize(){
    return new Promise(function(resolve, reject){
        connection.openConnection(resolve);
        messageReceiver = new MessageReceiver(eventCallback, playerCallback);
        messageSender = new MessageSender(connection);
        SocketConnection.createSocketCallbacks.call(connection, messageReceiver.messageresolver.bind(messageReceiver));
    })
        .then(function() {
            messageSender.sendAuthMessage("login", "password");
            loadLocalKeySettings();
            return new Promise(function(resolve, reject){
                messageReceiver.authCallback = function (clientKeyHash) {
                    messageSender.clientKeyHash = clientKeyHash;
                    resolve();
                };
            });
        })
        .then(function(){
            if(keySettings) {
                messageSender.sendInitButtonsMessage();
                messageReceiver.initKeysCallback = function (json) {
                    //init keys settings
                };
            }
        })
        .then(function(){
            game.state.add('main', mainState);
            //game.state.start("main");
        });
}

function isInitialized(){}

function show(){
    if(isInitialized()){

    }
}

var keySettings;
function loadLocalKeySettings(){
    //if existed returns true and load key settings
    //else false

    //now stub to exclude request to the server
    keySettings = {};
}



var mainState;

function createState(game) {
    this.game = game;
    mainState = {
        preload: function () {
            game.load.image("starship", "assets/ship.png");
            game.load.image("space", "assets/deep-space.jpg");
            game.load.image('bullet', 'assets/bullets.png');
        },

        create: GameLogic.initGame,

        update: GameLogic.gameLoop
    };
}

function eventCallback(json){}

function playerCallback(json){}

module.exports = {
    createState : createState,
    show : show
};