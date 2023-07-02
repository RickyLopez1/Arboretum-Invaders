import Player from './player.js';
export default class PlayerManager {

  constructor() {
    this.player_list = [];
    this.num_players = 2;
    this.player_list.push(new Player(0));
    this.player_list.push(new Player(1));
    this.my_player;
  }

  draw(ctx){
    for (let i=0; i < this.num_players; i++) {
      this.player_list[i].draw(ctx);
    }
  }

  draw(ctx){
    for (let i=0; i < this.num_players; i++) {
      this.player_list[i].draw(ctx);
    }
  }

  update(deltaTime){
    if(!deltaTime) return;
    for (let i=0; i < this.num_players; i++) {
      this.player_list[i].update(deltaTime);
    }
  }

  bothOut() {
    if (this.player_list[0].health == 0 & this.player_list[1].health == 0) {
      return true;
    } else {
      return false;
    }
  }
}
