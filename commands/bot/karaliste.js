const Discord = require('discord.js')
const db = require('wio.db'); //kendi databasene göre değiştir ben local json database kullandım

exports.run = async(client, message, args) => {  
let id = "ID" //permli kişinin id si
let user = message.mentions.users.first() || client.users.cache.get(args.slice(1).join(' '))
if (message.author.id !== id) return message.channel.send("yeterli yetkin yok cnm")
if(!args[0]) return message.channel.send("**Hata:** eksik argüman\n**Args:** `active`,`unactive`,`info`")
switch(args[0]){
  case "active":
    if (!user) return message.channel.send("❌ | ID yaz veya etiketle")
    if(user.id == id) return message.channel.send("hata")
    
    db.set(`darklist_${user.id}`, true)
    message.channel.send(`\`${user.tag}\` karaliste aktif edildi`)
    break;
  case "unactive":
    if (!user) return message.channel.send("❌ | ID yaz veya etiketle")
    if(user.id == id) return message.channel.send("hata")
    db.delete(`darklist_${user.id}`)
    message.channel.send(`\`${user.tag}\` karaliste deaktif edildi`)
    break;
  case "info":
    if (!user) return message.channel.send("❌ | ID yaz veya etiketle")
let i = db.fetch(`darklist_${user.id}`)
      if(i == true) message.channel.send(`\`${user.tag}\` **Karaliste:** active`)
      else message.channel.send(`\`${user.tag}\` **Karaliste:** unactive`)
    
    break;
}
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["darklist"],
  permLevel: 0,
  kategori: "geliştirici"
};

exports.help = { 
	name: 'blacklist', 
	description: 'Belirlenen kişinin botu kullanmasını engeller.', 
  usage: 'blacklist  '
};
