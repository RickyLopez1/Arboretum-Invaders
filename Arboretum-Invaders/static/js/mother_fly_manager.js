import MotherFly from './mother_fly.js';
import SeedManager from './seed_manager.js';
export default class MotherFlyManager {

  constructor() {
    this.mother_fly = null;
    this.seed_manager = new SeedManager(-1);

    this.speed = 1;
    this.health = 20;
    this.shoot_rate = 0.01;
    this.points_worth = 100;
    this.seed_damage = -3;
    this.seed_color = 'red';
    this.mother_fly_hit = -1;
  }

  spawn(prng) {
    if (this.mother_fly == null) {
      let rand_num = prng.getNum();
      if (rand_num < 0.00005) {
        this.mother_fly = new MotherFly(this.speed, this.health, prng);
      }
    }
  }

  hasMotherFly() {
    if (this.mother_fly == null) {
      return false;
    } else {
      return true;
    }
  }

  update_health(num) {
    if (this.mother_fly != null) {
      this.mother_fly.health += num;
      if (this.mother_fly.health <= 0) {
        this.out();
        return "out";
      } else {
        return "in";
      }
    }
  }

  draw(ctx){
    if (this.mother_fly != null) {
      this.mother_fly.draw(ctx);
    }
    this.seed_manager.draw(ctx);
  }

  update(deltaTime, prng) {
    if (!deltaTime) return;
    if (this.mother_fly != null) {
      if (this.mother_fly_hit != -1) {
        this.update_health(-1);
        this.mother_fly_hit = -1;
      }
    }
    if (this.mother_fly != null) {
      this.shoot(prng);
      this.mother_fly.update(deltaTime);
      if (this.mother_fly.pos_x < -this.mother_fly.width | this.mother_fly.pos_x > 800) {
        this.out();
      }
    }
    this.seed_manager.update(deltaTime);
  }

  shoot(prng) {
    let rand_num = prng.getNum();
    if (rand_num < this.shoot_rate) {
      let rand_num = prng.getNum();
      this.seed_manager.spawn(this.mother_fly.pos_x + (this.mother_fly.width * rand_num), this.mother_fly.pos_y + this.mother_fly.height, this.seed_color);
    }
  }

  out() {
    this.mother_fly = null;
    this.health += 5;
    this.points_worth += 50;
    this.seed_damage -= 1;
  }
}
