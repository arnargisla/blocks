class Position {
  constructor(xOrPosition, y){
    if(xOrPosition instanceof Position){
      const position = xOrPosition;
      this.x = position.x;
      this.y = position.y;
    }else{
      const x = xOrPosition;
      this.x = x;
      this.y = y;
    }
  }

  setCoordinates(x, y) {
    this.x = x;
    this.y = y;
  }

  getX(){
    return this.x;
  }

  setX(x){
    this.x = x;
  }

  getY(){
    return this.y;
  }

  setY(y){
    this.y = y;
  }
}

export default Position;
