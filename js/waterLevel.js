var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

var PhaserGame = function () {
  this.player = null;
  this.ground = null;
  this.cursors;
  this.jumpTimer = 0;
  this.health = 100;
  this.healthText;
  this.stationary = null;
};

PhaserGame.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    this.load.image('background', 'assets/coralBackground.png');
    this.load.image('rightPlatform', 'assets/rightwaterplatform.png');
    this.load.image('smallLeftPlatform', 'assets/smallLeftWaterPlatform.png');
    this.load.image('floor', 'assets/waterFloor.png');
    this.load.image('bubble', 'assets/bubble.png');
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

    // create platforms
    this.stationary = this.add.physicsGroup();
    this.stationary.create(550, 150, 'rightPlatform');
    this.stationary.create(0, 300, 'smallLeftPlatform');

    this.stationary.setAll('body.allowGravity', false);
    this.stationary.setAll('body.immovable', true);

    // create shark baddie
    this.baddies = this.add.physicsGroup();
    this.shark = new Baddie(this.game, -100, 400, 'shark', this.baddies)
    this.shark.addMotionPath([
      { x: "+900", xSpeed: 6000, xEase: "Linear", y: "+0", ySpeed: 2500, yEase: "Sine.easeIn",
     }
    ])

    // Start baddies
    this.baddies.callAll('start');

    // Instantiate cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create Player 1
    this.player = this.add.sprite(0, 500, 'mario')
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(20, 20, 5, 16);
    this.player.body.gravity.y = 600;

    // Player directional animations
    this.player.animations.add('left', [0, 1, 2, 3, 4], 11, true);
    this.player.animations.add('turn', [4], 20, true);
    this.player.animations.add('right', [7, 8, 9, 10, 11], 11, true);

    // Player health indicator
    this.healthText = game.add.text(16, 16, 'Player 1 Health: 100', {
      fontSize: '32px',
      fill: '#000'
    })
  },   //end of create

  update: function() {
    this.physics.arcade.collide(this.player, this.stationary);
    this.physics.arcade.collide(this.player, this.ground);
    this.physics.arcade.collide(this.player, this.shark);

    this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -150;
      this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 150;
      this.player.animations.play('right');
    } else {
      this.player.animations.stop();
      this.player.frame = 6;
    }

    // conditional for jumping
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -350;
    }

    // Decrement player health when colliding with shark
    game.physics.arcade.overlap(this.player, this.shark, lowerHealth, null, this);

    // Function: Lower player health, kill player
    function lowerHealth(player, shark) {
      this.health -= 10;
      this.healthText.text = 'Health:' + this.health
      console.log('test');
      if (this.health === 0) {
        player.kill()
      }
    }

    // Add bubbles
    // if (this.bubble.y > 0) {
      Bubble();
    // }
    // console.log(this.bubble)


  }   //end of update
}

Baddie = function (game, x, y, key, group) {
  if (typeof group === 'undefined') {
    group = game.world; }

  Phaser.Sprite.call(this, game, x, y, key);
  console.log(key)
  game.physics.arcade.enable(this);
  this.anchor.x = 0.5;
  this.body.customSeparateX = true;
  this.body.customSeparateY = true;
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.playerLocked = false;
  group.add(this);
};

// Adding Bubbles
Bubble = function () {
  for (var i = 0; i < 1; i ++) {
    this.bubbles = game.add.group();
    this.bubbles.enableBody = true;
    var x = Math.random()*800;
    this.bubble = this.bubbles.create(x, 900, 'bubble');
    this.bubble.body.gravity.y = -100;
    }
  }

// Adding Moving Platforms
MovingPlatform = function (game, x, y, key, group) {
  if (typeof group === 'undefined') { group = game.world; }
  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.arcade.enable(this);
  this.anchor.x = 0.5;
  this.body.customSeparateX = true;
  this.body.customSeparateY = true;
  this.body.allowGravity = false;
  this.body.immovable = true;
  this.playerLocked = false;
  group.add(this);
};


// Prototypes

Baddie.prototype = Object.create(Phaser.Sprite.prototype);
Baddie.prototype.constructor = Baddie;

Baddie.prototype.addMotionPath = function (motionPath) {
  this.tweenX = this.game.add.tween(this.body);
  this.tweenY = this.game.add.tween(this.body);

  for (var i = 0; i < motionPath.length; i++)
  { this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
    this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);}
  this.tweenX.loop();
  this.tweenY.loop();
};

Baddie.prototype.start = function () {
  this.tweenX.start();
  this.tweenY.start();
};

Baddie.prototype.stop = function () {
  this.tweenX.stop();
  this.tweenY.stop();
};

MovingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.addMotionPath = function (motionPath) {
    this.tweenX = this.game.add.tween(this.body);
    this.tweenY = this.game.add.tween(this.body);
    for (var i = 0; i < motionPath.length; i++)
    {
        this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
        this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);
    }
    this.tweenX.loop();
    this.tweenY.loop();
};

MovingPlatform.prototype.start = function () {
    this.tweenX.start();
    this.tweenY.start();
};

MovingPlatform.prototype.stop = function () {
    this.tweenX.stop();
    this.tweenY.stop();
};

// Call game
game.state.add('Game', PhaserGame, true);
