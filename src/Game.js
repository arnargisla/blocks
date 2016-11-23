import Position from './Position.js';
import Player from './Player.js';
class Game {
  constructor(player, opponents, canvas, keyboard, socket){
    this.opponents = opponents; 
    // map from playername to { 
    //   player: Player object, 
    //   lastUpdate: time since epoch 
    // }
    this.socket = socket;
    this.keyboard = keyboard;
    this.canvas = canvas;
    this.ctx = canvas.getDrawingContext();
    this.gameState = "notstarted";
    this.pressedKeys = new Set();
    this.player = player;
    this.player.setIsMainPlayer(true);
    this.lastDt = 0;
    this.renderStatsFlag = false;
    this.debugLogFlag = false;
    this.networkUpdateRateInMs = 50;
    this.networkMessageTimeAcc = this.networkUpdateRateInMs;
    socket.on("players update", message => {
      // message = {
      //   players: [
      //     { name: Player#1,
      //       x: 25,
      //       y: 25 }.
      //       ... ] }
      const opponentPlayerObjects = message.players
        .filter(p=>p.name!==this.player.name);

      opponentPlayerObjects.map(playerObject => {
        const newPosition = new Position(playerObject.x, playerObject.y);
        const name = playerObject.name;
        if(this.opponents.has(name)){
          const playerObject = this.opponents.get(name);
          playerObject.lastUpdate = (new Date()).getTime();
          const targetPlayer = playerObject.player;
          targetPlayer.setDestination(newPosition);
        } else {
          this.debugMessage("Adding new player", name);
          const newPlayer = new Player(name);
          newPlayer.setPosition(newPosition);
          this.opponents.set(name, {
            player: newPlayer,
            lastUpdate: (new Date()).getTime()
          });
        }
      });

      // prune old opponents
      [...this.opponents.entries()].map(([playerName, playerObject]) => {
        const lastUpdateTime = playerObject.lastUpdate;
        const nowTime = (new Date()).getTime();
        if(nowTime > (lastUpdateTime + 5000)){
          this.removePlayer(playerName);
        }
      });
    });

    socket.on("player disconnected", name => {
      this.debugMessage("Player disconnected: ", name);
      this.removePlayer(name);
    });
  }

  removePlayer(playerName){
    this.debugMessage("Removing player:", playerName);
    this.opponents.delete(playerName);
  }

  setState(gameState){
    this.gameState = gameState;
  }

  gatherInputs(){
    this.pressedKeys = new Set(this.keyboard.getPressedKeys());
    if(window.renderKeyboard){
      this.debugMessage(this.pressedKeys);
    }
  }

  update(dt){
    this.lastDt = dt;
    if(this.pressedKeys.has("t")){
      this.renderStatsFlag = !this.renderStatsFlag;
      this.keyboard.removeKey("t");
    }
    if(this.pressedKeys.has("d")){
      this.debugLogFlag = !this.debugLogFlag;
      this.keyboard.removeKey("d");
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
    this.getOpponents().map(p=>p.update(dt));
    this.player.update(dt);
    this.updateNetwork(dt);
  }

  getOpponents(){
    return [...this.opponents.values()].map(v=>v.player);
  }

  getState(){
    return this.gameState;
  }

  updateNetwork(dt){
    this.networkMessageTimeAcc += dt;
    if(this.networkMessageTimeAcc > this.networkUpdateRateInMs){
      this.networkMessageTimeAcc = 0;
      this.socket.emit('update player', { 
        name: this.player.getName(),
        x: this.player.position.getX(),
        y: this.player.position.getY(),
      });
    }
  }

  debugMessage(...objects) {
    if(this.debugLogFlag){
      console.log(...objects);
    }
  }

  render(){
    const ctx = this.ctx;
    ctx.save();

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.getOpponents().map(p=>p.render(ctx));
    this.player.render(ctx);

    if(this.renderStatsFlag){
      this.renderStats(ctx);
    }

    if(this.debugLogFlag){
      this.renderDebugText(ctx);
    }

    ctx.restore();
  }

  renderStats(ctx){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillText("dt : " + this.lastDt, this.canvas.width-100, this.canvas.height-40);
    ctx.fillText("fps: " + 1000/this.lastDt, this.canvas.width-100, this.canvas.height-30);
    ctx.restore();
  }

  renderDebugText(ctx){
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillText("DEBUG ON", this.canvas.width-100, this.canvas.height-20);
    ctx.restore();
  }
}

export default Game;
