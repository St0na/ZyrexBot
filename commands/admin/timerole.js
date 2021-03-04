const Discord = require("discord.js");
const db = require("wio.db");
const ayarlar = require("../../Config.json");
exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES"))
    return message.channel.send(" Yetkin bulunmuyor.");
  const ms = require("ms");
  const moment = require("moment");
  require("moment-duration-format");
  let rol = message.mentions.roles.first();
  let channel = message.mentions.channels.first();
  if (args[0] == "log") {
    db.set(`rollog${message.guild.id}`, channel.id);
    return message.channel.send(`log kanalı ${channel} olarak ayarlandı!`);
  }
  let duration = args[1];
  let sure = args[2];
  let typ;
  if (sure == "saniye") typ = "seconds";
  if (sure == "dakika") typ = "minutes";
  if (sure == "saat") typ = "hours";
  if (sure == "gün") typ = "days";
  let user = message.mentions.users.first();
  if (!user) return message.reply("Kime Süreli Rol Vericeksin?");
  if (isNaN(duration)) return message.reply("Süreyi Belirt!");
  if (!typ) return message.reply("Süreyi Belirt!");
  if (!rol) return message.reply("Rolü Belirt!");

  message.channel.send(
    `${user} adlı kullanıcıya \`${moment
      .duration(ms(`${duration} ${typ}`))
      .format(
        `DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`
      )}\` boyunca belirttiğiniz rol verildi!`
  );
  db.set(`rolint${message.guild.id}_${user.id}`, Date.now());
  db.set(`rolsure${message.guild.id}_${user.id}`, ms(`${duration} ${typ}`));
  db.set(`kullanıcı${message.guild.id}_${user.id}`, user.id);
  db.set(`roliste_${message.guild.id}_${user.id}`, rol.id);
  message.guild.member(user).roles.add(rol.id);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["sr"],
  permLevel: 0
};

exports.help = {
  name: "timerole"
};
