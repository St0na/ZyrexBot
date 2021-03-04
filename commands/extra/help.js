const Discord = require("discord.js");
const ayarlar = require("../../Config.json");
var prefix = ayarlar.prefix;
exports.run = (client, message, args) => {
  const juke = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setAuthor(`ZyrexBot`, client.user.avatarURL())
    .setDescription(
      "Thanks to this housing, you can see all commands in the bot"
    )
    .setThumbnail(client.user.avatarURL())
    .addField("**Admin**", "`announce`, `news`, `timerole`")
    .addField(
      "**Bot Owner**",
      "`leave`, `setactivity`, `setstatus`, `db-remove`, `eval`, `blacklist`, `load`"
    )
    .addField("**extra**", "`boosters`, `help`, `ticket`,`invites`,`moveme`")
    .addField(
      "**Moderation**",
      "`ban`,`jail`,`lock`,`mute`,`purge`,`unban`,`unlock`,`unmute`,`slowmode`,`tempban`"
    )
    .addField("**user**", "`avatar`,`suggest`,`pingrole`,`user-info`")
    .setFooter(``, client.user.avatarURL())
    .setTimestamp();
  message.channel.send(juke).catch();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "help",
  category: "extra",
  description: "show all commands"
};
