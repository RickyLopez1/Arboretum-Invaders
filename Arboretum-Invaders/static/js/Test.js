import PlayerManager from './player_manager.js';
import FlyManager from './fly_manager.js';
import BeeManager from './bee_manager.js';
import InputHandler from './input.js';
import Tree from './tree.js';
import GameOverText from './game_over_text.js';
import MotherFlyManager from './mother_fly_manager.js';
import PRNG from './prng.js';

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');

let player_manager = new PlayerManager();
let fly_manager = new FlyManager();
let bee_manager = new BeeManager();
let mother_fly_manager = new MotherFlyManager();
let tree = new Tree();
let prng = new PRNG(8675309);

new InputHandler(player_manager);

player_manager.draw(ctx);
fly_manager.draw(ctx);
tree.spawn(10, prng);

let lastTime = 0;
let fly_counter = 1;
let game_over = false;

function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = "black";
    ctx.fill();

    // spawn more flies
    if ((fly_manager.get_new_row() == true | fly_manager.fly_list.length == 0) & game_over == false) {
      fly_manager.spawn((fly_counter * 2) + 1);
      if (fly_counter < 3) {
        fly_counter += 1;
      } else {
        fly_counter = 1;
        fly_manager.increase_shoot_rate();
        tree.spawn(10, prng);
      }
    }

    if (game_over == false) {
      bee_manager.spawn(prng);
      mother_fly_manager.spawn(prng);
    }

    // check all collisions of player seeds
    player_manager.player_list.forEach((Player) =>{
      Player.seed_manager.seed_list.forEach((Seed) =>{
        if (Player.health > 0) {
        fly_manager.fly_list.forEach((Fly) => {
            const dist = Math.hypot(Seed.pos_x - (Fly.pos_x + (Fly.width / 2)), Seed.pos_y - (Fly.pos_y + (Fly.height / 2)));
            if(dist < Fly.width - 10){
                fly_manager.hit(fly_manager.fly_list.indexOf(Fly));
                Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                Player.update_score(10);
            }
        });
        tree.leaf_list.forEach((Leaf) => {
            const dist = Math.hypot(Seed.pos_x - (Leaf.pos_x + (Leaf.width / 2)), Seed.pos_y - (Leaf.pos_y + (Leaf.height / 2)));
                if(dist < Leaf.width - 10){
                    tree.update_health(tree.leaf_list.indexOf(Leaf), -1);
                    Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                }
        });
        if (mother_fly_manager.hasMotherFly()) {
          const dist = Math.hypot(Seed.pos_x - (mother_fly_manager.mother_fly.pos_x + (mother_fly_manager.mother_fly.width / 2)), Seed.pos_y - (mother_fly_manager.mother_fly.pos_y + (mother_fly_manager.mother_fly.height / 2)));
              if(dist < mother_fly_manager.mother_fly.width - 10){
                  mother_fly_manager.update_health(-1);
                  Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                  if (mother_fly_manager.mother_fly.health == 0) {
                    mother_fly_manager.out();
                    Player.update_score(mother_fly_manager.points_worth);
                  }
              }
        }
      }
        if (bee_manager.hasBee()) {
          const dist = Math.hypot(Seed.pos_x - (bee_manager.bee.pos_x + (bee_manager.bee.width / 2)), Seed.pos_y - (bee_manager.bee.pos_y + (bee_manager.bee.height / 2)));
              if(dist < bee_manager.bee.width - 10){
                  bee_manager.out();
                  Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                  if (Player.health < 5) {
                    Player.update_health(1);
                  } else {
                    Player.update_score(25);
                  }
              }
          }
        // if we implement shootable power-ups, they'll be checked here
      });
    });

    // check all collisions of fly seeds
    fly_manager.seed_manager.seed_list.forEach((Seed) =>{
      player_manager.player_list.forEach((Player) =>{
        const dist = Math.hypot(Seed.pos_x - (Player.pos_x + (Player.width / 2)), Seed.pos_y - (Player.pos_y + (Player.height / 2)));
        if(dist < Player.width - 10){
          if (Player.health > 0) {
            Player.update_health(-1);
          } else {
            Player.update_score(-1);
          }
          fly_manager.seed_manager.out(fly_manager.seed_manager.seed_list.indexOf(Seed));
        }
      });
      tree.leaf_list.forEach((Leaf) => {
          const dist = Math.hypot(Seed.pos_x - (Leaf.pos_x + (Leaf.width / 2)), Seed.pos_y - (Leaf.pos_y + (Leaf.height / 2)));
          if(dist < Leaf.width - 10){
              tree.update_health(tree.leaf_list.indexOf(Leaf), -1);
              fly_manager.seed_manager.out(fly_manager.seed_manager.seed_list.indexOf(Seed));
          }
      });
    });

    // check all collisions of motherfly seeds
    mother_fly_manager.seed_manager.seed_list.forEach((Seed) =>{
      player_manager.player_list.forEach((Player) =>{
        const dist = Math.hypot(Seed.pos_x - (Player.pos_x + (Player.width / 2)), Seed.pos_y - (Player.pos_y + (Player.height / 2)));
        if(dist < Player.width - 10){
          if (Player.health > 0) {
            Player.update_health(mother_fly_manager.seed_damage);
          } else {
            Player.update_score(mother_fly_manager.seed_damage);
          }
          mother_fly_manager.seed_manager.out(mother_fly_manager.seed_manager.seed_list.indexOf(Seed));
        }
      });
      tree.leaf_list.forEach((Leaf) => {
          const dist = Math.hypot(Seed.pos_x - (Leaf.pos_x + (Leaf.width / 2)), Seed.pos_y - (Leaf.pos_y + (Leaf.height / 2)));
          if(dist < Leaf.width - 10){
              tree.update_health(tree.leaf_list.indexOf(Leaf), -3);
              mother_fly_manager.seed_manager.out(mother_fly_manager.seed_manager.seed_list.indexOf(Seed));
          }
      });
    });

    let players_out = player_manager.bothOut();
    if (players_out == true) {
      game_over = true;
      fly_manager.fly_list.forEach((Fly) => {
        fly_manager.out(fly_manager.fly_list.indexOf(Fly));
      });
      tree.leaf_list.forEach((Leaf) => {
        tree.out(tree.leaf_list.indexOf(Leaf));
      });
      bee_manager.out();
      mother_fly_manager.out();
      let game_over_text = new GameOverText();
      game_over_text.draw(ctx);
    }

    fly_manager.update(deltaTime, prng);
    mother_fly_manager.update(deltaTime, prng);
    player_manager.update(deltaTime);
    bee_manager.update(deltaTime);
    tree.draw(ctx);
    bee_manager.draw(ctx);
    fly_manager.draw(ctx);
    mother_fly_manager.draw(ctx);
    player_manager.draw(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();
