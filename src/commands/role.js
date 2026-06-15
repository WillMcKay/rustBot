

const Builder = require('@discordjs/builders');

const DiscordEmbeds = require('../discordTools/discordEmbeds');
const DiscordTools = require('../discordTools/discordTools');
const PermissionHandler = require('../handlers/permissionHandler.js');

module.exports = {
	name: 'role',

	getData(client, guildId) {
		return new Builder.SlashCommandBuilder()
			.setName('role')
			.setDescription(client.intlGet(guildId, 'commandsRoleDesc'))
			.addSubcommand(subcommand => subcommand
				.setName('set')
				.setDescription(client.intlGet(guildId, 'commandsRoleSetDesc'))
				.addRoleOption(option => option
					.setName('role')
					.setDescription(client.intlGet(guildId, 'commandsRoleSetRoleDesc'))
					.setRequired(true)))
			.addSubcommand(subcommand => subcommand
				.setName('clear')
				.setDescription(client.intlGet(guildId, 'commandsRoleClearDesc')));
	},

	async execute(client, interaction) {
		const instance = client.getInstance(interaction.guildId);

		const verifyId = Math.floor(100000 + Math.random() * 900000);
		client.logInteraction(interaction, verifyId, 'slashCommand');

		if (!await client.validatePermissions(interaction)) return;

		if (!client.isAdministrator(interaction)) {
			const str = client.intlGet(interaction.guildId, 'missingPermission');
			client.interactionReply(interaction, DiscordEmbeds.getActionInfoEmbed(1, str));
			client.log(client.intlGet(null, 'warningCap'), str);
			return;
		}

		await interaction.deferReply({ ephemeral: true });

		let role = null;
		switch (interaction.options.getSubcommand()) {
			case 'set': {
				role = interaction.options.getRole('role');
				instance.role = role.id;
				client.setInstance(interaction.guildId, instance);

			} break;

			case 'clear': {
				instance.role = null;
				client.setInstance(interaction.guildId, instance);

			} break;

			default: {
			} break;
		}

		client.log(client.intlGet(null, 'infoCap'), client.intlGet(null, 'slashCommandValueChange', {
			id: `${verifyId}`,
			value: `${interaction.options.getSubcommand()}`
		}));

		const guild = DiscordTools.getGuild(interaction.guildId);
		if (guild) {
			const category = await require('../discordTools/SetupGuildCategory')(client, guild);
			await require('../discordTools/SetupGuildChannels')(client, guild, category);
			await PermissionHandler.resetPermissionsAllChannels(client, guild);
		}

		if (interaction.options.getSubcommand() === 'set') {
			const str = client.intlGet(interaction.guildId, 'roleSet', { name: role.name });
			await client.interactionEditReply(interaction, DiscordEmbeds.getActionInfoEmbed(0, str));
			client.log(client.intlGet(null, 'infoCap'), str);
		}
		else {
			const str = client.intlGet(interaction.guildId, 'roleCleared');
			await client.interactionEditReply(interaction, DiscordEmbeds.getActionInfoEmbed(0, str));
			client.log(client.intlGet(null, 'infoCap'), str);
		}
	},
};
