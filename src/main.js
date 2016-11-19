import { Canvas } from "./Canvas.js";
import { Game } from "./Game.js";
import { Keyboard } from "./Keyboard.js";
import { Player } from "./Player.js";

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
  console.log("Starting game!");
  game.setState("running");
  requestFrame(undefined, game);
}

document.addEventListener("DOMContentLoaded", event=>{
  const playerName = "player#" + (Math.random() * 1000).toFixed(0);
  const socket = io();
  const canvasHtmlElement = document.getElementById("canvas");
  const canvas = new Canvas(canvasHtmlElement);
  const mainPlayer = new Player(playerName);
  const opponents = new Set();
  const keyboard = new Keyboard(document);
  const game = new Game(mainPlayer, opponents, canvas, keyboard, socket);
  startGame(game);
});
