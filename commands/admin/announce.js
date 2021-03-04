const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTATOR"))
    return message.reply("**You do not have permission**");

  let csc = message.mentions.channels.first();
  if (!csc) return message.reply("**Please tag a channel**");
  let csm = args.slice(1).join(" ");
  if (!csm) return message.reply("**Please write the Announcement**");

  let cse = new Discord.MessageEmbed()
    .setTitle("New Announcement")
    .setThumbnail(message.guild.iconURL())
    .setColor("BLUE")
    .setDescription(`${csm}`)
    .setTimestamp()
    .setFooter("#teamzyrex");
  csc.send(cse);
  setTimeout(() => {
    csc.send("@everyone").then(csmm => {
      csmm.delete({ timeout: 200 });
    });
  }, 2000);
};
module.exports.conf = {
  aliases: ["Announce", "Announcement"]
};

module.exports.help = {
  name: "announce"
};













