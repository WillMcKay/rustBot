/** @type {import("../commandHandler").Command} */
module.exports = {
  name: "pop",
  aliases: ["population"],
  execute(rustplus) {
    rustplus.getInfo((response) => {
      if (response.response?.info) {
        const info = response.response.info;
        const players = info.players || 0;
        const maxPlayers = info.maxPlayers || 0;
        const queuedPlayers = info.queuedPlayers || 0;
        
        let message = `:heartrock: Pop: ${players}/${maxPlayers}`;
        
        if (queuedPlayers > 0) {
          message += ` (+${queuedPlayers} queued)`;
        }
        
        rustplus.sendTeamMessage(message);
      } else {
        rustplus.sendTeamMessage("Failed to get server info");
      }
    });
  },
};
