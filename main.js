const express = require("express");
const app = express();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const db = require("wio.db");
const ms = require("ms");
const moment = require("moment");
const ayarlar = require("./Config.json");
require("./events/eventloader")(client);

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    fs.readdir(`./commands/${f}/`, (err, filess) => {
      if (err) console.error(err);
      log(`${f} Klasöründen ${filess.length} Komut Yüklenecek;`);
      filess.forEach(fs => {
        let props = require(`./commands/${f}/${fs}`);
        log(`${props.help.name} // Yüklendi`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name);
        });
      });
    });
  });
});

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.on("messageUpdate", async (oldMsg, newMsg) => {
  let prefix = (await db.fetch(`prefix_${newMsg.guild.id}`)) || ayarlar.prefix;
  if (newMsg.author.bot) return;
  if (!newMsg.content.startsWith(prefix)) return;
  let command = newMsg.content.split(" ")[0].slice(prefix.length);
  let params = newMsg.content.split(" ").slice(1);
  let perms = client.elevation(newMsg);
  let cmd;
  if (client.commands.has(command)) cmd = client.commands.get(command);
  else if (client.aliases.has(command))
    cmd = client.commands.get(client.aliases.get(command));
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, newMsg, params, perms);
  }
});

client
  .login(ayarlar.token)
  .catch(e => console.log(`[${e}]\nTokenini Kontrol Et!!`));

//-----------------------------------------------------------------------------------
//OLD BOOSTER ROLE
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  if (oldMember.roles.has("727942969847578735")) {
    if (!newMember.roles.has("727942969847578735")) {
      client.channels
        .get("782934674737463306")
        .send(
          newMember.user + "  Boostunu Çekti üyeye old booster rolü verildi! "
        );
      newMember.addRole("767353294346518538");
    }
  }
});
//OLD BOOSTER ROLE
//---------------
//İNVİTE SYSTEM
const guildInvites = new Map();

client.on("ready", () => {
  client.guilds.cache.forEach(guild => {
    guild
      .fetchInvites()
      .then(invites => guildInvites.set(guild.id, invites))
      .catch(err => console.log(err));
  });
});
client.on("inviteCreate", async invite => {
  guildInvites.set(invite.guild.id, await invite.guild.fetchInvites());
});
client.on("guildMemberAdd", async member => {
  const cachedInvites = guildInvites.get(member.guild.id);
  const newInvites = await member.guild.fetchInvites();
  guildInvites.set(member.guild.id, newInvites);
  try {
    console.log("Davet Eklendi");
    const usedInvite = newInvites.find(
      inv => cachedInvites.get(inv.code).uses < inv.uses
    );
    const currentInvites = await db.get(`inv.${usedInvite.inviter.id}.total`);
    if (currentInvites) {
      db.set(`inv.${member.id}.inviter`, usedInvite.inviter.id);
      db.add(`${usedInvite.inviter.id}`, 1);
    } else {
      db.set(`inv.${usedInvite.inviter.id}.total`, 1);
      db.set(`inv.${member.id}.inviter`, usedInvite.inviter.id);
    }
  } catch (err) {
    console.log(err);
  }
});

client.on("guildMemberRemove", async member => {
  const inviter = await db.get(`inv.${member.id}.inviter`);
  const userinviter = await member.guild.members.fetch(`${inviter}`);
  const currentInvites = await db.get(`inv.${inviter}.total`);
  try {
    console.log("Davet Silindi");
    db.add(`inv.${inviter}.total`, -1);
    db.delete(`inv.${member.id}.inviter`);
  } catch (err) {
    console.log(err);
  }
});
//İNVİTE SYSTEM

//---------

//SİLİNECEK//-----------
const botadi = "ZyrexBot";
const prefix = ayarlar.prefix;

client.on("guildBanAdd", async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`);
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if (!modlogs) return;
  if (modlogs) {
    let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir kişi sunucudan yasaklandı")
      .setThumbnail(user.avatarURL() || user.defaultAvatarURL)
      .addField(`Yasaklanan kişi`, `\`\`\` ${user.tag} \`\`\` `)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp();
    modlogkanal.send(embed);
  }
});

