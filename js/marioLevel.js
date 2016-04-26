console.log('SANITY');
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

var MarioGame = function() {
  this.player1 = null;
  this.player2 = null;
  this.platforms;
  this.cursors;
  this.bullets;
  this.stars;
  this.score = 0;
  this.scoreText;
  this.pOneHealth = 100;
  this.pOneHealthText;
  this.pTwoHealth = 100;
  this.pTwoHealthText;
  this.fireButton;
  this.fireRate = 100;
  this.nextFire = 0;
}

MarioGame.prototype = {
  init: function () {
    this.game.renderer.renderSession.roundPixels = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function() {
    this.load.image('sky', 'assets/MarioLevelBackground.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('star', 'assets/star.png');
		this.load.image('box', 'assets/ledge2.png');
		this.load.image('littlebox', 'assets/box.png');
		this.load.image('pipe', 'assets/pipe2.png');
		this.load.image('bullet', 'assets/bullet2.png')
    this.load.spritesheet('dude', 'assets/MegaManWholeTest.png', 42, 49);
    this.load.spritesheet('mario', 'assets/mariosprite.png', 21, 35);
  },
  create: function() {
    this.add.sprite(0, 0, 'sky');
    this.platforms = this.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    var ground = this.platforms.create(0, this.world.height - 64, 'ground');

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    var ledge = this.platforms.create(250, 350, 'box');
    ledge.body.immovable = true;

    ledge = this.platforms.create(100, 350, 'littlebox');
    ledge.body.immovable = true;

		ledge = this.platforms.create(350, 200, 'littlebox');
    ledge.body.immovable = true;

		ledge = this.platforms.create(580, 450, 'pipe');
    ledge.body.immovable = true;

    // The player1 and its settings
    this.player1 = this.add.sprite(32, this.world.height - 150, 'dude');
    this.player2 = this.add.sprite(300, this.world.height - 350, 'mario');

    //  We need to enable physics on the player1
		this.player1.anchor.set(0.5);
    this.player2.anchor.set(0.5);

    this.physics.enable(this.player1, Phaser.Physics.ARCADE);
    this.physics.enable(this.player2, Phaser.Physics.ARCADE);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player1.body.bounce.y = 0.2;
    this.player1.body.gravity.y = 300;
    this.player1.body.collideWorldBounds = true;

    this.player2.body.bounce.y = 0.2;
    this.player2.body.gravity.y = 300;
    this.player2.body.collideWorldBounds = true;

    //  Character Movement
    this.player1.animations.add('left', [0, 1, 2, 3], 20, true);
    this.player1.animations.add('right', [6, 7, 8, 9], 20, true);
		this.player1.animations.add('jump', [10], 20, true);
		this.player1.animations.add('jumpdown', [18], 20, true);

    this.player2.animations.add('left', [0, 1, 2, 3, 4], 11, true);
    this.player2.animations.add('turn', [4], 20, true);
    this.player2.animations.add('right', [7, 8, 9, 10, 11], 11, true);

    this.pOneHealthText = game.add.text(16, 16, 'Player 1 Health: 100', {
      fontSize: '32px',
      fill: '#000'
    })

    this.pTwoHealthText = game.add.text(16, 48, 'Player 2 Health: 100', {
      fontSize: '32px',
      fill: '#000'
    })

		this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    //  Finally some stars to collect
    this.stars = this.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = this.stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

		//  The score
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Our controls.
    this.cursors = this.input.keyboard.createCursorKeys();
		this.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.A = this.input.keyboard.addKey(Phaser.Keyboard.A);
    this.D = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.W = this.input.keyboard.addKey(Phaser.Keyboard.W);
  },
  update: function() {
    //  Collide the player1 and the stars with the platforms
    this.physics.arcade.collide(this.player1, this.platforms);
    this.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the player1 overlaps with any of the stars, if he does call the collectStar function
    this.physics.arcade.overlap(this.player1, this.stars, this.collectStar, null, this);

    //  Reset the player1s velocity (movement)
    this.player1.body.velocity.x = 0;

    if (this.cursors.left.isDown)
    {
        //  Move to the left
        this.player1.body.velocity.x = -150;

        this.player1.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
        //  Move to the right
        this.player1.body.velocity.x = 150;

        this.player1.animations.play('right');
    }
		else if(this.cursors.up.isDown)
		{
			this.player1.animations.play('jump');
		}
		else if(this.cursors.down.isDown)
		{
			this.player1.animations.play('jumpdown');
		}
    else
    {
        //  Stand still
        this.player1.animations.stop();

        this.player1.frame = 5;
    }
    if(this.fireButton.isDown)
		{
			this.fire();
		}
    //  Allow the player1 to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player1.body.touching.down)
    {
        this.player1.body.velocity.y = -350;
    }

    //Player 2 motions
    this.physics.arcade.collide(this.player2, this.platforms);

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


  },
  collectStar: function(player1, star) {
    // Removes the star from the screen
    star.kill();

		//  Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;
  },
  fire: function() {
    if (this.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.time.now + this.fireRate;

        var bullet = this.bullets.getFirstDead();

        bullet.reset(this.player1.x, this.player1.y);

        this.physics.arcade.moveToXY(bullet, 500, 500, 400);
    }
  }
}

// Call game
game.state.add('Game', MarioGame, true);
