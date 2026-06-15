

const DiscordTools = require('../discordTools/discordTools.js');
const PermissionHandler = require('../handlers/permissionHandler.js');

module.exports = async (client, guild, category) => {
    await addTextChannel(client.intlGet(guild.id, 'channelNameServers'), 'servers', client, guild, category);
    await addTextChannel(client.intlGet(guild.id, 'channelNameTeamchat'), 'teamchat', client, guild, category, true);
    await addTextChannel('devices', 'switches', client, guild, category);

    /* All smart device types share the same channel */
    const instance = client.getInstance(guild.id);
    instance.channelId.switchGroups = instance.channelId.switches;
    instance.channelId.alarms = instance.channelId.switches;
    instance.channelId.storageMonitors = instance.channelId.switches;
    client.setInstance(guild.id, instance);
};

async function addTextChannel(name, idName, client, guild, parent, permissionWrite = false) {
    const instance = client.getInstance(guild.id);

    let channel = undefined;
    if (instance.channelId[idName] !== null) {
        channel = DiscordTools.getTextChannelById(guild.id, instance.channelId[idName]);
    }
    if (channel === undefined) {
        channel = await DiscordTools.addTextChannel(guild.id, name);
        instance.channelId[idName] = channel.id;
        client.setInstance(guild.id, instance);

        try {
            channel.setParent(parent.id);
        }
        catch (e) {
            client.log(client.intlGet(null, 'errorCap'),
                client.intlGet(null, 'couldNotSetParent', { channelId: channel.id }), 'error');
        }
    }

    if (instance.firstTime) {
        try {
            channel.setParent(parent.id);
        }
        catch (e) {
            client.log(client.intlGet(null, 'errorCap'),
                client.intlGet(null, 'couldNotSetParent', { channelId: channel.id }), 'error');
        }
    }

    const perms = PermissionHandler.getPermissionsReset(client, guild, permissionWrite);

    try {
        await channel.permissionOverwrites.set(perms);
    }
    catch (e) {
        /* Ignore */
    }

    /* Currently, this halts the entire application... Too lazy to fix...
       It is possible to just remove the channels and let the bot recreate them with correct name language */
    //channel.setName(name);

    channel.lockPermissions();
}