var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

var PhaserGame = function () {

    this.bg = null;
    this.player = null;
    this.ground = null;
    this.cursors;

    this.cursors;
    this.jumpTimer = 0;
    // this.facing = 'right';
    // this.locked = false;
    // this.lockedTo = null;
    // this.wasLocked = false;
    // this.willJump = false;

};

PhaserGame.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    // set physics to arcade physics
    this.physics.startSystem(Phaser.Physics.ARCADE);
    // world gravity
    // this.physics.arcade.gravity.y = 600;
  },

  preload: function () {

      this.load.image('background', 'assets/waterBackground.png');
      this.load.image('floor', 'assets/waterFloor.png');
      this.load.spritesheet('shark', 'assets/shark1.png', 85, 47);
      this.load.spritesheet('mario', 'assets/mariosprite.png', 21, 35);

  }, //end of preload

  create: function () {

      this.background = this.add.tileSprite(0, 0, 800, 600, 'background');
      this.background.fixedToCamera = true;

      this.ground = this.add.tileSprite(0, 600, 800, 20, 'floor');
      this.ground.immovable = true;
      this.physics.arcade.enable(this.ground);
      this.ground.body.collideWorldBounds = true;

      this.baddie = this.add.sprite(200, 200, 'shark')
      this.physics.arcade.enable(this.baddie)
      this.add.physicsGroup()
      // baddie.addMotionPath([
      //   { x: "+0", xSpeed: 2000, xEase: "Linear", y: "+300", ySpeed: 2500, yEase: "Sine.easeIn" }
      // ])
      this.cursors = this.input.keyboard.createCursorKeys();

      // Create Player 1
      this.player = this.add.sprite(32, 0, 'mario')
      this.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;
      this.player.body.setSize(20, 20, 5, 16);
      this.player.body.gravity.y = 600;
      // this.player.physics.arcade.gravity.y = 600;

      this.player.animations.add('left', [0, 1, 2, 3, 4], 11, true);
      this.player.animations.add('turn', [4], 20, true);
      this.player.animations.add('right', [7, 8, 9, 10, 11], 11, true);

  },   //end of create

  update: function() {
    this.physics.arcade.collide(this.player, this.stationary);
    this.physics.arcade.collide(this.player, this.ground);
    // this.physics.arcade.collide(this.player, this.clouds, this.customSep, null, this);

    //  Do this AFTER the collide check, or we won't have blocked/touching set
    var standing = this.player.body.blocked.down || this.player.body.touching.down || this.locked;

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) { this.player.body.velocity.x = -150 }
    else if (this.cursors.right.isDown) { this.player.body.velocity.x = 150 }

    // if (standing && this.cursors.up.isDown) {
    //     if (this.locked)
    //     { this.cancelLock() }
    //     this.willJump = true;}
    // if (this.locked) {this.checkLock();}

  // game.physics.arcade.overlap(this.player, this.lava, lavaKill, null, this);
  }   //end of update
}

game.state.add('Game', PhaserGame, true);
