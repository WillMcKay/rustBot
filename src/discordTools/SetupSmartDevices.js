

const DiscordTools = require('./discordTools.js');

module.exports = async (client, rustplus) => {
    const instance = client.getInstance(rustplus.guildId);
    const guildId = rustplus.guildId;

    if (rustplus.isNewConnection) {
        await DiscordTools.clearTextChannel(guildId, instance.channelId.switches, 100);
    }

    await require('./SetupSwitches')(client, rustplus);
    await require('./SetupSwitchGroups')(client, rustplus);
    await require('./SetupAlarms')(client, rustplus);
    await require('./SetupStorageMonitors')(client, rustplus);
};
