

const Builder = require('@discordjs/builders');

const Config = require('../../config');
const DiscordEmbeds = require('../discordTools/discordEmbeds.js');
const DiscordModals = require('../discordTools/discordModals.js');

module.exports = {
	name: 'settings',

	getData(client, guildId) {
		return new Builder.SlashCommandBuilder()
			.setName('settings')
			.setDescription('Configure bot settings')
			.addSubcommand(sub => sub
				.setName('general')
				.setDescription('prefix, commandDelay, language, mute in-game, in-game commands'))
			.addSubcommand(sub => sub
				.setName('notifications')
				.setDescription('connectionNotify, afkNotify, deathNotify, FCM alarm notifications'))
			.addSubcommand(sub => sub
				.setName('ingame')
				.setDescription('smartAlarm, smartSwitch, leaderCommand, vendingMachine notifications'))
			.addSubcommand(sub => sub
				.setName('battlemetrics')
				.setDescription('battlemetrics name changes, login/logout notifications'));
	},

	async execute(client, interaction) {
		if (!await client.validatePermissions(interaction)) return;

		if (Config.discord.needAdminPrivileges && !client.isAdministrator(interaction)) {
			const str = client.intlGet(interaction.guildId, 'missingPermission');
			client.interactionReply(interaction, DiscordEmbeds.getActionInfoEmbed(1, str));
			client.log(client.intlGet(null, 'warningCap'), str);
			return;
		}

		const guildId = interaction.guildId;
		const sub = interaction.options.getSubcommand();

		let modal;
		switch (sub) {
			case 'general':
				modal = DiscordModals.getSettingsGeneralModal(guildId);
				break;
			case 'notifications':
				modal = DiscordModals.getSettingsNotificationsModal(guildId);
				break;
			case 'ingame':
				modal = DiscordModals.getSettingsInGameModal(guildId);
				break;
			case 'battlemetrics':
				modal = DiscordModals.getSettingsBattlemetricsModal(guildId);
				break;
			default:
				return;
		}

		await interaction.showModal(modal);
	},
};
