require('dotenv').config();
const { default: axios } = require('axios');
const Discord = require('discord.js');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const getMinersStatus = async () => {
    const res = await axios.get(process.env.API_MINER_CHECK_ADDRESS);
    const numberOfActiveWorkers = res.data["numberOfActiveWorkers"];
    const utcReqResDifference = res.data["utcReqResDifference"];
    return { numberOfActiveWorkers, utcReqResDifference };
}

client.on('messageCreate', async msg => {
    switch (msg.content) {
        case "!whereareyou":
            msg.reply("I'm here!");
            break;
        case "!status":
            msg.reply("Getting status...");
            const { numberOfActiveWorkers, utcReqResDifference } = await getMinersStatus();
            msg.channel.send(`Number of active workers: ${numberOfActiveWorkers}\nTime for response: ${utcReqResDifference / 1000}s`);
            break;
        default:
            break;
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN); 