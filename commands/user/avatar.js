const Discord = require("discord.js");
const db = require("wio.db");

exports.run = function(client, message, args) {
  let member = message.mentions.members.first();
  if (member) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Avatar:")
      .setColor("RANDOM")
      .setImage(member.user.avatarURL())
      .setFooter(member.user.username, member.user.avatarURL());
    message.channel.send(embed);
  } else {
    const embed = new Discord.MessageEmbed()
      .setTitle("Avatar:")
      .setColor("RANDOM")
      .setImage(message.author.avatarURL());
    message.channel.send(embed);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["av"],
  permLevel: 0
};

exports.help = {
  name: "avatar",
  description: "Avatar",
  usage: "avatar"
};
