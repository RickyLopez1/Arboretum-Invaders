import Leaf from './leaf.js';
export default class Tree {

  constructor() {
    this.leaf_list = [];
    this.leaf_hit = -1;
  }

  spawn(num_leaves, prng) {
    for (let i=0; i < num_leaves; i++) {
      this.leaf_list.push(new Leaf(prng));
    }
  }

  draw(ctx){
    this.leaf_list.forEach((Leaf) => {
      Leaf.draw(ctx);
    });
  }

  update_health(leaf_index, num) {
    this.leaf_list[leaf_index].health += num;
    if (this.leaf_list[leaf_index].health < 1) {
      this.out(leaf_index);
      return "out";
    } else {
      return "in";
    }
  }

  update(deltaTime) {
     if (this.leaf_hit != -1 & this.leaf_hit < this.leaf_list.length) {
       this.update_health(this.leaf_hit, -1);
       this.leaf_hit = -1;
     }
   }


  out(leaf_index) {
    this.leaf_list.splice(leaf_index, 1);
  }
}
