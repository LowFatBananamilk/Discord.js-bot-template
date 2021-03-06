// Require the necessary discord.js classes
const fs = require('fs');
const { discordClient, collection } = require('./shared/discordClient');

const { serverSettingsPath } = require('./config.json');

// Check for JSON data files
if (!fs.existsSync(serverSettingsPath)) {
	console.log(`There is no "${serverSettingsPath}". This might mean the data might have been lost!!`);
	fs.writeFileSync(serverSettingsPath, JSON.stringify({}, null, '\t'));
	console.log('Created a new file..');
}

// Reading command files
discordClient.commands = new collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	discordClient.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
discordClient.once('ready', () => {
	console.log('Ready!');
});

// When the client receives interaction, run this code
discordClient.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) {
		return;
	}

	// Dynamically executing commands
	const command = discordClient.commands.get(interaction.commandName);

	if (!command) {
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
discordClient.login(process.env.DISCORD_TOKEN);