const config = {
  type: Phaser.AUTO,
  width: 1400,
  height: 650,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }, // Tyngdkraft på bollen
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

let player;
let ball;
let balls = [];
let cursor;
let ground;
let lives = 3;
let lifeIcons = [];
let gameOverImage;
let score = 0;
let scoreText;

function preload() {
  this.load.image("background", "images/spelgrund.png");
  this.load.image("ball", "images/boll.png");
  this.load.image("player", "images/idle1.png");
  this.load.image("life", "images/liv.png");
  this.load.image("gameOver", "images/GameOver.png");
}

function create() {
  this.add.image(700, 325, "background").setDisplaySize(1400, 650);

  player = this.physics.add.sprite(550, 600, "player");
  player.setCollideWorldBounds(true);
  player.body.setAllowGravity(true);
  player.setScale(2);

  ball = createBall(this);
  balls.push(ball);

  ground = this.physics.add.staticGroup();
  ground.create(700, 670, null).setSize(1400, 45);

  cursor = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(balls, ground, bounceOnGround, null, this);
  this.physics.add.collider(player, balls, hitBall, null, this);
  this.physics.add.collider(balls, balls, ballsCollide, null, this);

  updateLifeIcons(this);

  gameOverImage = this.add.image(700, 325, "gameOver").setAlpha(0);
  scoreText = this.add.text(60, 50, `Poäng: ${score}`, {
    fontSize: "32px",
    fill: "#000000",
  });
}

function update() {
  if (cursor.left.isDown) {
    player.setVelocityX(-700);
    player.setScale(2);
    player.setOrigin(1, 0.5);
    player.body.setOffset(0, 0);
  } else if (cursor.right.isDown) {
    player.setVelocityX(700);
    player.setScale(-2, 2);
    player.setOrigin(0, 0.5);
    player.body.setOffset(player.width, 0);
  } else {
    player.setVelocityX(0);
  }

  scoreText.setText(`Poäng: ${score}`);

  if (score >= 10 && balls.length === 1) {
    let newBall = createBall(this);
    balls.push(newBall);
  }
}

function updateLifeIcons(scene) {
  lifeIcons.forEach((lifeIcon) => lifeIcon.destroy());
  lifeIcons = [];

  for (let i = 0; i < lives; i++) {
    let xPosition = 1300 - i * 40;
    let lifeIcon = scene.add.sprite(xPosition, 50, "life").setScale(0.1);
    lifeIcons.push(lifeIcon);
  }
}

function ballsCollide(ball1, ball2) {
  ball1.setVelocityX(ball1.body.velocity.x * -1);
  ball2.setVelocityX(ball2.body.velocity.x * -1);
}

function hitBall(player, ball) {
  if (score < 20) {
    ball.setVelocityY(-400);
  } else if (score >= 20) {
    ball.setVelocityY(-500);
  }

  ball.setAngularVelocity(ball.body.angularVelocity + 50);
  score += 1;
}

function bounceOnGround(ball, ground) {
  ball.setVelocityY(-350);

  lives--;

  if (lives <= 0) {
    console.log("Game Over!");
    this.scene.pause();
    gameOverImage.setAlpha(1);
  } else {
    updateLifeIcons(this);
  }

  score--;
}

function createBall(scene) {
  let newBall = scene.physics.add.sprite(
    Phaser.Math.Between(200, 1200),
    100,
    "ball",
  );
  newBall.setCollideWorldBounds(true);
  newBall.setBounce(1);
  newBall.setVelocity(Phaser.Math.Between(-200, 200), 200);
  newBall.setScale(1.5);
  return newBall;
}
