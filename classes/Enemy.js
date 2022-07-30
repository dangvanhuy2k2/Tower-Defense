import waypoints from "../waypoint.js";

export default class Enemy {
  constructor({ x = 0, y = 0 }) {
    this.radius = 50;
    this.x = x;
    this.y = x;
    this.health = 100;
    this.waypointIdx = 0;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.speed = 2;
    this.image = document.getElementById("enemy");
    this.maxFrameX = 7;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = this.image.width / this.maxFrameX;
    this.spriteHeight = this.image.height;
    this.timer = 0;
  }
  update(c) {
    this.draw(c);
    ++this.timer;
    if (this.timer % 20 === 0) {
      ++this.frameX;
      if (this.frameX >= this.maxFrameX) this.frameX = 0;
    }

    const waypoint = waypoints[this.waypointIdx];
    const yDistance = waypoint.y - this.y;
    const xDistance = waypoint.x - this.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.velocity.x = Math.cos(angle);
    this.velocity.y = Math.sin(angle);

    this.x += this.velocity.x * this.speed;
    this.y += this.velocity.y * this.speed;

    if (
      Math.abs(Math.round(this.x) - Math.round(waypoint.x)) <
        Math.abs(this.velocity.x * this.speed) &&
      Math.abs(Math.round(this.y) - Math.round(waypoint.y)) <
        Math.abs(this.velocity.y * this.speed) &&
      this.waypointIdx < waypoints.length
    )
      ++this.waypointIdx;
  }
  draw(c) {
    //health
    c.fillStyle = "red";
    c.fillRect(
      this.x - this.radius,
      this.y - this.radius - 15,
      this.radius * 2,
      10
    );
    c.fillStyle = "green";
    c.fillRect(
      this.x - this.radius,
      this.y - this.radius - 15,
      (this.health / (this.radius * 2)) * 100,
      10
    );

    // c.beginPath();
    // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // c.fill();
    // c.closePath();

    // c.fillStyle = "blue";
    // c.fillRect(
    //   this.x - this.spriteWidth * 0.5,
    //   this.y - this.spriteHeight * 0.5,
    //   this.spriteWidth,
    //   this.spriteHeight
    // );

    c.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - this.spriteWidth * 0.5,
      this.y - this.spriteHeight * 0.5,
      this.spriteWidth,
      this.spriteHeight
    );
  }
}
