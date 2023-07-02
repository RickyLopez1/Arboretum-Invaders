export default class GameStartText {

  constructor(player_id) {
    this.player_id = parseInt(player_id) + 1;
    this.text_1 = 'Ready Player ';
    this.text_2 = 'Press Spacebar';
    this.font_1 = '40pt Lucida Console';
    this.font_2 = '20pt Lucida Console';
    this.color = 'black';
    this.pos_x_1 = 150;
    this.pos_y_1 = 250;
    this.pos_x_2 = 275;
    this.pos_y_2 = 300;
  }

  draw(ctx) {
    ctx.font = this.font_1;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text_1 + this.player_id, this.pos_x_1, this.pos_y_1);
    ctx.font = this.font_2;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text_2, this.pos_x_2, this.pos_y_2);
  }
}
