/** @type {import("../commandHandler").Command} */
module.exports = {
  name: "ping",
  aliases: ["p"],
  execute(rustplus) {
    console.log("Received ping command");
    rustplus.sendTeamMessage("pong!");
  },
};
