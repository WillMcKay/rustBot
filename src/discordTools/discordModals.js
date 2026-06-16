

const Discord = require('discord.js');

const Client = require('../../index.ts');
const TextInput = require('./discordTextInputs.js');

function boolSelect(customId, placeholder, currentValue) {
    return new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(placeholder)
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('True')
                    .setValue('true')
                    .setDefault(currentValue === true),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('False')
                    .setValue('false')
                    .setDefault(currentValue === false)
            )
    );
}

module.exports = {
    getModal: function (options = {}) {
        const modal = new Discord.ModalBuilder();

        if (options.hasOwnProperty('customId')) modal.setCustomId(options.customId);
        if (options.hasOwnProperty('title')) modal.setTitle(options.title.slice(0, 45));

        return modal;
    },

    getServerEditModal(guildId, serverId) {
        const instance = Client.client.getInstance(guildId);
        const server = instance.serverList[serverId];
        const identifier = JSON.stringify({ "serverId": serverId });

        const modal = module.exports.getModal({
            customId: `ServerEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editing')
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'ServerBattlemetricsId',
                label: Client.client.intlGet(guildId, 'battlemetricsId'),
                value: server.battlemetricsId === null ? '' : server.battlemetricsId,
                style: Discord.TextInputStyle.Short,
                required: false,
                minLength: 0
            }))
        );

        return modal;
    },

    getCustomTimersEditModal(guildId, serverId) {
        const instance = Client.client.getInstance(guildId);
        const server = instance.serverList[serverId];
        const identifier = JSON.stringify({ "serverId": serverId });

        const modal = module.exports.getModal({
            customId: `CustomTimersEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'customTimerEditDesc')
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'CargoShipEgressTime',
                label: Client.client.intlGet(guildId, 'customTimerEditCargoShipEgressLabel'),
                value: `${server.cargoShipEgressTimeMs / 1000}`,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'OilRigCrateUnlockTime',
                label: Client.client.intlGet(guildId, 'customTimerEditCrateOilRigUnlockLabel'),
                value: `${server.oilRigLockedCrateUnlockTimeMs / 1000}`,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSmartSwitchEditModal(guildId, serverId, entityId) {
        const instance = Client.client.getInstance(guildId);
        const entity = instance.serverList[serverId].switches[entityId];
        const identifier = JSON.stringify({ "serverId": serverId, "entityId": entityId });

        const modal = module.exports.getModal({
            customId: `SmartSwitchEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOf', {
                entity: entity.name.length > 18 ? `${entity.name.slice(0, 18)}..` : entity.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartSwitchName',
                label: Client.client.intlGet(guildId, 'name'),
                value: entity.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartSwitchCommand',
                label: Client.client.intlGet(guildId, 'customCommand'),
                value: entity.command,
                style: Discord.TextInputStyle.Short
            }))
        );

        if (entity.autoDayNightOnOff === 5 || entity.autoDayNightOnOff === 6) {
            modal.addComponents(
                new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                    customId: 'SmartSwitchProximity',
                    label: Client.client.intlGet(guildId, 'smartSwitchEditProximityLabel'),
                    value: `${entity.proximity}`,
                    style: Discord.TextInputStyle.Short
                }))
            );
        }

        return modal;
    },

    getGroupEditModal(guildId, serverId, groupId) {
        const instance = Client.client.getInstance(guildId);
        const group = instance.serverList[serverId].switchGroups[groupId];
        const identifier = JSON.stringify({ "serverId": serverId, "groupId": groupId });

        const modal = module.exports.getModal({
            customId: `GroupEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOf', {
                entity: group.name.length > 18 ? `${group.name.slice(0, 18)}..` : group.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupName',
                label: Client.client.intlGet(guildId, 'name'),
                value: group.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupCommand',
                label: Client.client.intlGet(guildId, 'customCommand'),
                value: group.command,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getGroupAddSwitchModal(guildId, serverId, groupId) {
        const instance = Client.client.getInstance(guildId);
        const group = instance.serverList[serverId].switchGroups[groupId];
        const identifier = JSON.stringify({ "serverId": serverId, "groupId": groupId });

        const modal = module.exports.getModal({
            customId: `GroupAddSwitch${identifier}`,
            title: Client.client.intlGet(guildId, 'groupAddSwitchDesc', { group: group.name })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupAddSwitchId',
                label: Client.client.intlGet(guildId, 'entityId'),
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getGroupRemoveSwitchModal(guildId, serverId, groupId) {
        const instance = Client.client.getInstance(guildId);
        const group = instance.serverList[serverId].switchGroups[groupId];
        const identifier = JSON.stringify({ "serverId": serverId, "groupId": groupId });

        const modal = module.exports.getModal({
            customId: `GroupRemoveSwitch${identifier}`,
            title: Client.client.intlGet(guildId, 'groupRemoveSwitchDesc', { group: group.name })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'GroupRemoveSwitchId',
                label: Client.client.intlGet(guildId, 'entityId'),
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSmartAlarmEditModal(guildId, serverId, entityId) {
        const instance = Client.client.getInstance(guildId);
        const entity = instance.serverList[serverId].alarms[entityId];
        const identifier = JSON.stringify({ "serverId": serverId, "entityId": entityId });

        const modal = module.exports.getModal({
            customId: `SmartAlarmEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOf', {
                entity: entity.name.length > 18 ? `${entity.name.slice(0, 18)}..` : entity.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartAlarmName',
                label: Client.client.intlGet(guildId, 'name'),
                value: entity.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartAlarmMessage',
                label: Client.client.intlGet(guildId, 'message'),
                value: entity.message,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SmartAlarmCommand',
                label: Client.client.intlGet(guildId, 'customCommand'),
                value: entity.command,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getStorageMonitorEditModal(guildId, serverId, entityId) {
        const instance = Client.client.getInstance(guildId);
        const entity = instance.serverList[serverId].storageMonitors[entityId];
        const identifier = JSON.stringify({ "serverId": serverId, "entityId": entityId });

        const modal = module.exports.getModal({
            customId: `StorageMonitorEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOf', {
                entity: entity.name.length > 18 ? `${entity.name.slice(0, 18)}..` : entity.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'StorageMonitorName',
                label: Client.client.intlGet(guildId, 'name'),
                value: entity.name,
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getTrackerEditModal(guildId, trackerId) {
        const instance = Client.client.getInstance(guildId);
        const tracker = instance.trackers[trackerId];
        const identifier = JSON.stringify({ "trackerId": trackerId });

        const modal = module.exports.getModal({
            customId: `TrackerEdit${identifier}`,
            title: Client.client.intlGet(guildId, 'editingOf', {
                entity: tracker.name.length > 18 ? `${tracker.name.slice(0, 18)}..` : tracker.name
            })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerName',
                label: Client.client.intlGet(guildId, 'name'),
                value: tracker.name,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerBattlemetricsId',
                label: Client.client.intlGet(guildId, 'battlemetricsId'),
                value: tracker.battlemetricsId,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerClanTag',
                label: Client.client.intlGet(guildId, 'clanTag'),
                value: tracker.clanTag,
                style: Discord.TextInputStyle.Short,
                required: false,
                minLength: 0
            }))
        );

        return modal;
    },

    getTrackerAddPlayerModal(guildId, trackerId) {
        const instance = Client.client.getInstance(guildId);
        const tracker = instance.trackers[trackerId];
        const identifier = JSON.stringify({ "trackerId": trackerId });

        const modal = module.exports.getModal({
            customId: `TrackerAddPlayer${identifier}`,
            title: Client.client.intlGet(guildId, 'trackerAddPlayerDesc', { tracker: tracker.name })
        });


        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerAddPlayerId',
                label: `${Client.client.intlGet(guildId, 'steamId')} / ` +
                    `${Client.client.intlGet(guildId, 'battlemetricsId')}`,
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getTrackerRemovePlayerModal(guildId, trackerId) {
        const instance = Client.client.getInstance(guildId);
        const tracker = instance.trackers[trackerId];
        const identifier = JSON.stringify({ "trackerId": trackerId });

        const modal = module.exports.getModal({
            customId: `TrackerRemovePlayer${identifier}`,
            title: Client.client.intlGet(guildId, 'trackerRemovePlayerDesc', { tracker: tracker.name })
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'TrackerRemovePlayerId',
                label: `${Client.client.intlGet(guildId, 'steamId')} / ` +
                    `${Client.client.intlGet(guildId, 'battlemetricsId')}`,
                value: '',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSettingsGeneralModal(guildId) {
        const instance = Client.client.getInstance(guildId);
        const gs = instance.generalSettings;

        const modal = module.exports.getModal({
            customId: 'SettingsGeneral',
            title: 'General Settings'
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsPrefix',
                label: 'Command Prefix',
                value: `${gs.prefix}`,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsCommandDelay',
                label: 'Command Delay (seconds)',
                value: `${gs.commandDelay}`,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsLanguage',
                label: 'Language (e.g. en)',
                value: `${gs.language}`,
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsMuteInGameBotMessages',
                label: 'Mute In-Game Bot Messages (true/false)',
                value: `${gs.muteInGameBotMessages}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsInGameCommandsEnabled',
                label: 'In-Game Commands Enabled (true/false)',
                value: `${gs.inGameCommandsEnabled}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSettingsNotificationsModal(guildId) {
        const instance = Client.client.getInstance(guildId);
        const gs = instance.generalSettings;

        const modal = module.exports.getModal({
            customId: 'SettingsNotifications',
            title: 'Notification Settings'
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsConnectionNotify',
                label: 'Connection Notify (true/false)',
                value: `${gs.connectionNotify}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsAfkNotify',
                label: 'AFK Notify (true/false)',
                value: `${gs.afkNotify}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsDeathNotify',
                label: 'Death Notify (true/false)',
                value: `${gs.deathNotify}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsFcmAlarmNotificationEnabled',
                label: 'FCM Alarm Notification (true/false)',
                value: `${gs.fcmAlarmNotificationEnabled}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsFcmAlarmNotificationEveryone',
                label: 'FCM Alarm @everyone (true/false)',
                value: `${gs.fcmAlarmNotificationEveryone}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSettingsInGameModal(guildId) {
        const instance = Client.client.getInstance(guildId);
        const gs = instance.generalSettings;

        const modal = module.exports.getModal({
            customId: 'SettingsInGame',
            title: 'In-Game Settings'
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsSmartAlarmNotifyInGame',
                label: 'Smart Alarm Notify In-Game (true/false)',
                value: `${gs.smartAlarmNotifyInGame}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsSmartSwitchNotify',
                label: 'Smart Switch Notify In-Game (true/false)',
                value: `${gs.smartSwitchNotifyInGameWhenChangedFromDiscord}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsLeaderCommandEnabled',
                label: 'Leader Command Enabled (true/false)',
                value: `${gs.leaderCommandEnabled}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsLeaderCommandOnlyForPaired',
                label: 'Leader Command Only Paired (true/false)',
                value: `${gs.leaderCommandOnlyForPaired}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsVendingMachineNotify',
                label: 'Vending Machine Notify In-Game (true/false)',
                value: `${gs.itemAvailableInVendingMachineNotifyInGame}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },

    getSettingsBattlemetricsModal(guildId) {
        const instance = Client.client.getInstance(guildId);
        const gs = instance.generalSettings;

        const modal = module.exports.getModal({
            customId: 'SettingsBattlemetrics',
            title: 'Battlemetrics Settings'
        });

        modal.addComponents(
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsBmServerNameChanges',
                label: 'Server Name Changes (true/false)',
                value: `${gs.battlemetricsServerNameChanges}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsBmTrackerNameChanges',
                label: 'Tracker Name Changes (true/false)',
                value: `${gs.battlemetricsTrackerNameChanges}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsBmGlobalNameChanges',
                label: 'Global Name Changes (true/false)',
                value: `${gs.battlemetricsGlobalNameChanges}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsBmGlobalLogin',
                label: 'Global Login Notify (true/false)',
                value: `${gs.battlemetricsGlobalLogin}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            })),
            new Discord.ActionRowBuilder().addComponents(TextInput.getTextInput({
                customId: 'SettingsBmGlobalLogout',
                label: 'Global Logout Notify (true/false)',
                value: `${gs.battlemetricsGlobalLogout}`,
                placeholder: 'true or false',
                style: Discord.TextInputStyle.Short
            }))
        );

        return modal;
    },
}