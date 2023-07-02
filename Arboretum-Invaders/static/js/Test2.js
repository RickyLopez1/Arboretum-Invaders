import PlayerManager from './player_manager.js';
import FlyManager from './fly_manager.js';
import BeeManager from './bee_manager.js';
import InputHandler from './input.js';
import Tree from './tree.js';
import GameOverText from './game_over_text.js';
import GameStartText from './game_start_text.js';
import MotherFlyManager from './mother_fly_manager.js';
import Player from './player.js';
import PRNG from './prng.js';
import MultiplayerHandler from './multiplayer_handler.js';

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');

let player_manager = new PlayerManager();
let multiplayer_handler = new MultiplayerHandler();
let fly_manager = new FlyManager();
let bee_manager = new BeeManager();
let mother_fly_manager = new MotherFlyManager();
let tree = new Tree();
let prng = new PRNG(8675309);

multiplayer_handler.my_player = my_player;
player_manager.my_player = multiplayer_handler.my_player;
multiplayer_handler.my_player_name = player_manager.player_list[player_manager.my_player].name;

player_manager.draw(ctx);
fly_manager.draw(ctx);
tree.spawn(10, prng);
multiplayer_handler.getPlayerNames(player_manager);

let lastTime = 0;
let deltaTime = 0;
let fly_counter = 1;
let checkSendScores = false;

new InputHandler(player_manager, multiplayer_handler);

