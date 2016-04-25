var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

function preload() {

    game.load.image('background', 'assets/background2.jpg');


}   //end of preload

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0,'background');


}   //end of create

function update() {

}   //end of update

