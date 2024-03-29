require("dotenv").config();
const cron = require("node-cron");
const fs = require("node:fs");
const path = require("node:path");
const Discord = require("discord.js");
const { Collection } = require("discord.js");
const { PING, ARE_MINERS_ACTIVE } = require("./constants/slash-commands");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  let cryptoChannel = client.channels.cache.get(process.env.CRYPTO_CHANNEL_ID);

  cron.schedule(
    "00 8,21 * * *",
    async () => {
      try {
        const command = client.commands.get(ARE_MINERS_ACTIVE);
        await command.execute(`/${ARE_MINERS_ACTIVE}`, true, cryptoChannel);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    },
    { timezone: "America/Los_Angeles" }
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.CLIENT_TOKEN);
