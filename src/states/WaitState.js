'use strict';

var state;

function createState(){
    this.game = game;
    state = {
        preload : function() {
            game.load.image('wait', 'assets/menu.jpg');
        },
        create : function() {
            game.add.tileSprite(0, 0, game.world.width, game.world.height, 'wait');
        }
    };
}

var game;

function initializeAndShow(){
    game.state.add('wait', state);
    game.state.start("wait");
}

module.exports = {
    createState : createState,
    show : initializeAndShow
};
