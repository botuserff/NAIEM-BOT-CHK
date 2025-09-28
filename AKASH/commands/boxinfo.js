const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "groupinfo",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "𝐌𝐨𝐡𝐚𝐦𝐦𝐚𝐝 𝐀𝐤𝐚𝐬𝐡",
  description: "𝐕𝐢𝐞𝐰 𝐲𝐨𝐮𝐫 𝐛𝐨𝐱 𝐢𝐧𝐟𝐨 𝐢𝐧 𝐚 𝐜𝐚𝐫𝐝 𝐬𝐭𝐲𝐥𝐞",
  commandCategory: "Box", 
  usages: "groupinfo", 
  cooldowns: 0,
  dependencies: [] 
};

module.exports.run = async function({ api, event, args }) {
  let threadInfo = await api.getThreadInfo(event.threadID);
  let threadMem = threadInfo.participantIDs.length;
  let gendernam = [];
  let gendernu = [];

  for (let z in threadInfo.userInfo) {
    let gender = threadInfo.userInfo[z].gender;
    if (gender == "MALE") gendernam.push(z);
    else if (gender == "FEMALE") gendernu.push(z);
  }

  let maleCount = gendernam.length;
  let femaleCount = gendernu.length;
  let adminCount = threadInfo.adminIDs.length;
  let totalMsgs = threadInfo.messageCount;
  let emoji = threadInfo.emoji;
  let threadName = threadInfo.threadName;
  let threadID = threadInfo.threadID;
  let approval = threadInfo.approvalMode ? "Turned on" : "Turned off";

  let callback = () =>
    api.sendMessage(
      {
        body: `╔════════════════════╗
       🛡 𝐆𝐑𝐎𝐔𝐏 𝐂𝐀𝐑𝐃 🛡
╚════════════════════╝

👑 𝐆𝐂 𝐍𝐚𝐦𝐞: ${threadName}
🆔 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃: ${threadID}
✅ 𝐀𝐩𝐩𝐫𝐨𝐯𝐚𝐥: ${approval}
🎭 𝐄𝐦𝐨𝐣𝐢: ${emoji}

📊 𝐌𝐞𝐦𝐛𝐞𝐫 𝐒𝐭𝐚𝐭𝐬:
👥 𝐓𝐨𝐭𝐚𝐥: ${threadMem}
👨 𝐌𝐚𝐥𝐞: ${maleCount}
👩 𝐅𝐞𝐦𝐚𝐥𝐞: ${femaleCount}
🛡 𝐀𝐝𝐦𝐢𝐧𝐬: ${adminCount}
💬 𝐓𝐨𝐭𝐚𝐥 𝐌𝐬𝐠𝐬: ${totalMsgs}

💖 𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲: 𝐌𝐨𝐡𝐚𝐦𝐦𝐚𝐝 𝐀𝐤𝐚𝐬𝐡
════════════════════`,
        attachment: fs.createReadStream(__dirname + '/cache/1.png')
      },
      event.threadID,
      () => fs.unlinkSync(__dirname + '/cache/1.png'),
      event.messageID
    );

  return request(encodeURI(`${threadInfo.imageSrc}`))
    .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
    .on('close', () => callback());
};
