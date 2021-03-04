const Discord = require("discord.js");
const ayarlar = require("../../Config.json");

exports.run = async (client, message, args) => {
  if (message.author.id !== ayarlar.sahip) return;

  if (args[0] === "rahatsız") {
    client.user.setStatus("dnd");
    message.channel.send("Durumum artık **Rahatsız Etmeyin**.");
  }
  if (args[0] === "boşta") {
    client.user.setStatus("idle");
    message.channel.send("Durumum artık **Boşta**.");
  }
  if (args[0] === "çevrimiçi") {
    client.user.setStatus("online");
    message.channel.send("Durumum artık **Çevrimiçi**.");
  }
  if (args[0] === "çevrimdışı") {
    let a = await message.channel.send("Closing Bot...");
    setTimeout(() => {
      a.edit("You fell right away too, of course, I do not close the boat: D");
    }, 2000);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["SetStatus", "Setstatus", "setStatus"],
  permLevel: 0
};

exports.help = {
  name: "setstatus",
  description: "Set Status",
  usage: "setstatus"
};
