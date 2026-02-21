const dotenv = require("dotenv");
const express = require("express");
const RustPlus = require("@liamcottle/rustplus.js");
const CommandHandler = require("./commandHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const bots = new Map();

const commandPrefix = ".";
const commandHandler = new CommandHandler(commandPrefix);

// Load all commands on startup
commandHandler.loadCommands();

app.use(express.json());

function requireApiSecret(req, res, next) {
  const expected = process.env.RUSTBOT_API_SECRET;
  if (!expected) {
    return res.status(500).json({ error: "RUSTBOT_API_SECRET not set" });
  }

  const provided = req.header("x-api-secret");
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/bots/:steamId", requireApiSecret, (req, res) => {
  const { steamId } = req.params;

  if (!steamId) {
    return res.status(400).json({ error: "Missing steamId" });
  }

  if (!bots.has(steamId)) {
    return res.status(404).json({ error: "Bot not found" });
  }

  const bot = bots.get(steamId);

  return res.json({
    exists: true,
    status: "running",
    bot: {
      steamId,
      server: bot.server,
      port: bot.port,
      playerId: bot.playerId,
    },
  });
});

app.post("/bots", requireApiSecret, (req, res) => {
  const { steamId, server, port: appPort, playerId, playerToken } = req.body || {};

  if (!steamId || !server || !appPort || !playerId || !playerToken) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["steamId", "server", "port", "playerId", "playerToken"],
    });
  }

  if (bots.has(steamId)) {
    return res.status(409).json({ error: "Bot already exists" });
  }

  const rustplus = new RustPlus(server, appPort, playerId, playerToken);
  rustplus.on("connected", () => {
    console.log(`Rust+ connected for steamId ${steamId}`);

    rustplus.getTeamInfo(() => {});
  });
  rustplus.on("disconnected", () => {
    console.log(`Rust+ disconnected for steamId ${steamId}`);
  });
  
  rustplus.on("error", (err) => {
    console.error(`Rust+ error for steamId ${steamId}`, err);
  });
  rustplus.on("event", (event) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    rustplus.sendTeamMessage('Event spawned: ', event)
  });

  rustplus.on("message", (packet) => {
    const chatMsg = packet?.broadcast?.teamMessage?.message?.message;
    if (!chatMsg) return;

    commandHandler.handleMessage(chatMsg, rustplus);
  });

  rustplus.connect();

  bots.set(steamId, {
    rustplus,
    server,
    port: appPort,
    playerId,
  });

  return res.status(201).json({ steamId, status: "created" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
