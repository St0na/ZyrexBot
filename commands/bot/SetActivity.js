const Discord = require("discord.js");
exports.run = function(client, message, args) {
  if (message.author.id !== "631189057862631496")
    return message.reply("Yetkinin olması gerek! ");
  const sayMessage = args.join(` `);
  client.user.setActivity(sayMessage);
  message.channel.send(
    `Oyun ismi **${sayMessage}** olarak değiştirildi :ok_hand:`
  );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "setactivity",
  description: "Botun oynuyor değiştirir.",
  usage: "setactivity"
};
