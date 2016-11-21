import React from 'react';
import ReactDOM from 'react-dom';

import Canvas from "./Canvas.js";
import Game from "./Game.js";
import Keyboard from "./Keyboard.js";
import Player from "./Player.js";

function calculateDelta(lastTime, timeStamp){
  if(lastTime){
    return timeStamp - lastTime;
  } else {
    lastTime = timeStamp;
    return calculateDelta(lastTime, timeStamp);
  }
}

function run(lastTime, timeStamp, game){
  const dt = calculateDelta(lastTime, timeStamp)

    if(game.getState() === "running"){
      game.gatherInputs();
      game.update(dt);
      game.render();        
    }

  requestFrame(timeStamp, game);
}

function requestFrame(lastTime, game){
  window.requestAnimationFrame(timeStamp=>run(lastTime, timeStamp, game));
}

function startGame(game){
  game.setState("running");
  requestFrame(undefined, game);
}

document.addEventListener("DOMContentLoaded", event=>{
  class CanvasComponent extends React.Component {
    componentDidMount() {
      ReactDOM.findDOMNode(this).appendChild(this.props.canvas);
    }

    getDrawingContext() {
      return this.state.drawingContext;
    }

    render() {
      return (
        <div />
      );
    }
  }

  class Root extends React.Component {
    render() {
      return (
          <div>
            <div>Hello {this.props.name}</div>
            {this.props.canvas}
          </div>
      );
    }
  }

  const containerDomNode = document.getElementById("root");

  const playerName = "player#" + (Math.random() * 1000).toFixed(15);
  const mainPlayer = new Player(playerName);

  const opponents = new Map();
  
  const canvasHtmlElement = document.createElement("canvas");
  canvasHtmlElement.width = 500;
  canvasHtmlElement.height = 500;
  canvasHtmlElement.style.border = "1px solid black";
  const canvas = new Canvas(canvasHtmlElement);
  const canvasComponent = <CanvasComponent canvas={canvasHtmlElement} />;

  const keyboard = new Keyboard(document);

  const socket = io('http://agis.ddns.net:3001/');
  
  const game = new Game(mainPlayer, opponents, canvas, keyboard, socket);

  startGame(game);

  const rootComponent = <Root canvas={canvasComponent} />;
  ReactDOM.render(canvasComponent, containerDomNode);
});
