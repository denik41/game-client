'use strict';

var GameState = require("./states/GameState");
var MenuState = require("./states/MenuState");
var WaitState = require("./states/WaitState");
var NetworkModule = require("./networking/NetworkModule");

var GAME_STATE = "game";
var MENU_STATE = "menu";
var WAIT_STATE = "wait";

var game;
var currentState;
function initialize(){
    game = createGameBlock();
    GameState.createState(game);
    MenuState.createState(game);
    WaitState.createState(game);
}
initialize();

function createGameBlock(){
    return new Phaser.Game(1000, 500, Phaser.AUTO, 'gameDiv');
}

function showGameState(){
    game.state.start(GAME_STATE);
    currentState = GAME_STATE;
}

function showMenuState(){
    game.state.start(MENU_STATE);
    currentState = MENU_STATE;
}

function showWaitState(){
    game.state.start(WAIT_STATE);
    currentState = WAIT_STATE;
}

module.exports = {
    showGameState : showGameState,
    showMenuState : showMenuState,
    showWaitState : showWaitState
};