import Fly from './fly.js';
import SeedManager from './seed_manager.js';
export default class FlyManager {

  constructor() {
    this.fly_width = 40;
    this.fly_height = 40;
    this.recent_spawn_speed = 1.5;
    this.fly_list = [];
    this.num_recent_spawn = 0;
    this.shoot_rate = 0.002;
    this.seed_manager = new SeedManager(-1);
    this.seed_color = 'black';
    this.new_row_counter = 0;
    this.fly_hit = -1;
  }

  spawn(num_flies) {
    this.num_recent_spawn = num_flies;
    for (let i=0; i < num_flies; i++) {
      this.fly_list.push(new Fly(i, num_flies));
    }
    this.recent_spawn_speed = 3 - (num_flies - 1)/4;
    this.new_row_counter = 0;
  }

  draw(ctx){
    this.fly_list.forEach((Fly) => {
      Fly.draw(ctx);
    });
    this.seed_manager.draw(ctx);
  }

  increase_shoot_rate() {
    this.shoot_rate += 0.002;
  }

  update(deltaTime, prng) {
    if (!deltaTime) return;
    if (this.fly_hit != -1 && this.fly_hit < this.fly_list.length) {
      //console.log(this.fly_hit);
      this.update_health(this.fly_hit, -1);
      this.fly_hit = -1;
    }
    this.shoot(prng);
    this.fly_list.forEach((Fly) => {
      Fly.update(deltaTime);
    });
    this.new_row_counter += this.recent_spawn_speed; // adds up distance traveled
    this.seed_manager.update(deltaTime);
  }

  update_health(index, num) {
    this.fly_list[index].update_health(num);
    if (this.fly_list[index].health == 0) {
      this.out(index);
      return "out";
    } else {
      return "in";
    }
  }

  shoot(prng) {
    this.fly_list.forEach((Fly) => {
      let rand_num = prng.getNum();
      if (rand_num < this.shoot_rate) {
        this.seed_manager.spawn(Fly.pos_x + (this.fly_width/2), Fly.pos_y + this.fly_height, this.seed_color);
      }
    });
  }

  get_new_row() {
    if (this.new_row_counter < 4 * (800 - (((3/2) * this.fly_width * this.num_recent_spawn + this.fly_width)))) {
      return false;
    } else {
      this.new_row_counter = 0;
      return true;
    }
  }

  out(fly_index) {
    this.fly_list.splice(fly_index, 1);
  }
}
