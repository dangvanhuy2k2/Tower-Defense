import { checkMouseCollision } from "../ultil.js";

export default class PlacementTile {
  constructor({ x = 0, y = 0 }) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.color = "rgba(255,255,255,0.15)";
    this.isEmpty = true;
  }

  update(c, mouse) {
    this.draw(c);

    if (checkMouseCollision(mouse, this)) this.color = "white";
    else this.color = "rgba(255,255,255,0.15)";
  }

  draw(c) {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  }
}
