const chalk = require("chalk");
const moment = require("moment");
const Discord = require("discord.js");

module.exports = async client => {
  await client.user.setActivity(``, { type: "WATCHING" }).catch(console.error);

  await console.log(
    `[${client.user.tag}]: Giriş Yaptım ve Komutlarım Yüklendi.`
  );
};
