export default class Bee {

  constructor(prng) {
    this.width = 40;
    this.height = 40;
    this.speed = 4;
    this.pos_y = 75 + Math.floor(prng.getNum() * (200 - this.height));
    this.image_left = document.getElementById("img_bee_left");
    this.image_right = document.getElementById("img_bee_right");

    let rand_num = prng.getNum();
    if (rand_num < 0.5) {
      this.pos_x = 0;
      this.direction = 1;
    } else {
      this.pos_x = 800 - this.width;
      this.direction = -1;
    }
  }

  move() {
    this.pos_x += this.speed * this.direction;
  }

  draw(ctx){
    if (this.direction == 1) {
      ctx.drawImage(this.image_right, this.pos_x, this.pos_y, this.width, this.height);
    } else {
      ctx.drawImage(this.image_left, this.pos_x, this.pos_y, this.width, this.height);
    }
  }

  update(deltaTime){
      this.move()
  }

}
