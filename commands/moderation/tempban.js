const Discord = require("discord.js");
const db = require("lowdb");
const moment = require("moment");
require("moment-duration-format");
const ms = require("parse-ms");

module.exports.run = async (client, message, args) => {
  const embed31 = new Discord.MessageEmbed()
   .setColor("RED")
   .setTitle("Error!❌")
   .setDescription("You Do not have permission")
   .setFooter("#TeamZyrex")
  
  if (message.member.hasPermission("BAN_MEMBERS"))
  return message.channel.send(embed31)
  let member;
  let member1 = message.mentions.members.first();
  let member2 = message.guild.members.cache.get(args[0]);
  if (member1) {
    member = member1;
  }
  if (member2) {
    member = member2;
  }
  if (!member) {
    return message.reply("Please A Member Mentions or Member Id!!");
  }

  let cst2 = args[1];
  if (!cst2) return message.reply("A Time ❌ `!tempban @AloneDark 10m Spam`");

  let sebep = args[2];
  if (!sebep) return message.reply("A Reason ❌ `!jail @AloneDark 10m Spam`");

  let x = cst2;
  let ise = x
    .split(" ")
    .filter(val => val.match(/\d+/))
    .map(x =>
      x
        .split("")
        .filter(val => val.match(/\d+/))
        .join("")
    );

  let sures;
  let cst1 = ise[0];
  if (cst2.includes("s")) sures = cst1 * 1000;
  if (cst2.includes("m")) sures = cst1 * 60 * 1000;
  if (cst2.includes("h")) sures = cst1 * 60 * 60 * 1000;
  if (cst2.includes("d")) sures = cst1 * 24 * 60 * 60 * 1000;

  let zaman = Date.now();

  let sure;
  let data = ms(sures);
  let s = data.seconds;
  let m = data.minutes;
  let h = data.hours;
  let d = data.days;
  if (s) {
    sure = `${s} Seconds`;
  }
  if (m) {
    sure = `${m} Minutes`;
  }
  if (h) {
    sure = `${h} Hours`;
  }
  if (d) {
    sure = `${d} Days`;
  }

  db.set("cstban." + member.id, {
    member: member.id,
    staff: message.author.id,
    guild: message.guild.id,
    reason: sebep,
    time: sures,
    date: zaman
  });
  message.guild.members.ban(member.id, {
    reason: `${sebep}\nStaff: ${message.author.tag}`
  });
  message.channel.send(
    new Discord.MessageEmbed()
      .setTitle(member.user.tag + " Banned!")
      .setThumbnail(message.guild.iconURL())
      .setColor("GREEN")
      .addField("Banned Member", `\`${member.user.tag}\``)
      .addField("Staff", message.author)
      .addField("Reason", `\`${sebep}\``)
      .addField("Time", `\`${sure}\``)
      .setTimestamp()
      .setFooter("#TeamZyrex")
  );
};
module.exports.conf = {
  aliases: []
};

module.exports.help = {
  name: "tempban"
};
