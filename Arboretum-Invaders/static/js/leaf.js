export default class Leaf {

  constructor(prng) {
    this.width = 40;
    this.height = 40;
    this.pos_x = Math.floor(prng.getNum() * (800 - this.width));
    this.pos_y = 300 + Math.floor(prng.getNum() * (200 - this.height));
    let rand_num = prng.getNum();
    if (rand_num > 0.5) {
      this.image = document.getElementById("img_leaf_right");
    } else {
      this.image = document.getElementById("img_leaf_left");
    }
    this.health = 3;
  }

  draw(ctx){
    ctx.drawImage(this.image, this.pos_x, this.pos_y, this.width, this.height);
  }

}