client.on("guildBanRemove", async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`);
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if (!modlogs) return;
  if (modlogs) {
    let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir kişinin yasağı kaldırıldı")
      .setThumbnail(user.avatarURL() || user.defaultAvatarURL)
      .addField(`Yasağı kaldırılan kişi`, `\`\`\` ${user.tag} \`\`\` `)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp();
    modlogkanal.send(embed);
  }
});

client.on("channelCreate", async channel => {
  let modlogs = db.get(`modlogkanaly_${channel.guild.id}`);
  let entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id);
  const modlogkanal = channel.guild.channels.cache.find(
    kanal => kanal.id === modlogs
  );
  if (!modlogs) return;
  if (modlogs) {
    if (channel.type === "text") {
      let embed = new Discord.MessageEmbed()
        .setColor("#fffa00")
        .setAuthor("Bir Kanal Oluşturuldu")
        .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
        .addField(`Oluşturulan Kanalın Türü : `, `Yazı`)
        .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
        .setFooter(`${botadi} | Mod-Log Sistemi`)
        .setTimestamp();
      modlogkanal.send(embed);
    }
    if (channel.type === "voice") {
      let embed = new Discord.MessageEmbed()
        .setColor("#fffa00")
        .setAuthor("Bir Kanal Oluşturuldu")
        .addField(`Oluşturulan Kanalın İsmi : `, `${channel.name}`)
        .addField(`Oluşturulan Kanalın Türü : `, `Ses`)
        .addField(`Kanalı Oluşturan : `, `<@${user.id}>`)
        .setFooter(`${botadi} | Mod-Log Sistemi`)
        .setTimestamp();
      modlogkanal.send(embed);
    }
  }
});

client.on("channelDelete", async channel => {
  let entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id);
  let modlogs = db.get(`modlogkanaly_${channel.guild.id}`);
  const modlogkanal = channel.guild.channels.cache.find(
    kanal => kanal.id === modlogs
  );
  if (!modlogs) return;
  if (modlogs) {
    if (channel.type === "text") {
      let embed = new Discord.MessageEmbed()
        .setColor("#fffa00")
        .setAuthor("Bir Kanal Silindi")
        .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
        .addField(`Silinen Kanalın Türü : `, `Yazı`)
        .addField(`Kanalı Silen : `, `<@${user.id}>`)
        .setFooter(`${botadi} | Mod-Log Sistemi`)
        .setTimestamp();
      modlogkanal.send(embed);
    }
    if (channel.type === "voice") {
      let embed = new Discord.MessageEmbed()
        .setColor("#fffa00")
        .setAuthor("Bir Kanal Silindi")
        .addField(`Silinen Kanalın İsmi : `, `${channel.name}`)
        .addField(`Silinen Kanalın Türü : `, `Ses`)
        .addField(`Kanalı Silen : `, `<@${user.id}>`)
        .setFooter(`${botadi} | Mod-Log Sistemi`)
        .setTimestamp();
      modlogkanal.send(embed);
    }
  }
});

client.on("roleDelete", async role => {
  let modlogs = db.get(`modlogkanaly_${role.guild.id}`);
  let entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id);
  const modlogkanal = role.guild.channels.cache.find(
    kanal => kanal.id === modlogs
  );
  if (!modlogs) return;
  if (modlogs) {
    let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Rol Silindi")
      .addField(`Silinen Rolün İsmi : `, `${role.name}`)
      .addField(`Rolü Silen : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp();
    modlogkanal.send(embed);
  }
});

client.on("emojiDelete", async emoji => {
  let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`);
  let entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id);
  const modlogkanal = emoji.guild.channels.cache.find(
    kanal => kanal.id === modlogs
  );
  if (!modlogs) return;
  if (modlogs) {
    let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Emoji Silindi")
      .addField(`Silinen Emojinin İsmi : `, `${emoji.name}`)
      .addField(`Emojiyi Silen : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp();
    modlogkanal.send(embed);
  }
});

client.on("roleCreate", async role => {
  let modlogs = db.get(`modlogkanaly_${role.guild.id}`);
  let entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id);
  const modlogkanal = role.guild.channels.cache.find(
    kanal => kanal.id === modlogs
  );
  if (!modlogs) return;
  if (modlogs) {
    let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Rol Oluşturuldu")
      .addField(`Oluşturulan Rolün İsmi : `, `${role.name}`)
      .addField(`Rolü Oluşturan : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp();
    modlogkanal.send(embed);
  }
});

