'use strict';

var state;

function createState(game){
    this.game = game;
    state = {
        preload : function() {
            game.load.image('menu', 'assets/menu.jpg');
        },
        create : function() {
            game.add.tileSprite(0, 0, game.screen.width, game.screen.height, 'menu');
        }
    };
}

var game;

function initializeAndShow(){
    game.state.add('menu', state);
    game.state.start("menu");
}

module.exports = {
    createState : createState,
    show : initializeAndShow
};


