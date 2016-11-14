import { Position } from "./Position";
import { util } from "./util";

class Player {
  constructor(name){
    this.name = name;
    this.height = 20;
    this.width = 20;
    this.color = "#" + util.generateColorFromString(name);
    this.speedPerSecond = 250;
    this.position = new Position(5+this.width, 5+this.height);
  }

  render(ctx){
    const x = this.position.getX() - this.width/2;
    const y = this.position.getY() - this.height/2;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
    ctx.restore();
  }

  moveUp(dt){
    this.position.setY(this.position.getY() - this.speedPerSecond * dt/1000);
  }
  
  moveDown(dt){
    this.position.setY(this.position.getY() + this.speedPerSecond * dt/1000);
  }

  moveRight(dt){
    this.position.setX(this.position.getX() + this.speedPerSecond * dt/1000);
  }
  
  moveLeft(dt){
    this.position.setX(this.position.getX() - this.speedPerSecond * dt/1000);
  }
}

export { Player };
