const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");

const getMinersStatus = async () => {
  const res = await axios.get(process.env.API_MINER_CHECK_ADDRESS);
  const numberOfActiveWorkers = res.data["numberOfActiveWorkers"];
  const utcReqResDifference = res.data["utcReqResDifference"];
  return { numberOfActiveWorkers, utcReqResDifference };
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("areminersactive")
    .setDescription("Replies with status of active miners."),
  async execute(interaction) {
    await interaction.deferReply();
    const {
      numberOfActiveWorkers,
      utcReqResDifference,
    } = await getMinersStatus();
    const msg = `Number of active workers: ${numberOfActiveWorkers}\nTime for response: ${
      utcReqResDifference / 1000
    }s`;
    await interaction.editReply(msg);
  },
};
