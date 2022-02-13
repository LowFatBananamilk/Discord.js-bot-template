const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns "🏓 Pong!"'),

	execute(interaction) {
		interaction.reply('🏓 Pong!');
	},
};
