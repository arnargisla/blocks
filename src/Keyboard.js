class Keyboard {
  constructor(htmlElement){
    this.htmlElement = htmlElement;
    this.registerListeners();
    this.pressedKeys = new Set;
  }

  removeKey(keyString){
    this.pressedKeys.delete(keyString);
  }

  registerListeners(){
    this.htmlElement.addEventListener('keyup', e=>this.keyUpHandler(e));
    this.htmlElement.addEventListener('keydown', e=>this.keyDownHandler(e));
  }

  keyUpHandler(event){
    const key = event.key;
    this.pressedKeys.delete(key);
  }

  keyDownHandler(event){
    const key = event.key;
    this.pressedKeys.add(key);
  }

  getPressedKeys(){
    return this.pressedKeys;
  }
}

export { Keyboard };
