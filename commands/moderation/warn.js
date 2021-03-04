const Discord = require("discord.js");
const ms = require("ms");
const data = require("wio.db");
const moment = require("moment");
moment.locale("tr");

exports.run = async (client, message, args) => {
  if (!args[0])
    return message.channel.send(`\`\`\`!warn [reason]
         ----------
Bir kişi belirtmen gerekiyor.\`\`\``);

  let user =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]) ||
    message.guild.members.cache.find(user =>
      user.user.username.toLowerCase().includes(args[0].toLowerCase())
    );
  if (!user)
    return message.channel.send(`"${args[0]}" not found on this server.`);

  if (
    message.guild.members.cache.get(user.id).roles.highest.position >
    message.guild.members.cache.get(message.author.id).roles.highest.position
  )
    return message.channel.send(
      "You are not high enough to do this in role hierarchy"
    );
  if (
    message.guild.members.cache.get(user.id).roles.highest.position ==
    message.guild.members.cache.get(message.author.id).roles.highest.position
  )
    return message.channel.send(
      "You are not high enough to do this in role hierarchy."
    );

  let reason;
  if (!args[1]) {
    reason = "";
  } else {
    reason = ` Sebep: ${args[1]}`;
  }

  await data.add(`sayı.${message.guild.id}.${user.id}`, 1);
  if (typeof (await data.fetch(`case.${message.guild.id}`)) != "number")
    await data.set(`case.${message.guild.id}`, 0);
  await data.add(`case.${message.guild.id}`, 1);

  const l = await data.fetch(`sayı.${message.guild.id}.${user.id}`);

  if (l === 3) {
    let role = message.guild.roles.cache.find(role => role.name === "Muted");
    if (!role)
      message.guild.roles.create({ data: { name: "Muted" } }).then(rol => {
        role = rol;
      });
    message.guild.member(user).roles.add(role);
    setTimeout(() => {
      message.guild.member(user).roles.remove(role);
    }, 1 * 1000 * 60 * 60); //deneyelim
  }

  const casee = await data.fetch(`case.${message.guild.id}`);
  var tarih = new Date(Date.now());
  console.log(tarih);
  if (!data.get(`bilgi.${message.guild.id}.${user.id}`) instanceof Array)
    data.set(`bilgi.${message.guild.id}.${user.id}`, []); //push yaptığımızdan dolayı array olduğundan emin olmalıyız

  data.push(`bilgi.${message.guild.id}.${user.id}`, {
    moderator: message.author.tag,
    case: "#" + casee.toString() ? "#" + casee.toString() : "#0",
    tarih: moment().format("DD-MM-YYYY"),
    reason: reason ? reason : "Sebep: N/A"
  });
  user.send(
    `${message.guild.name} sunucusunda uyarıldınız. Sebep: ${
      reason.replace("Sebep: ", "") ? reason.replace("Sebep: ", "") : "N/A"
    } Moderatör: ${message.author.tag} (id: ${message.author.id})`
  );
  message.channel.send(
    `**${user.tag ? user.tag : user.user.tag}** uyarıldı, bu onun ${
      l ? l : "0"
    }. uyarısı.${reason ? reason : ""}`
  );
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "warn"
};
