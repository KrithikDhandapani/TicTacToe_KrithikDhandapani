class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        // Preload assets
        this.load.setPath("./assets/");
        this.load.image('button', 'button.png'); // Make sure to have a button image in your assets folder
    }

    create() {
        // title text
        this.add.text(300, 200, 'Tic Tac Toe', { fontSize: '64px', fill: '#00BFFF' }).setOrigin(0.5);


        // Create the play button
        const playButton = this.add.rectangle(300, 400, 200, 80, 0xffffff).setInteractive();
        const playText = this.add.text(300, 400, 'Play', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);

        // Handle button click
        playButton.on('pointerdown', () => {
            this.scene.start("TicTacToe");
        });

        // change button appearance on hover
        playButton.on('pointerover', () => {
            playButton.setFillStyle(0xAAAAAA);
        });

        playButton.on('pointerout', () => {
            playButton.setFillStyle(0xFFFFFF);
        });
    }
}