function gameLoop(timestamp){
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    multiplayer_handler.timestamp = timestamp;

    ctx.clearRect(0, 0, 800, 600);
    ctx.fillStyle = "black";
    ctx.fill();

    if (multiplayer_handler.game_state == "not started") {
      let game_start_text = new GameStartText(player_manager.my_player);
      game_start_text.draw(ctx);
    } else if (multiplayer_handler.game_state == "running") {
      //multiplayer_handler.getClientInfo(prng);
      bee_manager.spawn(prng);
      mother_fly_manager.spawn(prng);
    } else if (multiplayer_handler.game_state == "over") {
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
    } else {
      window.location.href = "highscores";
    }

    // spawn more flies
    if ((fly_manager.get_new_row() == true | fly_manager.fly_list.length == 0) & multiplayer_handler.game_state == "running") {
      fly_manager.spawn((fly_counter * 2) + 1);
      if (fly_counter < 3) {
        fly_counter += 1;
      } else {
        fly_counter = 1;
        fly_manager.increase_shoot_rate();
        tree.spawn(10, prng);
      }
    }

    // check all collisions of player seeds
    player_manager.player_list.forEach((Player) =>{
      Player.seed_manager.seed_list.forEach((Seed) =>{
        if (Player.health > 0) {
        fly_manager.fly_list.forEach((Fly) => {
            const dist = Math.hypot(Seed.pos_x - (Fly.pos_x + (Fly.width / 2)), Seed.pos_y - (Fly.pos_y + (Fly.height / 2)));
            if(dist < Fly.width - 10){
                Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                if (Player.id == player_manager.my_player) {
                  multiplayer_handler.sendInfo(Player.label, "fly_hit", fly_manager.fly_list.indexOf(Fly));
                  //console.log(fly_manager.fly_list.indexOf(Fly));
                  let status = fly_manager.update_health(fly_manager.fly_list.indexOf(Fly), -1);
                  if (status == "out") {
                    Player.update_score(25, multiplayer_handler);
                  }
                }
            }
        });
        tree.leaf_list.forEach((Leaf) => {
            const dist = Math.hypot(Seed.pos_x - (Leaf.pos_x + (Leaf.width / 2)), Seed.pos_y - (Leaf.pos_y + (Leaf.height / 2)));
                if(dist < Leaf.width - 10){
                    Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                    if (Player.id == player_manager.my_player) {
                      multiplayer_handler.sendInfo(Player.label, "leaf_hit", tree.leaf_list.indexOf(Leaf));
                      tree.update_health(tree.leaf_list.indexOf(Leaf), -1);
                      //console.log(tree.leaf_list.indexOf(Leaf));

                    }
                }
        });
        if (mother_fly_manager.hasMotherFly()) {
          const dist = Math.hypot(Seed.pos_x - (mother_fly_manager.mother_fly.pos_x + (mother_fly_manager.mother_fly.width / 2)), Seed.pos_y - (mother_fly_manager.mother_fly.pos_y + (mother_fly_manager.mother_fly.height / 2)));
              if(dist < mother_fly_manager.mother_fly.width - 10){
                Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                if (Player.id == player_manager.my_player) {
                  multiplayer_handler.sendInfo(Player.label, "mother_fly_hit", 0);
                  let status = mother_fly_manager.update_health(-1);
                  if (status == "out") {
                    Player.update_score(mother_fly_manager.points_worth, multiplayer_handler);
                  }
                }
              }
        }
      }
        if (bee_manager.hasBee()) {
          const dist = Math.hypot(Seed.pos_x - (bee_manager.bee.pos_x + (bee_manager.bee.width / 2)), Seed.pos_y - (bee_manager.bee.pos_y + (bee_manager.bee.height / 2)));
              if(dist < bee_manager.bee.width - 10){
                Player.seed_manager.out(Player.seed_manager.seed_list.indexOf(Seed));
                if (Player.id == player_manager.my_player) {
                  bee_manager.out();
                  multiplayer_handler.sendInfo(Player.label, "bee_hit", 0);
                  if (Player.health < 5) {
                    Player.update_health(1, multiplayer_handler);
                  } else {
                    Player.update_score(25, multiplayer_handler);
                  }
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
          if (Player.id == player_manager.my_player) {
            if (Player.health > 0) {
              Player.update_health(-1, multiplayer_handler);
            } else {
              Player.update_score(-1, multiplayer_handler);
            }
          }
          fly_manager.seed_manager.out(fly_manager.seed_manager.seed_list.indexOf(Seed));
        }
      });
      tree.leaf_list.forEach((Leaf) => {
          const dist = Math.hypot(Seed.pos_x - (Leaf.pos_x + (Leaf.width / 2)), Seed.pos_y - (Leaf.pos_y + (Leaf.height / 2)));
          if(dist < Leaf.width - 10){
            fly_manager.seed_manager.out(fly_manager.seed_manager.seed_list.indexOf(Seed));
            if (player_manager.my_player == 0) {
              multiplayer_handler.sendInfo(player_manager.player_list[player_manager.my_player].label, "leaf_hit", tree.leaf_list.indexOf(Leaf));
              tree.update_health(tree.leaf_list.indexOf(Leaf), -1);
            }
          }
      });
    });

    // check all collisions of motherfly seeds
    mother_fly_manager.seed_manager.seed_list.forEach((Seed) =>{
      player_manager.player_list.forEach((Player) =>{
        const dist = Math.hypot(Seed.pos_x - (Player.pos_x + (Player.width / 2)), Seed.pos_y - (Player.pos_y + (Player.height / 2)));
        if(dist < Player.width - 10){
          if (Player.health > 0) {
            Player.update_health(mother_fly_manager.seed_damage, multiplayer_handler);
          } else {
            Player.update_score(mother_fly_manager.seed_damage, multiplayer_handler);
          }
          mother_fly_manager.seed_manager.out(mother_fly_manager.seed_manager.seed_list.indexOf(Seed));
        }
      });
      tree.leaf_list.forEach((Leaf) => {
          const dist = Math.hypot(Seed.pos_x - (Leaf.pos_x + (Leaf.width / 2)), Seed.pos_y - (Leaf.pos_y + (Leaf.height / 2)));
          if(dist < Leaf.width - 10){
            mother_fly_manager.seed_manager.out(mother_fly_manager.seed_manager.seed_list.indexOf(Seed));
            if (player_manager.my_player == 1) {
              multiplayer_handler.sendInfo(player_manager.player_list[player_manager.my_player].label, "leaf_hit", tree.leaf_list.indexOf(Leaf));
              tree.update_health(tree.leaf_list.indexOf(Leaf), -1);
            }
          }
      });
    });

    if (player_manager.bothOut() == true){
      if (checkSendScores == false){
        if(my_player == 0){
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              console.log("Response Received: " + this.responseText);
            }
          };
          xhttp.open("POST", "PostScore", true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send("name1="+player_manager.player_list[0].name+"&name2="+player_manager.player_list[1].name+"&score1="+player_manager.player_list[0].score+"&score2="+player_manager.player_list[1].score);
          checkSendScores = true;
        }
      }
      if (checkSendScores == true){
        multiplayer_handler.game_state = "over";
        multiplayer_handler.sendClientInfo("game_state", multiplayer_handler.game_state);
      }
    }

    multiplayer_handler.getClientInfo(prng);
    multiplayer_handler.getInfo(player_manager, fly_manager, mother_fly_manager, bee_manager, tree);
    player_manager.update(deltaTime);
    fly_manager.update(deltaTime, prng);
    mother_fly_manager.update(deltaTime, prng);
    bee_manager.update(deltaTime);
    tree.update(deltaTime);
    tree.draw(ctx);
    bee_manager.draw(ctx);
    fly_manager.draw(ctx);
    mother_fly_manager.draw(ctx);
    player_manager.draw(ctx);

    requestAnimationFrame(gameLoop);
}

gameLoop();
