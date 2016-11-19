import { Position } from './Position.js';
import { Player } from './Player.js';
class Game {
  constructor(player, opponents, canvas, keyboard, socket){
    socket.emit("init player", { name: player.getName() });
    this.opponents = opponents;
    this.socket = socket;
    this.keyboard = keyboard;
    this.canvas = canvas;
    this.ctx = canvas.getDrawingContext();
    this.gameState = "notstarted";
    this.pressedKeys = new Set();
    this.player = player;
    this.renderStatsFlag = false;
    this.lastDt = 0;
    this.networkMessageTimeAcc = 0;
    this.networkUpdateRateInMs = 100;
    const self = this;
    socket.on("players update", function(message){
      self.opponents = new Set(message.players
          .filter(p=>p.name!==self.player.name)
          .map(p=>{
            const player = new Player(p.name);
            player.setPosition(new Position(p.x, p.y));
            return player;
          }));
    });
  }

  setState(gameState){
    this.gameState = gameState;
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
      this.renderStatsFlag = !this.renderStatsFlag;
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
    this.updateNetwork(dt);
    
  }

  getState(){
    return this.gameState;
  }

  updateNetwork(dt){
    this.networkMessageTimeAcc += dt;
    if(this.networkMessageTimeAcc > this.networkUpdateRateInMs){
      this.networkMessageTimeAcc = 0;
      this.socket.emit('update player', { 
        x: this.player.position.getX(),
        y: this.player.position.getY()
      });
    }
  }

  render(){
    const ctx = this.ctx;
    ctx.save();

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.render(ctx);
    [...this.opponents].map(p => p.render(ctx));

    if(this.renderStatsFlag){
      this.renderStats(ctx);
    }

    ctx.restore();
  }

  renderStats(ctx){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillText(this.lastDt, this.canvas.width/2, 10);
    ctx.fillText(1000/this.lastDt, this.canvas.width/2, 30);
    ctx.restore();
  }
}

export { Game };
