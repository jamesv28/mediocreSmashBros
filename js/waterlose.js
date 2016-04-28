var loseState = {
  create: function () {

    var loseLabel = game.add.text(80, 80, 'GAME OVER! Try Again?', { font: '25px Arial', fill: '#ffffff'})

    var startLabel = game.add.text(80, game.world.height-80, 'Press the "W" key to try again.', {font: "25px Arial", fill: "#ffffff"})

    var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    wkey.onDown.addOnce(this.restart, this)

  },

  restart: function () {
    game.state.start('Game');
    game.state.states.Game.lost = false;
    game.state.states.Game.playerHealth = 100;
  }
}
