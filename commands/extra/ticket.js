const Discord = require("discord.js");
const ayarlar = require("../../Config.json");
const db = require("wio.db");

exports.run = async (client, message, args) => {
  let prefix = ayarlar.prefix;

  if (!message.member.hasPermission("ADMINISTATOR"))
    return message.channel.send(`Buna yetkin yok!`);
  if (!args[0])
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(`${client.user.username} Destek Sistemi`)
        .setDescription`**Eksik Veya Hatalı Komut Kullanımı: Doğru Kullanım;**\n\`a!destek kanal #kanal\na!destek rol @rol\na!destek kapat\`
`.setFooter(
        `Komutu Kullanan: ${message.author.tag}`,
        `${message.author.avatarURL()}`
      )
    );

  if (args[0] == "close") {
    db.delete(`destekkanal${message.guild.id}`);
    db.delete(`destekrole${message.guild.id}`);
    message.channel.send(`**Destek Sistemi Başarıyla Kapatıldı!**`);
    return;
  }

  if (args[0] == "role") {
    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.find(ff => ff.name === args.slice(1).join(" "));
    db.set(`destekrole${message.guild.id}`, role.id);
    message.channel.send(
      `**Destek Sistemi Yetkili Rolü Ayarlandı!\nAyarlanan Rol:** \`${role.name}\``
    );
    return;
  }
  if (args[0] == "channel") {
    let akanal =
      message.mentions.channels.first() ||
      message.guild.channels.cache.find(
        ff => ff.name === args.slice(1).join(" ")
      );
    db.set(`destekkanal${message.guild.id}`, akanal.id);
    message.channel.send(
      `**Destek Sistemi Kanalı Ayarlandı!\n Ayarlanan Kanal: \`${akanal.name}\`**`
    );
  }
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: "ticket",
  description: "Destek Sistemini Açmayı Sağlar!",
  usage: `destek`
};
