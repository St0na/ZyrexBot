const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
  let bug = args.join(" ").slice(0);
  let user = message.author.username;
  let guild = message.guild.name;
  let guildid = message.guild.id;
  let kanal = message.channel.name;
  let kanalid = message.channel.id;
  let channel = bot.channels.cache.get("786759205033869313"); //bug repot kanal id
  // EMOJİLER
  let no = "<:No:795899151438577695>";
  let yes = "<:Yes:795899220276019200>";
  let idk = "<:idk:795899093733212170>";
  // EMOJİLER

  let embed = new Discord.MessageEmbed()
    .setTitle("New Suggest!")
    .addField("Suggest", bug)
    .addField("Notifying Person", user, true)
    .addField("Server", guild, true)
    .addField("Server İD", guildid, true)
    .addField("Channel", kanal, true)
    .addField("Channel ID", kanalid, true)
    .setColor("BLUE");
  const embed2 = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setDescription(
      `${message.author.username} Success thanks to for suggesting!`
    );
  message.channel.send(embed2);
  channel.send(embed).then(message => {
    message.react(no);
    message.react(yes);
    message.react(idk);
  });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["hatabildir"],
  permLevel: 0
};
exports.help = {
  name: "suggest",
  description: "suggestion sistem",
  usage: "suggest"
};
