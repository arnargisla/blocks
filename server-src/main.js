const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sendPlayerUpdates = require("./sendPlayerUpdates.js");

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

const players = new Map();

io.on('connection', function(socket){
  console.log("new connection made");

  socket.on('init player', function(msg){
    console.log('init player', socket.id, msg);
    players.set(socket.id, msg);
  });

  socket.on('update player', function(msg){
    if(!msg) return;
    if(players.has(socket.id)){
      const player = players.get(socket.id);
      player.x = msg.x;
      player.y = msg.y;
    }
  });
});

io.on('disconnect', function(socket){
  players.delete(socket.id);
  console.log("player disconnected " + socket.id + " removed");
});

server.listen(port);
console.log("app started and listening at port " + port);

setInterval(()=>{sendPlayerUpdates(io, players);}, 50);