client.on("emojiCreate", async emoji => {
  let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`);
  let entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id);
  const modlogkanal = emoji.guild.channels.cache.find(
    kanal => kanal.id === modlogs
  );
  if (!modlogs) return;
  if (modlogs) {
    let embed = new Discord.MessageEmbed()
      .setColor("#fffa00")
      .setAuthor("Bir Emoji Oluşturuldu")
      .addField(`Oluşturulan Emojinin İsmi : `, `${emoji.name}`)
      .addField(`Emoji Silen : `, `<@${user.id}>`)
      .setFooter(`${botadi} | Mod-Log Sistemi`)
      .setTimestamp();
    modlogkanal.send(embed);
  }
});

//MESAJ LOG
client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type === "dm") return;
  if (newMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`modlogkanaly_${newMessage.guild.id}`);
  let scbul = newMessage.guild.channels.cache.get(sc);
  if (!scbul) {
  }
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL())
    .addField("Kullanıcı", newMessage.author)
    .addField("Eski Mesaj", "```" + oldMessage.content + "```")
    .addField("Yeni Mesaj", "```" + newMessage.content + "```")
    .addField("Kanal Adı", newMessage.channel.name)
    .addField("Mesaj ID", newMessage.id)
    .addField("Kullanıcı ID", newMessage.author.id)
    .setFooter(
      `Bilgilendirme  • bügün saat ${newMessage.createdAt.getHours() +
        3}:${newMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});

client.on("messageDelete", async deletedMessage => {
  if (deletedMessage.author.bot || deletedMessage.channel.type === "dm") return;
  if (deletedMessage.content.startsWith(prefix)) return;
  let sc = await db.fetch(`modlogkanaly_${deletedMessage.guild.id}`);
  let scbul = deletedMessage.guild.channels.cache.get(sc);
  if (!scbul) {
  }
  let embed = new Discord.MessageEmbed()
    .setColor("#fffa00")
    .setAuthor(`Mesaj Silindi`, deletedMessage.author.avatarURL())
    .addField("Kullanıcı", deletedMessage.author)
    .addField("Silinen Mesaj", "```" + deletedMessage.content + "```")
    .addField("Kanal Adı", deletedMessage.channel.name)
    .addField("Mesaj ID", deletedMessage.id)
    .addField("Kullanıcı ID", deletedMessage.author.id)
    .setFooter(
      `Bilgilendirme  • bügün saat ${deletedMessage.createdAt.getHours() +
        3}:${deletedMessage.createdAt.getMinutes()}`
    );
  scbul.send(embed);
});
//SİLİNECEK//-------

//----------------
//MUTE SYSTEM

//database
const qdb = require("wio.db");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const sunucuadapter = new FileSync("./database/systems.json");

const sdb = low(sunucuadapter);

sdb
  .defaults({
    mute: [],
    ban: [],
    kufurEngel: [],
    autorole: [],
    reklamEngel: [],
    security: [],
    counter: []
  })
  .write();

sdb.read();

//database updater
/*
client.on("message", async msg => {
  if(!msg.guild) return;
  
  db.add(`mesajsayi_${msg.author.id}`, 1);
});
*/
setInterval(function() {
  sdb.read();
}, 1000);

client.on("ready", async () => {
  client.guilds.cache.forEach(async guild => {
    guild.members.cache.forEach(async member => {
      sdb.read();
      var muteverisi = sdb
        .get("mute")
        .find({ guild: guild.id, user: member.id })
        .value();

      if (muteverisi) {
        var mutebitiszamani = muteverisi.finishtime;
        var mutekanali = muteverisi.channel;
      } else {
        var mutebitiszamani = null;
        var mutekanali = null;
      }
      const ainterval = setInterval(async function() {
        sdb.read();
        if (
          mutebitiszamani &&
          mutebitiszamani !== null &&
          mutebitiszamani !== "INFINITY"
        ) {
          if (mutebitiszamani <= Date.now()) {
            clearInterval(ainterval);
            var muterole1 = qdb.fetch(`muteroluid_${guild.id}`);
            var muterole2 = guild.roles.cache.find(r => r.id === muterole1);
            if (member.roles.cache.has(muterole2.id))
              await member.roles.remove(muterole2.id);
            var mutekanali2 = guild.channels.cache.find(
              c => c.id === mutekanali
            );
            if (mutekanali2) mutekanali2.send(`${member} Susturulması Açıldı!`);
            sdb
              .get("mute")
              .remove(
                sdb
                  .get("mute")
                  .find({ guild: guild.id, user: member.id })
                  .value()
              )
              .write();
          }
        }
      }, 6000);
    });
  });
});
//MUTE SYSTEM
//--------------------
//TİMEROLE
setInterval(async () => {
  var mem = [];
  client.guilds.cache.forEach(async guild => {
    guild.members.cache.forEach(async member => {
      let m = await db.fetch(`kullanıcı${guild.id}_${member.id}`);
      if (m) {
        let time = await db.fetch(`rolint${guild.id}_${member.id}`);
        if (!time) return;
        let sures = await db.fetch(`rolsure${guild.id}_${member.id}`);
        let timing = Date.now() - time;
        let rl = await db.fetch(`roliste_${guild.id}_${member.id}`);

        if (timing >= sures) {
          guild.members.cache.find(x => x.id === member.id).roles.remove(rl);
          let logdb = await db.fetch(`rollog${guild.id}`);
          let log = guild.channels.cache.get(logdb);
          log.send(
            new Discord.MessageEmbed().setDescription(
              `${member} kullanıcısının \`${moment
                .duration(sures)
                .format(
                  `DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`
                )}\` Süre Boyunca <@&${db.fetch(
                `roliste_${guild.id}_${member.id}`
              )}> Sahip Olduğu Rol Süresi Bittiği İçin Alındı!`
            )
          );
          db.delete(`kullanıcı${guild.id}_${member.id}`);
          db.delete(`rolsure${guild.id}_${member.id}`);
          db.delete(`rolint${guild.id}_${member.id}`);
        }
      }
    });
  });
}, 5000);
//TİMEROLE
//---------------------------
//TEMPBAN (TİME BAN)
client.on("ready", async () => {
  setInterval(() => {
    let csd = db.get("cstban");
    for (var i in csd) {
      let data = db.get(`cstban.${csd[i].member}`);
      if (data) {
        let csg = client.guilds.cache.get(data.guild);
        if (csg) {
          let date = Date.now() - data.date;
          let time = data.time;
          if (date >= time) {
            csg.members.unban(data.member, { reason: "Ban Time Finish" });
            db.delete(`cstban.${data.member}`);
          }
        }
      }
    }
  }, 5000);
});
//TEMPBAN (TİME BAN)
//---------------------
//ANTİ ADS
client.on("message", async message => {
  if (message.author.bot) return;
  const database = require("wio.db");
  const system = await database.fetch(message.guild.id);
  if (system == true) {
    let invites = [];
    let kelimeler = message.content.split(" ");

    for (const d in kelimeler) {
      if (!kelimeler[d].includes(".gg/")) return;
      let invite = await client.fetchInvite(kelimeler[d]).catch(err => {
        if (err.toString().code == 10006) return;
      });

      if (invite) invites.push(invite);
    }

    let logChannelID = ayarlar.adslog;
    let logChannelFetch = message.guild.channels.cache.get(logChannelID);

    if (logChannelFetch) {
      /*if(message.member.hasPermission('ADMINISTRATOR')) return;*/
      message.delete();

      invites.forEach(invite => {
        logChannelFetch.send(
          new Discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setTitle("Discord link posted in " + message.channel.name)
            .setDescription(
              `**${message.author.tag}** posted the invite link \`${invite.code}\` that links to the server **${invite.guild.name}**`
            )
            .setFooter(message.author.id)
            .setTimestamp()
        );
      });
    }
  } else return;
});
//ANTİ ADS
//------------------------
//AUTOROLE
client.on("guildMemberAdd", async member => {
  let csdb = require("croxydb");
  let data = db.get("csotorol." + member.guild.id);

  if (data) {
    let rol = member.guild.roles.cache.get(data);
    if (rol) {
      if (!member.user.bot) {
        await member.roles.add(rol);
      }
    }
  }
});
//AUTOROLE
//--------------------
