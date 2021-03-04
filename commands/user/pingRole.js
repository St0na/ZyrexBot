const Discord = require("discord.js");
const fs = require("fs");

exports.run = (client, msg, args) => {
  //Ping Role İd's
  let newsping = "78373446558639718";
  let giveawayping = "784033665276444682";
  let staffping = "785140565544140810";
  let partnerping = "794080283007647764";
  //HATA EMBEDİ
  let hata = new Discord.MessageEmbed()
    .setColor("FFFF00")
    .setTitle("operation failed ❌")
    .setDescription("it looks like you already have this role")
    .addField("if you want to remove the role use the ```!pingD``` command")
    .setFooter("TeamZyrex");
  //HATA EMBEDİ

  //SUCCES EMBEDLERİ
  //giveaway
  const giveawayembed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Success!")
    .setDescription("You have been given a giveaway ping role")
    .addField("if you want to remove the role use the ```!pingD``` command")
    .setFooter("#TeamZyrex");

  //news
  const newsembed = new Discord.MessageEmned()
    .setColor("#00ff00")
    .setTitle("Success!")
    .setDescription("You have been given a news ping role")
    .addField(
      "if you want to remove the role you can use the command ```!pingD```"
    )
    .setFooter("#TeamZyrex");

  // staff

  const staffembed = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle("Success!")
    .setDescription("You have been given a staff ping role")
    .addField("if you want to remove the role use the ```!pingD``` command")
    .setFooter("#TeamZyrex");

  //partner

  const partnerembed = new Discord.MessageEmned()
    .setColor("#00ff00")
    .setTitle("Success!")
    .setDescription("You have been given a partner ping role")
    .addField("if you want to remove the role use the ```!pingD``` command")
    .setFooter("#TeamZyrex");

  let mesaj = args.slice(0).join(" ");
  if (mesaj.toLowerCase() === "news") {
    msg.member.roles.add(newsping);
    msg.channel.sendEmbed(newsembed);
  } else {
    if (mesaj.toLowerCase() === "giveaway") {
      msg.member.roles.add(giveawayping);
      msg.channel.send(giveawayembed);
    } else {
      if (mesaj.toLowerCase() === "partner") {
        msg.member.roles.add(partnerping);

        msg.channel.send(partnerembed);
      } else {
        if (mesaj.toLowerCase() === "giveaway") {
          msg.member.roles.add(staffping);
          msg.channel.send(staffembed);
        } else {
          msg.reply(
            "something went wrong ⁉️ (You made an incomplete or incorrect spelling)"
          );
        }
      }
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "ping",
  description: "Ping rolü verir",
  usage: "ping"
};
// By AloneDark
//Programmed By AloneDark
//Copyright 2021 ZyrexStudio
