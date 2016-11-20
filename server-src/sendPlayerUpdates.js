function sendPlayerUpdates(io, players){
  const message = { players: [] };
  players.forEach((player, id)=>message.players.push(player));
  io.emit('players update', message);
}

module.exports = sendPlayerUpdates;
