

const Constants = require('../util/constants.js');
const DiscordMessages = require('../discordTools/discordMessages.js');
const DiscordTools = require('../discordTools/discordTools.js');
const Scrape = require('../util/scrape.js');

module.exports = {
    handler: async function (client, firstTime = false) {
        const searchSteamProfiles = (client.battlemetricsIntervalCounter === 0) ? true : false;
        const calledSteamProfiles = new Object();

        if (!firstTime) await client.updateBattlemetricsInstances();

        for (const guildItem of client.guilds.cache) {
            const guildId = guildItem[0];
            const instance = client.getInstance(guildId);
            const rustplus = client.rustplusInstances[guildId];


            /* Update information channel battlemetrics players */
            const bmId = instance.activeServer !== null ?
                instance.serverList[instance.activeServer].battlemetricsId : null;
            let condition = instance.generalSettings.displayInformationBattlemetricsAllOnlinePlayers;
            condition &= instance.activeServer !== null;
            condition &= bmId !== null;
            condition &= client.battlemetricsInstances.hasOwnProperty(bmId);
            condition &= rustplus && rustplus.isOperational;

            for (const [trackerId, content] of Object.entries(instance.trackers)) {
                const battlemetricsId = content.battlemetricsId;
                const bmInstance = client.battlemetricsInstances[battlemetricsId];

                if (!bmInstance || !bmInstance.lastUpdateSuccessful) continue;

                if (firstTime || searchSteamProfiles) {
                    for (const player of content.players) {
                        if (player.steamId === null) continue;

                        let name = null;
                        if (calledSteamProfiles.hasOwnProperty(player.steamId)) {
                            name = calledSteamProfiles[player.steamId];
                        }
                        else {
                            name = await Scrape.scrapeSteamProfileName(client, player.steamId);
                            calledSteamProfiles[player.steamId] = name;
                        }
                        if (name === null) continue;

                        name = (content.clanTag !== '' ? `${content.clanTag} ` : '') + `${name}`;

                        if (player.name !== name) {
                            const newPlayerId = Object.keys(bmInstance.players)
                                .find(e => bmInstance.players[e]['name'] === name);
                            player.playerId = newPlayerId ? newPlayerId : null;
                            player.name = name;
                        }
                    }

                    client.setInstance(guildId, instance);

                    if (firstTime) {
                        continue;
                    }
                }

                const trackerPlayerIds = content.players.map(e => e.playerId);

                /* Check if Player just came online */
                for (const playerId of trackerPlayerIds.filter(e => bmInstance.newPlayers.includes(e))) {
                    for (const player of content.players) {
                        if (player.playerId !== playerId) continue;

                        const str = client.intlGet(guildId, 'playerJustConnectedTracker', {
                            name: player.name,
                            tracker: content.name
                        });
                        if (rustplus && (rustplus.serverId === content.serverId) && content.inGame) {
                            rustplus.sendInGameMessage(str);
                        }
                    }
                }

                /* Check if Player just came online */
                for (const playerId of trackerPlayerIds.filter(e => bmInstance.loginPlayers.includes(e))) {
                    for (const player of content.players) {
                        if (player.playerId !== playerId) continue;

                        const str = client.intlGet(guildId, 'playerJustConnectedTracker', {
                            name: player.name,
                            tracker: content.name
                        });
                        if (rustplus && (rustplus.serverId === content.serverId) && content.inGame) {
                            rustplus.sendInGameMessage(str);
                        }
                    }
                }

                /* Check if Player just went offline */
                for (const playerId of trackerPlayerIds.filter(e => bmInstance.logoutPlayers.includes(e))) {
                    for (const player of content.players) {
                        if (player.playerId !== playerId) continue;

                        const str = client.intlGet(guildId, 'playerJustDisconnectedTracker', {
                            name: player.name,
                            tracker: content.name
                        });

                        if (rustplus && (rustplus.serverId === content.serverId) && content.inGame) {
                            rustplus.sendInGameMessage(str);
                        }
                    }
                }

                client.setInstance(guildId, instance);
            }
        }

        if (client.battlemetricsIntervalCounter === 29) {
            client.battlemetricsIntervalCounter = 0;
        }
        else {
            client.battlemetricsIntervalCounter += 1;
        }
    },

}