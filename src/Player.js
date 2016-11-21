import Position from "./Position";
import util from "./util";

class Player {
  constructor(name){
    this.name = name;
    this.height = 20;
    this.width = 20;
    this.color = "#" + util.generateColorFromString(name);
    this.speedPerSecond = 250;
    this.position = new Position(5+this.width, 5+this.height);
    this.destination = new Position(this.position);
  }

  update(dt){
    this.updatePosition(dt);
  }

  updatePosition(dt){
    const cx = this.position.getX();
    const cy = this.position.getY();
    const dx = this.destination.getX() - cx;
    const dy = this.destination.getY() - cy;
    const maxD = this.speedPerSecond * dt/1000;
    const dl = Math.sqrt(dx*dx+dy*dy);
    if(dl > 5*dl){
      // If the player has moved very far then teleport him
      this.position = new Position(this.destination);
    } else {
      const scale = dl>0.0000001 ? Math.min(1, dl/maxD) : 0;
      this.position.setCoordinates(cx+scale*dx, cy+scale*dy);
    }
  }


  render(ctx){
    const x = this.position.getX() - this.width/2;
    const y = this.position.getY() - this.height/2;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, this.width, this.height);
    ctx.restore();
  }

  getName(){
    return this.name;
  }

  setPosition(position){
    this.position = position;
  }

  setDestination(position){
    this.destination = position;
  }

  moveUp(dt){
    this.destination.setY(this.position.getY() - this.speedPerSecond * dt/1000);
  }
  
  moveDown(dt){
    this.destination.setY(this.position.getY() + this.speedPerSecond * dt/1000);
  }

  moveRight(dt){
    this.destination.setX(this.position.getX() + this.speedPerSecond * dt/1000);
  }
  
  moveLeft(dt){
    this.destination.setX(this.position.getX() - this.speedPerSecond * dt/1000);
  }
}

export default Player;
