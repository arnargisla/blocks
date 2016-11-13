const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

io.on('connection', function(){
  console.log("new connection made");
});

server.listen(port);
console.log("app started and listening at port " + port);
