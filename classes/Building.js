import Projectile from "./Projectile.js";

export default class Building {
  constructor({ x = 0, y = 0 }) {
    this.x = x;
    this.y = y;
    this.width = 64 * 2;
    this.height = 64;
    this.center = {
      x: this.x + this.width * 0.5,
      y: this.y + this.height * 0.5,
    };
    this.projectiles = [];
    this.radius = 250;
    this.timerId = null;
    this.isAttacking = true;
    this.image = document.getElementById("tower");
    this.maxFrameX = 19;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = this.image.width / this.maxFrameX;
    this.spriteHeight = this.image.height;
    this.timer = 0;
    this.target = null;
  }
  update(c) {
    this.draw(c);
    ++this.timer;
    if (this.timer % 5 === 0) {
      if (this.target || (!this.target && this.frameX !== 0)) ++this.frameX;
      if (this.frameX >= this.maxFrameX) this.frameX = 0;
    }

    if (!this.isAttacking && !this.timerId) {
      this.timerId = setTimeout(() => {
        this.isAttacking = true;
        this.timerId = null;
      }, 1000);
    }

    if (this.target && this.frameX === 6) {
      this.shoot();
      this.target = null;
    }
  }

  shoot() {
    this.projectiles.push(
      new Projectile({
        x: this.center.x - 20,
        y: this.center.y - 100,
        enemy: this.target,
      })
    );
  }
  draw(c) {
    // c.fillStyle = "blue";
    // c.fillRect(this.x, this.y, this.width, this.height);

    //draw radius
    c.fillStyle = "rgba(0,0,0,0.05)";
    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
    c.stroke();

    c.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.spriteHeight * 0.5,
      this.spriteWidth,
      this.spriteHeight
    );

    // this.projectiles.forEach((projectile) => projectile.update(c));
  }
}
