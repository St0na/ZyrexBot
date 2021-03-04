const Discord = require("discord.js");
module.exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("MANAGE_ROLES"))
    return message.reply(
      "**You Are Not Authorized To Use This Command! = > (Manage Roles)**"
    );

  const csp = "!";
  const csr =
    message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
  if (!csr)
    return message.reply(
      "Please tag the role you want to change the color for, or type role id!\nExample: " +
        csp +
        "setcolor @Members ff00ff"
    );
  const csc = args[1];
  if (csc.length > 6 || csc.length < 6)
    return message.reply("**please just type a 6-digit color code!**");
  if (!csc)
    return message.reply(
      "please enter a color code\nExample: " + csp + "setcolor @Members ff00ff"
    );

  csr.setColor(csc);
  message.channel.send(
    "I have successfully changed the color of the specified role!"
  );
};
module.exports.conf = {
  aliases: []
};

module.exports.help = {
  name: "setcolor"
};
