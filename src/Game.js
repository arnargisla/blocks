class Game {
  constructor(player, opponents, canvas, keyboard){
    this.opponents = opponents;
    this.keyboard = keyboard;
    this.canvas = canvas;
    this.ctx = canvas.getDrawingContext();
    this.state = "notstarted";
    this.pressedKeys = new Set();
    this.player = player;
    this.renderStatistics = false;
    this.lastDt = 0;
  }

  setState(state){
    this.state = state;
  }

  gatherInputs(){
    this.pressedKeys = new Set(this.keyboard.getPressedKeys());
    if(window.renderKeyboard){
      console.log(this.pressedKeys);
    }
  }

  update(dt){
    this.lastDt = dt;
    if(this.pressedKeys.has("t")){
      this.renderStats = true;
      this.keyboard.removeKey("t");
    }
    if(this.pressedKeys.has("ArrowUp")){
      this.player.moveUp(dt);
    }
    if(this.pressedKeys.has("ArrowDown")){
      this.player.moveDown(dt);
    }
    if(this.pressedKeys.has("ArrowLeft")){
      this.player.moveLeft(dt);
    }
    if(this.pressedKeys.has("ArrowRight")){
      this.player.moveRight(dt);
    }
  }

  render(){
    const ctx = this.ctx;
    ctx.save();

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.render(ctx);
    [...this.opponents].map(p => p.render(ctx));

    if(this.renderStatistics){
      this.renderStatistics(ctx);
    }

    ctx.restore();
  }

  renderStatistics(ctx){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillText(this.lastDt, this.canvas.width/2, 10);
    ctx.restore();
  }
  
}

export { Game };
