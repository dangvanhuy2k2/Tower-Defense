export default class Projectile {
  constructor({ x = 0, y = 0, enemy, building }) {
    this.radius = 10;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.enemy = enemy;
    this.markForDeletion = false;
    this.speed = 5;
    this.image = document.getElementById("projectile");
  }
  update(c) {
    if (this.enemy.markForDeletion || this.enemy.health <= 0)
      return (this.markForDeletion = true);

    this.draw(c);

    const angle = Math.atan2(this.enemy.y - this.y, this.enemy.x - this.x);
    this.speedX = Math.cos(angle) * this.speed;
    this.speedY = Math.sin(angle) * this.speed;

    this.x += this.speedX;
    this.y += this.speedY;
  }
  draw(c) {
    c.drawImage(this.image, this.x, this.y);
    // c.beginPath();
    // c.fillStyle = "yellow";
    // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // c.fill();
    // c.closePath();
  }
}
