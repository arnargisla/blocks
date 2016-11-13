import { Player } from "Player.js";

class Canvas {
  constructor(canvasHtmlElemnt){
    this.canvas = canvasHtmlElemnt;
  }
}

class Game {
    constructor(players){
        this.players = players;
    }

    gatherInputs(){

    }

    update(dt){

    }

    render(ctx){
        [...this.players].map(p => p.render());
    }
}

function calculateDelta(lastTime, timeStamp){
    if(lastTime){
        return timeStamp - lastTime;
    } else {
        lastTime = timeStamp;
        return calculateDelta(lastTime, timeStamp);
    }
}

function run(lastTime, timeStamp, game){
    dt = calculateDelta(lastTime, timeStamp)
    
    if(game.state === "running"){
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
    requestFrame(undefined, game);
}

const canvas = new Canvas(document.getElementById("canvas"));
const player1 = new Player("Nebukadnes");
const players = new Set();
players.add(player1);
const game = new Game(players);

startGame(game);
