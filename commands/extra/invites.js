const Discord = require("discord.js");
const config = require("../../Config.json");
const db = require("wio.db");
exports.run = async (client, message, args) => {
  let user = message.mentions.users.first() || message.author;
  let inv = db.fetch(`inv.${user.id}.total`) || 0;
  message.channel.send(
    new Discord.MessageEmbed().addField("Total invites:", inv)
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["invite"],
  permLevel: 0
};

exports.help = {
  name: "invites",
  description: "show your invites",
  usage: "invites"
};
