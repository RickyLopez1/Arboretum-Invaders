import Seed from './seed.js';
export default class SeedManager {

  constructor(direction) {
    this.seed_list = [];
    this.direction = direction; // 1 for player, -1 for fly
  }

  spawn(pos_x, pos_y, color) {
    this.seed_list.push(new Seed(pos_x, pos_y, this.direction, color));
  }

  draw(ctx){
    this.seed_list.forEach((Seed) => {
      Seed.draw(ctx);
    });
  }

  update(deltaTime) {
    let within_bounds = true;
    let seeds_to_delete = [];
    this.seed_list.forEach((Seed) => {
      within_bounds = Seed.update(deltaTime);
      if (within_bounds == false) {
        seeds_to_delete.push(this.seed_list.indexOf(Seed));
      }
    });
    seeds_to_delete.forEach((Index) => {
      this.out(Index);
    });
  }

  out(seed_index) {
    this.seed_list.splice(seed_index, 1);
  }
}
