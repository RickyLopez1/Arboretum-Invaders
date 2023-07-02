export default class MultiplayerHandler {
  constructor() {
    this.xhttpReset;
    this.xhttpSend;
    this.xhttpGet;
    this.timestamp;
    this.start_time;
    this.my_player;
    this.my_player_name;
    this.game_state = "not started";
    this.players_present = 0;
  }

  sendInfo(player_name, info_key, info_value) {
      this.xhttpSend = new XMLHttpRequest();
      this.xhttpSend.onreadystatechange = function() {};
      this.xhttpSend.open("POST", "updateGameInfo", true);
      this.xhttpSend.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      this.xhttpSend.send("player_name=" + player_name + "&info_key=" + info_key + "&info_value=" + info_value);
  }

  sendClientInfo(info_key, info_value) {
    this.xhttpSend = new XMLHttpRequest();
    this.xhttpSend.onreadystatechange = function() {};
    this.xhttpSend.open("POST", "updateClientInfo", true);
    this.xhttpSend.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    this.xhttpSend.send("info_key=" + info_key + "&info_value=" + info_value);
  }

getInfo(player_manager, fly_manager, mother_fly_manager, bee_manager, tree) {
  this.xhttpGet = new XMLHttpRequest();
  let outer_this = this;
  let player;
  if (player_manager.my_player == 0) {
    player = player_manager.player_list[1];
  } else {
    player = player_manager.player_list[0];
  }
  this.xhttpGet.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let game_info = JSON.parse(this.responseText);

        let cur_player;
        if (player.id == 1) {
          cur_player = game_info.Player2;
        } else {
          cur_player = game_info.Player1;
        }

        player.health = cur_player.health;
        player.direction = cur_player.direction;
        player.score = cur_player.score;
        fly_manager.fly_hit = cur_player.fly_hit;
        mother_fly_manager.mother_fly_hit = cur_player.mother_fly_hit;
        tree.leaf_hit = cur_player.leaf_hit;
        bee_manager.bee_hit = cur_player.bee_hit;

        //if (cur_player.fly_hit != -1) {
          //console.log(cur_player.fly_hit);
        //}

        //if (cur_player.leaf_hit != -1) {
          //console.log(cur_player.leaf_hit);
        //}

        if (cur_player.shot != 0.0) {
          player.shoot(cur_player.shot, outer_this.timestamp - outer_this.start_time, outer_this);
          outer_this.sendInfo(player.label, "shot", 0.0);
        }

        let from_json_data = [cur_player.fly_hit, cur_player.mother_fly_hit, cur_player.bee_hit, cur_player.leaf_hit];
        let info_keys = ["fly_hit", "mother_fly_hit", "bee_hit", "leaf_hit"];

        for (let i = 0; i < from_json_data.length; i++) {
          if (from_json_data[i] != -1) {
            outer_this.sendInfo(player.label, info_keys[i], -1);
          }
        }
      }
    };
    this.xhttpGet.open("GET", "requestGameInfo", true);
    this.xhttpGet.send();
  }

  getPlayerNames(player_manager) {
    this.xhttpGet = new XMLHttpRequest();
    let outer_this = this;
    this.xhttpGet.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let client_info = JSON.parse(this.responseText);
          player_manager.player_list[0].hud.name.name = client_info.name_player_1;
          player_manager.player_list[1].hud.name.name = client_info.name_player_2;
          player_manager.player_list[0].name = client_info.name_player_1;
          player_manager.player_list[1].name = client_info.name_player_2;
        }
      };
      this.xhttpGet.open("GET", "requestClientInfo", true);
      this.xhttpGet.send();
  }

  getClientInfo(prng) {
    this.xhttpGet = new XMLHttpRequest();
    let outer_this = this;
    this.xhttpGet.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let client_info = JSON.parse(this.responseText);
          if (client_info.game_state == "running" && outer_this.game_state == "not started") {
            outer_this.start_time = outer_this.timestamp;
          }
          outer_this.game_state = client_info.game_state;
          outer_this.players_present = client_info.players_present;

          if (outer_this.my_player == 1) {
            prng.seed = client_info.prng_seed;
          } else {
            outer_this.sendClientInfo("prng_seed", prng.seed);
          }

        }
      };
      this.xhttpGet.open("GET", "requestClientInfo", true);
      this.xhttpGet.send();
    }

}
