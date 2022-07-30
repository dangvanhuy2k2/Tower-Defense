export default class Explosion {
  constructor(enemy) {
    this.enemy = enemy;
    this.image = document.getElementById("explosion");
    this.maxFrameX = 4;
    this.spriteWidth = this.image.width / this.maxFrameX;
    this.spriteHeight = this.image.height;
    this.frameX = 0;
    this.frameY = 0;
    this.timer = 0;
    this.markForDeletion = false;
  }

  update(c) {
    this.draw(c);
    ++this.timer;
    if (this.timer % 5 === 0) {
      ++this.frameX;
      if (this.frameX >= this.maxFrameX) this.markForDeletion = true;
    }
  }

  draw(c) {
    c.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.enemy.x - this.spriteWidth * 0.5,
      this.enemy.y - this.spriteHeight * 0.5,
      this.spriteWidth,
      this.spriteHeight
    );
  }
}
