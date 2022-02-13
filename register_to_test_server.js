const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { discordClient } = require('./shared/discordClient');

const { test_servers } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		const prevActivites = discordClient.user.presence.activities;
		const prevStatus = discordClient.user.presence.status;
		discordClient.user.setPresence({ activities: [{ name: 'Registering slash commands' }], status: 'idle' });
		console.log('Started refreshing application (/) commands.');

		test_servers.forEach(async guildId => {
			await rest.put(Routes.applicationGuildCommands(discordClient.user.id, guildId), { body: commands });

			console.log(`Successfully reloaded application (/) commands to ${guildId}`);
		});
		discordClient.user.setPresence({ activities: prevActivites, status: prevStatus });
	}
	catch (error) {
		console.error(error);
	}
})();
