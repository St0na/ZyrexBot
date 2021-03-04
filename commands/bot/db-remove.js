const Discord = require("discord.js");
const db = require("wio.db");
const ayarlar = require("../../Config.json")

exports.run = async (client, message, args) => {
  if (message.author.id !== "631189057862631496")
    return message.reply("You Do not have permission!");
  db.all()
    .map(data => data.ID)
    .forEach(key => {
      db.delete(key);
    });

  message.channel.send("**Bottaki Tüm Veriler Sıfırlandı !**");
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["dbsıfırla"],
  permLevel: 4
};

exports.help = {
  name: "dbreset",
  description: "Db data reset command",
  usage: "dbreset"
};
