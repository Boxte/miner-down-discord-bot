const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");
const { ARE_MINERS_ACTIVE } = require("../constants/slash-commands");

const dataRetrievalError =
  "Could not retrieve data for number of active miners.";

const getMinersStatus = async () => {
  let res;
  try {
    res = await axios.get(process.env.API_MINER_CHECK_ADDRESS);
  } catch (error) {
    console.log(error);
    return;
  }
  const numberOfActiveWorkers = res.data["numberOfActiveWorkers"];
  const utcReqResDifference = res.data["utcReqResDifference"];
  return { numberOfActiveWorkers, utcReqResDifference };
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(ARE_MINERS_ACTIVE)
    .setDescription("Replies with status of active miners."),
  async execute(interaction, isCron = false, channel) {
    if (!isCron) {
      await interaction.deferReply();
    }
    const {
      numberOfActiveWorkers,
      utcReqResDifference,
    } = await getMinersStatus();
    let msg;
    if (!numberOfActiveWorkers) {
      msg = dataRetrievalError;
    } else {
      msg = `Number of active workers: ${numberOfActiveWorkers}\nTime for response: ${
        utcReqResDifference / 1000
      }s`;
    }
    if (isCron) {
      channel.send(msg);
    } else {
      await interaction.editReply(msg);
    }
  },
};
