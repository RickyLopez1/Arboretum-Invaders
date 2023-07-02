export default class InputHandler {

    constructor(player_manager, multiplayer_handler) {
        // player 2
        document.addEventListener('keydown', (event) =>{

            switch(event.keyCode){
                case 65: // A = 65
                  if (multiplayer_handler.game_state == "running") {
                    player_manager.player_list[player_manager.my_player].direction = -1;
                    multiplayer_handler.sendInfo(player_manager.player_list[player_manager.my_player].label, "direction", -1);
                  }
                    break;

                case 68: // D = 68
                  if (multiplayer_handler.game_state == "running") {
                    player_manager.player_list[player_manager.my_player].direction = 1;
                    multiplayer_handler.sendInfo(player_manager.player_list[player_manager.my_player].label, "direction", 1);
                  }
                    break;

            }
        });

        document.addEventListener('keyup', (event) =>{

            switch(event.keyCode){
                case 65:
                    player_manager.player_list[player_manager.my_player].direction = 0;
                    multiplayer_handler.sendInfo(player_manager.player_list[player_manager.my_player].label, "direction", 0);
                    break;

                 case 68:
                    player_manager.player_list[player_manager.my_player].direction = 0;
                    multiplayer_handler.sendInfo(player_manager.player_list[player_manager.my_player].label, "direction", 0);
                    break;

            }
        });
        /*
        document.addEventListener('keyup', (event) =>{ // spacebar is key number 32
            switch(event.keyCode){
                case 32: // G = 71
                player_manager.player_list[player_manager.my_player].check_shoot = true;
            }
        });
        */
        document.addEventListener('keydown', (event) =>{ // spacebar is key number 32
            switch(event.keyCode){
                case 32:
                if (multiplayer_handler.game_state == "running") {
                  player_manager.player_list[player_manager.my_player].shoot(-1, -1, multiplayer_handler);
                } else if (multiplayer_handler.game_state == "not started") {
                  if (multiplayer_handler.players_present == 2) {
                    multiplayer_handler.sendClientInfo("game_state", "running");
                    multiplayer_handler.game_state = "running";
                    multiplayer_handler.start_time = multiplayer_handler.timestamp;
                  }
                } else {
                  multiplayer_handler.sendClientInfo("game_state", "post-game");
                  multiplayer_handler.game_state = "post-game";
                }
                break;
            }
        });
    }

}
