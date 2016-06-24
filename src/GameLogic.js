'use strict';

var networkModule = require("./networking/NetworkModule");

var game;

var cursors;
var ship;
var bullets;
var bullet;

function initGame(){
    //for speed turn on canvas mode
    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2000, 2000);

    game.add.tileSprite(0, 0, game.world.width, game.world.height, 'space');

    ship = game.add.sprite(200, 200, 'starship');
    //turn on physics
    game.physics.arcade.enable(ship);
    //change main point of body to center
    ship.anchor.set(0.5);
    //set stopping of body
    ship.body.drag.set(50);
    //set max speed
    ship.body.maxVelocity.set(200);
    ship.body.collideWorldBounds = true;

    //  create buullets groub object
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    //maybe need more bullets
    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
}

function initNetworkCallbacks(){
    networkModule.setBulletCallback(addBullet);
    networkModule.setEnemyAppearCallback(addEnemy);
    //add callback for moving
}

function gameLoop(){
    checkButtons();
}

var leftButtonPressed = false;
var rightButtonPressed = false;
var upButtonPressed = false;

function checkButtons(){
    if(cursors.up.isDown){
        game.physics.arcade.accelerationFromRotation(ship.rotation, 100, ship.body.acceleration);
        if(!upButtonPressed) {
            upButtonPressed = true;
            networkModule.sendMoveCommand('UP', upButtonPressed);
        }
    } else {
        ship.body.acceleration.set(0);
        if(upButtonPressed){
            upButtonPressed = false;
            networkModule.sendMoveCommand('UP', upButtonPressed);
        }
    }
    if (cursors.left.isDown && !rightButtonPressed) {
        ship.body.angularVelocity = -100;
        if(!leftButtonPressed) {
            leftButtonPressed = true;
            networkModule.sendMoveCommand('LEFT', leftButtonPressed);
        }
    } else {
        if(leftButtonPressed && !rightButtonPressed){
            leftButtonPressed = false;
            networkModule.sendMoveCommand('LEFT', leftButtonPressed);
        }
        if (cursors.right.isDown && !leftButtonPressed) {
            ship.body.angularVelocity = 100;
            if(!rightButtonPressed) {
                rightButtonPressed = true;
                networkModule.sendMoveCommand('RIGHT', rightButtonPressed);
            }
        } else {
            ship.body.angularVelocity = 0;
            if(rightButtonPressed && !leftButtonPressed){
                rightButtonPressed = false;
                networkModule.sendMoveCommand('RIGHT', rightButtonPressed);
            }
        }
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        //hardcoded some gunCode now it is no matter or the server
        networkModule.sendShootCommand(1);
        fireBullet();
    }
}

var bulletTime = 0;

function fireBullet(){
    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false, true);

        if (bullet)
        {
            bullet.reset(ship.body.x + 15, ship.body.y + 15);
            //time of bullet living
            bullet.lifespan = 2000;
            bullet.rotation = ship.rotation;
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }
}

function addEnemy(){}
function addBullet(){}
function applyMoveCommand(){}

module.exports = {
    gameLoop : gameLoop,
    initGame : initGame
};