const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  if (!message.member.voice.channel)
    return message.channel.send("first you need to connect to a voice channel");
  const kisi = message.mentions.members.first();
  if (!kisi)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle("You have misspelled or misspelled")
        .setDescription("You should label the person you want to go with")
        .setFooter("#TeamZyrex")
    );
  const filter = (reaction, user) => {
    return ["✔️", "❌"].includes(reaction.emoji.name) && user.id === kisi.id;
  };
  if (kisi.user.bot)
    return message.channel.send(
      `because the person you specified is a bot, you cannot go near him`
    );
  if (message.member.voice.channel.id === kisi.voice.channel.id)
    return message.channel.send(
      ` you are already on the same channel as the person you specified`
    );
  if (!kisi.voice.channel)
    return message.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Error!")
        .setDescription(
          "the person you specified is not connected to the audio channel"
        )
        .setColor("RED")
        .setFooter("#TeamZyrex")
    );

  message.channel
    .send(
      `**<@${kisi.id}>, <@${message.author.id}> He wants to come to you, do you approve?`
    )
    .then(m =>
      m
        .react("✔️")
        .then(a => m.react("❌"))
        .then(s =>
          m
            .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            .then(collected => {
              const reaction = collected.first();

              if (reaction.emoji.name === "✔️") {
                const embed2 = new Discord.MessageEmbed()
                  .setColor("GREEN")
                  .setTitle("Success")
                  .setDescription(
                    `<@${message.author.id}> You moved to the person you mentioned`
                  )
                  .setFooter("#TeamZyrex");
                message.channel.send(embed2);
                message.member.voice.setChannel(kisi.voice.channel.id);
              } else {
                const embed3 = new Discord.MessageEmbed()
                  .setColor("RED")
                  .setTitle("Error!")
                  .setDescription(
                    `<@${message.author.id}> the person you mentioned does not want you to come near`
                  )
                  .setFooter("#TeamZyrex");
                message.channel.send(embed3);
              }
            })
        )
    );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "moveme"
};
