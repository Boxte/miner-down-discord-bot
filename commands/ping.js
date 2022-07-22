const { SlashCommandBuilder } = require("@discordjs/builders");
const { PING } = require("../constants/slash-commands");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(PING)
    .setDescription("Replies with Pong!"),
  async execute(interaction, isCron = false, channel) {
    if (isCron) {
      channel.send("Pong!");
    } else {
      await interaction.reply("Pong!");
    }
  },
};
