const Discord = require("discord.js");
let db = require("croxydb");
module.exports.run = async (client, message, args) => {
  const embed1 = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("Error❌")
    .setDescription(" You dialed incompletely or incorrectly")
    .addField("Set Command;", "!autorole set @role")
    .addField("Reset Command;", "!autorole reset")
    .setFooter("ZyrexBot");

  if (!message.member.hasPermission("MANAGE_ROLES"))
    return message.reply("You do not have permission!");
  if (!args[0]) return message.channel.send(embed1);
  if (args[0] === "reset") {
    await db.delete("csotorol." + message.guild.id);
    message.reply("Sistem Başarı İle Sıfırlandı!");
  }
  if (args[0] === "set") {
    let csr = message.mentions.roles.first();
    if (!csr) return message.reply("Bir Rol Etiketlemen Gerek!");
    await db.set("csotorol." + message.guild.id, csr.id);
    let cse = new Discord.MessageEmbed()
      .setTitle("Otorol Sistemi")
      .setThumbnail(message.guild.iconURL())
      .setColor("BLUE")
      .setDescription(`${csr} İsimli Rol Üye Oto Rolü Olarak Ayarlandı!`)
      .setTimestamp()
      .setFooter("ZyrexBot");
    message.channel.send(cse);
  }
};
module.exports.conf = {
  aliases: []
};

module.exports.help = {
  name: "autorole"
};
