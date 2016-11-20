class Canvas {
  constructor(canvasHtmlElement){
    this.canvas = canvasHtmlElement;
    this.width = canvasHtmlElement.width;
    this.height = canvasHtmlElement.height;
  }

  getDrawingContext() {
    return this.canvas.getContext("2d");
  }
}

export default Canvas;
