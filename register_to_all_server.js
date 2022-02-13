const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { discordClient } = require('./shared/discordClient');

const commands = [];
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

discordClient.on('ready', async () => {
	try {
		const prevActivites = discordClient.user.presence.activities;
		const prevStatus = discordClient.user.presence.status;
		discordClient.user.setPresence({ activities: [{ name: 'Registering slash commands' }], status: 'idle' });
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(discordClient.user.id), { body: commands });

		discordClient.user.setPresence({ activities: prevActivites, status: prevStatus });
		console.log('Successfully reloaded application (/) commands.');
	}
	catch (error) {
		console.error(error);
	}
});

// Login to Discord with your client's token
discordClient.login(process.env.DISCORD_TOKEN);
