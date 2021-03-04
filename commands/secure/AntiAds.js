const Discord = require("discord.js");
const database = require("wio.db");

exports.run = async (client, message, chimp) => {
  
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.reply("Yeterli yetkin yok.");

  if (!chimp[0])
    return message.reply("You dialed incompletely or incorrectly.");
  let args = ["aç", "kapat"];
  if (!args.includes(chimp[0]))
    return message.reply(
      `❌ you specified an invalid argument.\n arguments you can use: **${args.join(
        "**, **"
      )}**`
    );

  if (chimp[0] === "aç") {
    const system = await database.fetch(message.guild.id);
    if (system && system == true)
      return message.reply(" ad protection is already on");
    database.set(message.guild.id, true);
    message.reply(" advertising protection activated");
  } else if (chimp[0] === "kapat") {
    const system = await database.fetch(message.guild.id);
    if (system && system == false)
      return message.reply(" ad protection is already turned off");
    database.set(message.guild.id, false);
    message.reply("advertising protection is turned off");
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["antiads"],
  permLevel: 0
};

exports.help = {
  name: "antiads"
};
