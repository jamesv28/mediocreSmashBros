var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

function preload() {

    game.load.image('background', 'assets/waterBackground.png');
    game.load.image('floor', 'assets/waterFloor.png');
    game.load.spritesheet('shark', 'assets/shark1.png', 85, 47);


}   //end of preload

//instantiate assets
var player;
// var shark;
var platforms;
var sand;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.tileSprite(0, 0, 800, 600, 'background');
    // game.add.tileSprite(0, 900, 640, 20, 'floor');

    sand = game.add.group();
    sand.enableBody = true;

    var ground = sand.create(0, game.world.height - 50, 'floor');
    ground.immovable = true;

    // shark = game.add.group();
    // shark.enableBody = true;

    var baddie = game.add.sprite(200, 200, 'shark')
    game.physics.arcade.enable(baddie)
    game.add.physicsGroup()
    // baddie.addMotionPath([
    //   { x: "+0", xSpeed: 2000, xEase: "Linear", y: "+300", ySpeed: 2500, yEase: "Sine.easeIn" }
    // ])


}   //end of create

function update() {

}   //end of update
