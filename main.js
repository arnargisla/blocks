const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sendPlayerUpdates = require("./server-src/sendPlayerUpdates.js");

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

const players = new Map();

io.on('connection', function(socket){
  console.log("new connection made");

  function addPlayer(msg){
    console.log("Initializing player for connection: ", socket.id);
    if(msg.name && msg.x && msg.y){
      console.log("Adding new player: ", msg);
      players.set(socket.id, msg);
    }else{
      console.log("Faulty init message received: ", msg);
    }
  }

  socket.on('update player', function(msg){
    if(!msg) return;
    if(players.has(socket.id)){
      const player = players.get(socket.id);
      player.x = msg.x || player.x;
      player.y = msg.y || player.y;
    } else {
      addPlayer(msg);
    }
  });

  socket.on('disconnect', function(){
    const player = players.get(socket.id);
    if(player){
      console.log("player disconnected " + socket.id + " removed");
      io.emit('player disconnected', player.name);
      players.delete(socket.id);
    }
  });

});

server.listen(port);
console.log("app started and listening at port " + port);

setInterval(()=>{sendPlayerUpdates(io, players);}, 50);

setInterval(()=>{
  const playerArray = Array.from(players.values());
  const playersString = playerArray.map(player => {
    const name = player.name.split(/#|\./)[1];
    return name + " x:" + player.x.toFixed(2) + " y:" + player.y.toFixed(2);
  });
  console.log("players:", playersString);
}, 3000);
