import Bee from './bee.js';
export default class BeeManager {

  constructor() {
    this.bee_width = 50;
    this.bee_height = 50;
    this.bee = null;
    this.bee_hit = -1;
  }

  spawn(prng) {
    if (this.bee == null) {
      let rand_num = prng.getNum();
      if (rand_num < 0.001) {
        this.bee = new Bee(prng);
      }
    }
  }

  hasBee() {
    if (this.bee == null) {
      return false;
    } else {
      return true;
    }
  }

  draw(ctx){
    if (this.bee != null) {
      this.bee.draw(ctx);
    }
  }

  update(deltaTime) {
    if (!deltaTime) return;
    if (this.bee_hit != -1) {
      this.out();
      this.bee_hit = -1;
    }
    if (this.bee != null) {
      this.bee.update(deltaTime);
      if (this.bee.pos_x < -this.bee_width | this.bee.pos_x > 800) {
        this.out();
      }
    }
  }

  out() {
    this.bee = null;
  }
}
