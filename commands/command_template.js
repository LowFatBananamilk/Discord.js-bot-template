const { SlashCommandBuilder } = require('@discordjs/builders');

const servers = require('../datas/server_settings.json');

let text;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Say hello back!'),

	execute(interaction) {
		const translationPath = servers[interaction.guildId] ? `../translations/${servers[interaction.guildId].language}.json` : '../translations/en.json';
		const { ping } = require(translationPath);
		text = ping;

		interaction.reply(text.cotent);
	},
};
