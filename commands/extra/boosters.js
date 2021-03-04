const Discord = require("discord.js");
module.exports.run = async (client, message) => {
  if (message.guild.id === "725694618548568164") {
    const dcsb = message.guild.roles.cache.get("727942969847578735");

    const dcsu = dcsb.members.map(dcsus => dcsus.displayName).join("\n");

    const dcsuc = dcsb.members.size;
    const dcse = new Discord.MessageEmbed()
      .setTitle(message.guild.name + " Boost Info")
      .setColor(dcsb.hexColor)
      .setTimestamp()
      .addField("Server Boost Level", "```" + message.guild.premiumTier + "```")
      .addField(
        "Boost Count",
        "```" + message.guild.premiumSubscriptionCount + "```"
      )
      .addField("Booster Count", "```" + dcsuc + "```")
      .addField("Booster Names", "```" + dcsu + "```");
    message.channel.send(dcse);
  }
};
module.exports.conf = {
  aliases: ["boost"]
};
module.exports.help = {
  name: "boosts"
};
