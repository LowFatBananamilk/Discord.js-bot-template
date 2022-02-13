const { Client, Collection, Intents } = require('discord.js');

// Create a new client instance
const allIntents = new Intents(32767);
const discordClient = new Client({ intents: allIntents });

module.exports = { discordClient, collection: Collection };
