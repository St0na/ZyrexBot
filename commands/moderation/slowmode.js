const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (message.channel.type !== "text") return;
  const limit = args[0] ? args[0] : 0;
  if (!limit) {
    var embed = new Discord.MessageEmbed()
      .setDescription(
        `<:error:798236032394723379> Correct usage: \`!slowmode <time>\``
      )
      .setColor("YELLOW")
      .setTimestamp();
    message.channel.send({ embed });
    return;
  }
  if (limit > 21600) {
    return message.channel.send(
      new Discord.MessageEmbed()
        .setDescription(
          "<:error:798236032394723379> The time limit can be a maximum of **21,600** seconds.<:error:798236032394723379>"
        )
        .setColor("RED")
    );
  }
  message.channel.send(
    new Discord.MessageEmbed()
      .setDescription(
        `<a:tik:759020203634851912> Yavaş Mod **${limit}** Saniye Olarak Ayarlandı!`
      )
      .setColor("YELLOW")
  );
  var request = require("request");
  request({
    url: `https://discordapp.com/api/v7/channels/${message.channel.id}`,
    method: "PATCH",
    json: {
      rate_limit_per_user: limit
    },
    headers: {
      Authorization: `Bot`
    }
  });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sm", "Slowmode", "SlowMode", "slowMode", "Slow-Mode"],
  permLevel: 2
};

exports.help = {
  name: "slowmode",
  description: "Sohbete yazma sınır (süre) ekler.",
  usage: "slowmode [1/10]"
};
