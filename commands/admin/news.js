const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_GUILD"))
    return message.reply("**You do not have permission**");
  let channels = message.mentions.channels.first();
  if (!channels) return message.reply("**please tag a channel!**");
  let Alonie = args.slice(1).join(" ");
  if (!Alonie)
    return message.reply("**Please write the content of the news!**");
  //emojiler
  let happy = "<:ZyrexEmoji2:767028954459799572>";
  let happy2 = "<:ZyrexEmoji:767029077508751370>";
  let tik = "<:ZyrexVerified:789515195612790815>";
  let ok = "<:bruh:767029377724055592>";

  //emojiler
  let embed = new Discord.MessageEmbed()
    .setTitle("News")
    .setThumbnail(message.guild.iconURL())
    .setColor("#FFFF00")
    .setDescription(`${Alonie}`)
    .setTimestamp()
    .setFooter("TeamZyrex");
  channels.send(embed).then(message => {
    message.react(tik);
    message.react(happy2);
    message.react(happy);
    message.react(ok);
    channels.send("<@&783734465586397184>").then(message => {
      message.delete({ timeout: 200 });
    });
  }, 2000);
};
module.exports.conf = {
  aliases: ["News"]
};

module.exports.help = {
  name: "news"
};
