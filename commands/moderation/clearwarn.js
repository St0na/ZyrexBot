const Discord = require("discord.js");
const data = require("wio.db");

exports.run = async (client, message, args) => {
  let user =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]) ||
    message.guild.members.cache.find(user =>
      user.user.username.toLowerCase().includes(args[0].toLowerCase())
    );
  if (!user)
    return message.channel.send(`"${args[0]}" not found on this server`);

  const sayı = await data.fetch(`sayı.${message.guild.id}.${user.id}`);
  if (!sayı) return message.channel.send(`This member has no warning.`);

  const bilgi = await data.fetch(`info.${message.guild.id}.${user.id}`);

  message.channel.send(
    `**${user.tag}**  member of ${sayı}  warning has been deleted.`
  );
  await data.delete(`Number.${message.guild.id}.${user.id}`);
  await data.delete(`İnfo.${message.guild.id}.${user.id}`);
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "clearwarn"
};
