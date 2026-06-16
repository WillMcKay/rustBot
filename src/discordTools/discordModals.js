

const Discord = require('discord.js');

const Client = require('../../index.ts');
const TextInput = require('./discordTextInputs.js');

const LANGUAGES = [
    { label: 'Czech (cs)', value: 'cs' },
    { label: 'German (de)', value: 'de' },
    { label: 'English (en)', value: 'en' },
    { label: 'Spanish (es)', value: 'es' },
    { label: 'French (fr)', value: 'fr' },
    { label: 'Italian (it)', value: 'it' },
    { label: 'Korean (ko)', value: 'ko' },
    { label: 'Polish (pl)', value: 'pl' },
    { label: 'Portuguese (pt)', value: 'pt' },
    { label: 'Russian (ru)', value: 'ru' },
    { label: 'Swedish (sv)', value: 'sv' },
    { label: 'Turkish (tr)', value: 'tr' },
];

function boolLabel(customId, labelText, currentValue) {
    return new Discord.LabelBuilder()
        .setLabel(labelText)
        .setCheckboxComponent(
            new Discord.CheckboxBuilder()
                .setCustomId(customId)
                .setDefault(currentValue === true)
        );
}

function languageLabel(customId, labelText, currentValue) {
    const select = new Discord.StringSelectMenuBuilder()
        .setCustomId(customId)
        .setRequired(true)
        .addOptions(
            LANGUAGES.map(lang =>
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(lang.label)
                    .setValue(lang.value)
                    .setDefault(lang.value === currentValue)
            )
        );
    return new Discord.LabelBuilder()
        .setLabel(labelText)
        .setStringSelectMenuComponent(select);
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
            }))
        );
        modal.addLabelComponents(
            languageLabel('SettingsLanguage', 'Language', gs.language),
            boolLabel('SettingsMuteInGameBotMessages', 'Mute In-Game Bot Messages', gs.muteInGameBotMessages),
            boolLabel('SettingsInGameCommandsEnabled', 'In-Game Commands Enabled', gs.inGameCommandsEnabled)
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

        modal.addLabelComponents(
            boolLabel('SettingsConnectionNotify', 'Connection Notify', gs.connectionNotify),
            boolLabel('SettingsAfkNotify', 'AFK Notify', gs.afkNotify),
            boolLabel('SettingsDeathNotify', 'Death Notify', gs.deathNotify),
            boolLabel('SettingsFcmAlarmNotificationEnabled', 'FCM Alarm Notification', gs.fcmAlarmNotificationEnabled),
            boolLabel('SettingsFcmAlarmNotificationEveryone', 'FCM Alarm @everyone', gs.fcmAlarmNotificationEveryone)
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

        modal.addLabelComponents(
            boolLabel('SettingsSmartAlarmNotifyInGame', 'Smart Alarm Notify In-Game', gs.smartAlarmNotifyInGame),
            boolLabel('SettingsSmartSwitchNotify', 'Smart Switch Notify In-Game', gs.smartSwitchNotifyInGameWhenChangedFromDiscord),
            boolLabel('SettingsLeaderCommandEnabled', 'Leader Command Enabled', gs.leaderCommandEnabled),
            boolLabel('SettingsLeaderCommandOnlyForPaired', 'Leader Command Only Paired', gs.leaderCommandOnlyForPaired),
            boolLabel('SettingsVendingMachineNotify', 'Vending Machine Notify In-Game', gs.itemAvailableInVendingMachineNotifyInGame)
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

        modal.addLabelComponents(
            boolLabel('SettingsBmServerNameChanges', 'Server Name Changes', gs.battlemetricsServerNameChanges),
            boolLabel('SettingsBmTrackerNameChanges', 'Tracker Name Changes', gs.battlemetricsTrackerNameChanges),
            boolLabel('SettingsBmGlobalNameChanges', 'Global Name Changes', gs.battlemetricsGlobalNameChanges),
            boolLabel('SettingsBmGlobalLogin', 'Global Login Notify', gs.battlemetricsGlobalLogin),
            boolLabel('SettingsBmGlobalLogout', 'Global Logout Notify', gs.battlemetricsGlobalLogout)
        );

        return modal;
    },
}