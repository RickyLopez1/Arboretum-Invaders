export default class Fly {

  constructor(FlyID, num_flies) {
    this.id = FlyID;
    this.num_flies = num_flies;
    this.width = 40;
    this.height = 40;
    this.health = 5;
    this.speed = 3 - (this.num_flies - 1)/4;
    this.pos_y = 75;
    this.space = (3/2) * this.width;
    this.pos_x = this.space * this.id; // space them out
    this.direction = 1; // direction of movement
    this.image = document.getElementById("img_fly");
  }

  draw(ctx){
    ctx.drawImage(this.image, this.pos_x, this.pos_y, this.width, this.height);
  }

  move() {
    this.pos_x += this.speed * this.direction;
    if (this.id > 4 & this.pos_x > 800) {
      console.log(this.id);
      console.log(this.pos_x);
    }

    if (this.pos_x > (800 + (this.width/2)) - ((this.space * this.num_flies) - this.space * this.id) | this.pos_x < (this.space * this.id)) {
      if (this.pos_y < 450) {
        this.pos_y += this.height / 2;
      }
      this.direction *= -1;
    }
  }

  update_health(num) {
    this.health -= 1;
    if (this.health < 0) {
      this.health = 0;
    } else if (this.health > 3) {
      this.health = 3;
    }
  }

  update(deltaTime) {
    this.move();
  }

  shoot() {
    return [this.pos_x + (this.width/2), this.pos_y + this.height];
  }
}
