var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game')

var PhaserGame = function () {
  this.player1 = null;
  this.player2 = null;
  this.ground = null;
  this.cursors;
  this.jumpTimer = 0;
  this.pOneHealth = 100;
  this.pOneHealthText;
  this.pTwoHealth = 100;
  this.pTwoHealthText;
  this.stationary = null;
};

PhaserGame.prototype = {
  // Initialize Game Render and Physics Systen
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function () {
    // Load assets
    this.load.image('background', 'assets/coralBackground.png');
    this.load.image('rightPlatform', 'assets/rightwaterplatform.png');
    this.load.image('smallLeftPlatform', 'assets/smallLeftWaterPlatform.png');
    this.load.image('floor', 'assets/waterFloor.png');
    this.load.image('bubble', 'assets/bubble.png');
    this.load.spritesheet('shark', 'assets/shark1.png', 85, 47);
    this.load.spritesheet('mario', 'assets/mariosprite.png', 21, 35);
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  }, //end of preload

  create: function () {
    // Initialize background
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

    // Run animation for baddies
    this.baddies.callAll('start');

    // Instantiate cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create Player 1
    this.player1 = this.add.sprite(0, 500, 'mario')
    this.physics.arcade.enable(this.player1);
    this.player1.body.collideWorldBounds = true;
    this.player1.body.setSize(20, 20, 5, 16);
    this.player1.body.gravity.y = 600;

    // Player directional animations
    this.player1.animations.add('left', [0, 1, 2, 3, 4], 11, true);
    this.player1.animations.add('turn', [4], 20, true);
    this.player1.animations.add('right', [7, 8, 9, 10, 11], 11, true);

    // Player1 pOneHealth indicator
    this.pOneHealthText = game.add.text(16, 16, 'Player 1 Health: 100', {
      fontSize: '32px',
      fill: '#000'
    })

    // Create Player 2
    this.player2 = this.add.sprite(700, 100, 'dude')
    this.physics.arcade.enable(this.player2);
    this.player2.body.collideWorldBounds = true;
    this.player2.body.setSize(20, 31, 5, 16);
    this.player2.body.gravity.y = 600;

    // Player directional animations
    this.player2.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player2.animations.add('turn', [4], 20, true);
    this.player2.animations.add('right', [5, 6, 7, 8], 10, true);
    // Add new keys for keyboard input for player 2
    this.A = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.D = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.W = this.input.keyboard.addKey(Phaser.Keyboard.W);

    // Player2 pOneHealth indicator (P2)
    this.pTwoHealthText = game.add.text(16, 48, 'Player 2 Health: 100', {
      fontSize: '32px',
      fill: '#000'
    })
  },   //end of create

  update: function() {
  // PLAYER 1
    // Player1 Physics
    this.physics.arcade.collide(this.player1, this.stationary);
    this.physics.arcade.collide(this.player1, this.ground);
    this.physics.arcade.collide(this.player1, this.shark);

    this.player1.body.velocity.x = 0;

    if (this.cursors.left.isDown) {
      this.player1.body.velocity.x = -150;
      this.player1.animations.play('left');
    }
    else if (this.cursors.right.isDown) {
      this.player1.body.velocity.x = 150;
      this.player1.animations.play('right');
    } else {
      this.player1.animations.stop();
      this.player1.frame = 6;
    }

    // conditional for jumping
    if (this.cursors.up.isDown) {
      this.player1.body.velocity.y = -350;
    }

    // Decrement player1 pOneHealth when colliding with shark
    game.physics.arcade.overlap(this.player1, this.shark, pOneLowerHealth, null, this);

    // Function: Lower player1 pOneHealth, kill player1 (P1)
    function pOneLowerHealth(player1, shark) {
      this.pOneHealth -= 10;
      this.pOneHealthText.text = 'Player One Health:' + this.pOneHealth
      console.log('PlayerOne vs. Shark');
      if (this.pOneHealth === 0) {
        player1.kill()
      }
    }

  // PLAYER 2
    // Player2 Physics
    this.physics.arcade.collide(this.player2, this.stationary);
    this.physics.arcade.collide(this.player2, this.ground);
    this.physics.arcade.collide(this.player2, this.shark);

    this.player2.body.velocity.x = 0;

    if (this.A.isDown) {
      this.player2.body.velocity.x = -150;
      this.player2.animations.play('left');
    }
    else if (this.D.isDown) {
      this.player2.body.velocity.x = 150;
      this.player2.animations.play('right');
    } else {
      this.player2.animations.stop();
      this.player2.frame = 4;
    }

    // Conditional for jumping (P2)
    if (this.W.isDown) {
      this.player2.body.velocity.y = -350;
    }

    // Decrement player2 pTwoHealth when colliding with shark (P2)
    game.physics.arcade.overlap(this.player2, this.shark, pTwoLowerHealth, null, this);

    // Function: Lower player2 health, kill player2
    function pTwoLowerHealth(player2, shark) {
      this.pTwoHealth -= 10;
      this.pTwoHealthText.text = 'Player Two Health:' + this.pTwoHealth
      console.log('Player2 vs. Shark');
      if (this.pTwoHealth === 0) {
        player2.kill()
      }
    }

    // Add bubbles
    Bubble();

  }   //end of update
}

Baddie = function (game, x, y, key, group) {
  if (typeof group === 'undefined') {
    group = game.world; }

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
