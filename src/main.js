
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 600,
    scene: [StartScene, TicTacToe],
    fps: { forceSetTimeOut: true, target: 30 }
    
}

const game = new Phaser.Game(config);