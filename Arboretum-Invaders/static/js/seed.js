export default class Seed {

  constructor(pos_x, pos_y, direction, color) {
    this.speed = 5;
    this.pos_y = pos_y + 5;
    this.pos_x = pos_x;
    this.radius = 4;
    this.direction = direction;
    this.color = color;
  }

  move() {
    this.pos_y -= this.speed * this.direction;
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos_x, this.pos_y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

  }
  update(deltaTime){
      this.move();
      if (this.pos_y < 0 | this.pos_y > 600) {
        return false;
      } else {
        return true;
      }
  }

}
