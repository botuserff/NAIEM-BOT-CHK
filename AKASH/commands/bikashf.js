const axios = require("axios");

module.exports.config = {
  name: "bkashf",
  version: "1.0",
  hasPermssion: 0,
  credits: "𝐌𝐨𝐡𝐚𝐦𝐦𝐚𝐝 𝐀𝐤𝐚𝐬𝐡",
  description: "𝐂𝐫𝐞𝐚𝐭𝐞 𝐚 𝐟𝐚𝐤𝐞 𝐁𝐤𝐚𝐬𝐡 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭",
  usePrefix: true,
  prefix: true,
  commandCategory: "Fun",
  usages: "<number> - <transaction ID> - <amount>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ");
  if (!input.includes("-")) {
    return api.sendMessage(
      `❌ 𝐖𝐫𝐨𝐧𝐠 𝐟𝐨𝐫𝐦𝐚𝐭!\n𝐔𝐬𝐞: ${global.config.PREFIX}bkashf 017xxxxxxxx - TXN12345 - 1000`,
      event.threadID,
      event.messageID
    );
  }

  const [numberRaw, transactionRaw, amountRaw] = input.split("-");
  const number = numberRaw.trim();
  const transaction = transactionRaw.trim();
  const amount = amountRaw.trim();

  const url = `https://masterapi.site/api/bkashf.php?number=${encodeURIComponent(
    number
  )}&transaction=${encodeURIComponent(transaction)}&amount=${encodeURIComponent(amount)}`;

  api.sendMessage(
    `📤 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐟𝐚𝐤𝐞 𝐁𝐤𝐚𝐬𝐡 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭 🕐`,
    event.threadID,
    (err, info) =>
      setTimeout(() => {
        api.unsendMessage(info.messageID);
      }, 4000)
  );

  try {
    const response = await axios.get(url, { responseType: "stream" });
    const attachment = response.data;

    api.sendMessage(
      {
        body: `━━━━━━━━━━━━━━━━━━\n📸 𝐅𝐀𝐊𝐄 𝐁𝐊𝐀𝐒𝐇 𝐒𝐂𝐑𝐄𝐄𝐍𝐒𝐇𝐎𝐓 ✅\n━━━━━━━━━━━━━━━━━━\n\n📱 𝐌𝐨𝐛𝐢𝐥𝐞 𝐍𝐮𝐦𝐛𝐞𝐫 : ${number}\n🧾 𝐓𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐈𝐃: ${transaction}\n💵 𝐀𝐦𝐨𝐮𝐧𝐭: ৳${amount}\n\n📤 𝐘𝐨𝐮𝐫 𝐟𝐚𝐤𝐞 𝐁𝐤𝐚𝐬𝐡 𝐫𝐞𝐜𝐞𝐢𝐩𝐭 𝐢𝐬 𝐫𝐞𝐚𝐝𝐲!\n\n━━━━━━━━━━━━━━━━━━\n\n🛠 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲: ─꯭─⃝‌‌𝐌𝐨𝐡𝐚𝐦𝐦𝐚𝐝 𝐀𝐤𝐚𝐬𝐡\n━━━━━━━━━━━━━━━━━━`,
        attachment,
      },
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage(
      "❌ 𝐀𝐧 𝐞𝐫𝐫𝐨𝐫 𝐨𝐜𝐜𝐮𝐫𝐫𝐞𝐝 𝐰𝐡𝐢𝐥𝐞 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐬𝐜𝐫𝐞𝐞𝐧𝐬𝐡𝐨𝐭.",
      event.threadID,
      event.messageID
    );
  }
};
