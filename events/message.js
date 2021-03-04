const ayarlar = require("../Config.json");
const db = require("wio.db");
const Discord = require("discord.js");
const BeklemeSüre = new Set();
module.exports = async message => {
  const client = message.client;
  const prefix =
    (await db.fetch(`prefix_${message.guild.id}`)) || ayarlar.prefix;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (BeklemeSüre.has(message.author.id)) {
    return message.channel
      .send(
        new Discord.MessageEmbed()
          .setDescription(`Please try again in 5 seconds`)
          .setFooter(`${message.guild.name} Server`)
          .setColor("RANDOM")
          .setTimestamp()
      )
      .then(message.delete({ timeout: 1000, reason: "Temiz Görünüm" }))
      .catch(e => console.log(e));
  }
  BeklemeSüre.add(message.author.id);
  setTimeout(() => {
    BeklemeSüre.delete(message.author.id);
  }, 5000);
  let command = message.content.split(" ")[0].slice(prefix.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.elevation(message);
  let cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (!client.commands.has(command)) {
    if (client.aliases.has(command)) {
    } else {
    }
  }
  if (cmd)
    if (cmd) {
      if (perms < cmd.conf.permLevel) return;

      // Blacklist system
      if (db.fetch(`cokaradalistere_${message.author.id}`))
        return message.channel.send(
          "Sorry you are on the blacklist of the bot, if you want to use the bot again reach AloneDark"
        );
      // Blacklist system
      cmd.run(client, message, params, perms);
    }
  if (!client.commands.has(command)) {
    if (client.aliases.has(command)) {
      return false;
    } else {
      message.channel
        .send(
          new Discord.MessageEmbed()
            .setTitle(`command not found`)
            .setDescription(
              `my commands are I couldn't find a command named ${command}`
            )
            .setFooter(`TeamZyrex`)
            .setColor("RANDOM")
            .setTimestamp()
        )
        .then(msg =>
          msg.delete({ timeout: 3000, reason: "Temiz Bir Görünüm" })
        );
    }
  }
};
