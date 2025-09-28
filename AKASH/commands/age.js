module.exports = {
  config: {
    name: "age",
    version: "3.0",
    author: "𝐌𝐨𝐡𝐚𝐦𝐦𝐚𝐝 𝐀𝐤𝐚𝐬𝐡",
    hasPermission: 0,
    commandCategory: "utility",
    cooldowns: 5,
    description: "𝐂𝐚𝐥𝐜𝐮𝐥𝐚𝐭𝐞 𝐚𝐠𝐞 𝐟𝐫𝐨𝐦 𝐛𝐢𝐫𝐭𝐡 𝐝𝐚𝐭𝐞",
    usage: "[DD/MM/YYYY]",
    dependencies: {
      "moment-timezone": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const axios = require("axios");

    try {
      if (!args[0]) {
        return api.sendMessage("⚠️ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐲𝐨𝐮𝐫 𝐛𝐢𝐫𝐭𝐡 𝐝𝐚𝐭𝐞 𝐢𝐧 𝐃𝐃/𝐌𝐌/𝐘𝐘𝐘𝐘 𝐟𝐨𝐫𝐦𝐚𝐭\n𝐄𝐱𝐚𝐦𝐩𝐥𝐞: 𝐚𝐠𝐞 𝟎𝟏/𝟎𝟏/𝟐𝟎𝟎𝟗", event.threadID);
      }

      const input = args[0];
      const dateParts = input.split('/');
      
      if (dateParts.length !== 3) {
        return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐝𝐚𝐭𝐞 𝐟𝐨𝐫𝐦𝐚𝐭. 𝐔𝐬𝐞 𝐃𝐃/𝐌𝐌/𝐘𝐘𝐘𝐘", event.threadID);
      }

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const year = parseInt(dateParts[2]);

      if (isNaN(day) || day < 1 || day > 31) {
        return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐝𝐚𝐲 (𝟏-𝟑𝟏)", event.threadID);
      }
      if (isNaN(month) || month < 1 || month > 12) {
        return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐦𝐨𝐧𝐭𝐡 (𝟏-𝟏𝟐)", event.threadID);
      }
      if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
        return api.sendMessage("❌ 𝐈𝐧𝐯𝐚𝐥𝐢𝐝 𝐲𝐞𝐚𝐫", event.threadID);
      }

      const birthDate = moment.tz(`${year}-${month}-${day}`, "YYYY-MM-DD", "Asia/Dhaka");
      const now = moment.tz("Asia/Dhaka");
      
      if (birthDate.isAfter(now)) {
        return api.sendMessage("❌ 𝐘𝐨𝐮 𝐜𝐚𝐧'𝐭 𝐛𝐞 𝐛𝐨𝐫𝐧 𝐢𝐧 𝐭𝐡𝐞 𝐟𝐮𝐭𝐮𝐫𝐞!", event.threadID);
      }

      const duration = moment.duration(now.diff(birthDate));
      const years = duration.years();
      const months = duration.months();
      const days = duration.days();
      const totalMonths = years * 12 + months;
      const totalDays = Math.floor(duration.asDays());
      const totalHours = Math.floor(duration.asHours());

      const avatarPath = `${__dirname}/cache/${event.senderID}.jpg`;
      const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const response = await axios.get(avatarUrl, { responseType: 'stream' });
      const writer = fs.createWriteStream(avatarPath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const message = {
        body: `╔════════════════╗
     🎂 𝐀𝐆𝐄 𝐂𝐀𝐋𝐂𝐔𝐋𝐀𝐓𝐎𝐑 🎂
╚════════════════╝

📅 𝐃𝐚𝐭𝐞 𝐨𝐟 𝐁𝐢𝐫𝐭𝐡: ${day}/${month}/${year}
🕒 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐀𝐠𝐞: ${years} 𝐘𝐞𝐚𝐫𝐬 ${months} 𝐌𝐨𝐧𝐭𝐡𝐬 ${days} 𝐃𝐚𝐲𝐬

══════════════════
📌 𝐃𝐞𝐭𝐚𝐢𝐥𝐬:
➥ ${totalMonths} 𝐌𝐨𝐧𝐭𝐡𝐬
➥ ${totalDays} 𝐃𝐚𝐲𝐬
➥ ${totalHours} 𝐇𝐨𝐮𝐫𝐬
══════════════════

👑 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: 𝐌𝐨𝐡𝐚𝐦𝐦𝐚𝐝 𝐀𝐤𝐚𝐬𝐡`,
        attachment: fs.createReadStream(avatarPath)
      };

      await api.sendMessage(message, event.threadID);
      fs.unlinkSync(avatarPath);

    } catch (error) {
      console.error("Error in age command:", error);
      api.sendMessage("❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐩𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐫𝐞𝐪𝐮𝐞𝐬𝐭", event.threadID);
    }
  }
};
