var winState = {
  create: function () {

    var background = game.add.tileSprite(0, 0, 800, 600, 'background')

    var winLabel = game.add.text(80, 80, 'YOU WON!', { font: '25px Arial', fill: '#ffffff'})

    var startLabel = game.add.text(80, 200, 'Press the "W" key to restart', {font: "25px Arial", fill: "#ffffff"})

    var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    wkey.onDown.addOnce(this.restart, this)

  },

  restart: function () {
    game.state.start('Game')
    game.state.states.Game.playerHealth = 100;
  }
}
