const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("wio.db");
exports.run = async (bot, message, args, client) => {
  const id = require("quick.db");
  if (message.author.id !== "631189057862631496")
    return message.channel.send(":x: You do not have permission :x:");

  let guildid = args[0];
  if (!guildid)
    return message.channel.send(":x: Enter the ID of the server to leave :x:");
  bot.guilds.cache.get(guildid).leave();
  const embed = new Discord.MessageEmbed()

    .addField("transaction successful ", "I left the server🔔")
    .addField(`Server ID:`, `ID: ${guildid}`)
    .setFooter("TeamZyrex");
  message.channel.send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["Leave"],
  permLevel: 4
};
exports.help = {
  name: "leave",
  description: "Belirtilen İD deki Sunucudan Ayrılır",
  usage: "leave"
};
