export default class HUD {

  constructor(player_id) {
    this.health = {
      outer: {
        width: 82 * 2,
        height: 12,
        color: 'black',
        pos_y: 25,
      },
      inner: {
        width: 80 * 2, //this.health.outer.width - 10,
        height: 8, //this.health.outer.height - 10,
        pos_y: 27, //this.health.outer.pos_y + 5,
      },
    }
    this.name = {
      font: '12pt Lucida Console',
      color: 'black',
      pos_y: 20,
      name: "",
    }
    this.score = {
      font: '12pt Lucida Console',
      color: 'black',
      pos_y: 54,
    }

    if (player_id == 0) {
      this.health.outer.pos_x = 5;
      this.health.inner.pos_x = 7;
      this.name.pos_x = this.health.outer.pos_x;
      this.score.pos_x = this.name.pos_x;
      this.health.inner.color = 'blue';
    } else {
      this.health.outer.pos_x = 800 - this.health.outer.width - 5;
      this.health.inner.pos_x = 800 - this.health.outer.width - 3;
      this.name.pos_x = this.health.outer.pos_x;
      this.score.pos_x = this.name.pos_x;
      this.health.inner.color = 'red';
    }
  }

  draw_name(ctx) {
    ctx.font = this.name.font;
    ctx.fillStyle = this.name.color;
    ctx.fillText(this.name.name, this.name.pos_x, this.name.pos_y);
  }

  draw_health(ctx, health) {
    ctx.fillStyle = this.health.outer.color;
    ctx.fillRect(this.health.outer.pos_x, this.health.outer.pos_y, this.health.outer.width, this.health.outer.height);
    if (health > 0) {
      ctx.fillStyle = this.health.inner.color;
      ctx.fillRect(this.health.inner.pos_x, this.health.inner.pos_y, (this.health.inner.width/10)*health*2, this.health.inner.height);
    }
  }

  draw_score(ctx, score) {
    ctx.font = this.score.font;
    ctx.fillStyle = this.score.color;
    ctx.fillText("SCORE: " + score.toString(), this.score.pos_x, this.score.pos_y);
  }

  draw(ctx, health, score) {
    this.draw_name(ctx);
    this.draw_health(ctx, health);
    this.draw_score(ctx, score);
  }
}
