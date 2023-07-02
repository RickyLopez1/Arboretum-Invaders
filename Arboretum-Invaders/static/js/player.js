import HUD from './hud.js';
import SeedManager from './seed_manager.js';

export default class Player{
    constructor(id){
        this.id = id;
        this.width = 40;
        this.height = 40;
        this.speed = 4;
        this.direction = 0;

        this.health = 5;
        this.score = 0;

        this.pos_y = 600 - this.height;
        this.hud = new HUD(this.id);
        this.seed_manager = new SeedManager(1);
        this.seed_color = 'green';
        this.time_shot = 0;
        this.name;

        if (this.id == 0) {
          this.pos_x = 200;
          this.image = document.getElementById("img_blue_jay");
          this.label = "Player1";
        } else {
          this.pos_x = 500;
          this.image = document.getElementById("img_cardinal");
          this.label = "Player2";
        }
    }

    move() {
        this.pos_x += this.speed * this.direction;
        if(this.pos_x < 0) {
          this.pos_x = 0;
        }
        if(this.pos_x + this.width > 800) {
          this.pos_x = 800 - this.width;
        }
    }

    shoot(their_time, our_time, multiplayer_handler) {
      if (this.time_shot < multiplayer_handler.timestamp - 250) {
        let std_deltaTime = 16.675;
        let y_adjustment = 0;
        if (their_time == -1) {
          multiplayer_handler.sendInfo(this.label, "shot", multiplayer_handler.timestamp - multiplayer_handler.start_time);
          this.update_score(-1, multiplayer_handler);
        } else {
          y_adjustment = Math.round((our_time - their_time) / std_deltaTime);
        }
        this.seed_manager.spawn(this.pos_x + (this.width/2), this.pos_y - y_adjustment, this.seed_color);
        this.time_shot = multiplayer_handler.timestamp;
      }
    }

    draw(ctx){
      ctx.drawImage(this.image, this.pos_x, this.pos_y, this.width, this.height);
      this.hud.draw(ctx, this.health, this.score);
      this.seed_manager.draw(ctx);
    }

    update_health(num, multiplayer_handler) {
      this.health += num;
      if (this.health < 0) {
        this.health = 0;
      } else if (this.health > 5) {
        this.health = 5;
      }
      if (this.health == 0) {
        this.seed_color = 'palegreen';
      } else {
        this.seed_color = 'green';
      }
      multiplayer_handler.sendInfo(this.label, "health", this.health);
    }

    update_score(num, multiplayer_handler) {
      this.score += num;
      multiplayer_handler.sendInfo(this.label, "score", this.score);
    }

    update(deltaTime){
      this.move();
      this.seed_manager.update(deltaTime);
    }

}
