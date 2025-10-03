module.exports.config = {
  name: "leavenoti",
  eventType: ["log:unsubscribe"],
  version: "1.0.2",
  credits: "Mohammad Akash",
  description: "Ultra Premium Leave Message with Tag & Emojis"
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, author, logMessageData } = event;
  const leaverID = logMessageData.leftParticipantFbId || author;
  const leaverName = await Users.getNameUser(leaverID);
  const mention = [{ id: leaverID, tag: leaverName }];

  const msg = 
`💔━━━━━━━━━━━━━━━━💔
          ✨ 𝐆𝐎𝐎𝐃𝐁𝐘𝐄 ✨
💔━━━━━━━━━━━━━━━━💔

👤 ${leaverName} 𝐡𝐚𝐬 𝐥𝐞𝐟𝐭 𝐭𝐡𝐞 𝐠𝐫𝐨𝐮𝐩 😢

🌸 𝐖𝐞 𝐡𝐨𝐩𝐞 𝐲𝐨𝐮 𝐞𝐧𝐣𝐨𝐲𝐞𝐝 𝐲𝐨𝐮𝐫 𝐭𝐢𝐦𝐞 𝐡𝐞𝐫𝐞  
🔥 𝐃𝐨𝐧'𝐭 𝐟𝐨𝐫𝐠𝐞𝐭 𝐭𝐨 𝐜𝐨𝐦𝐞 𝐛𝐚𝐜𝐤!

💖 𝐓𝐡𝐚𝐧𝐤𝐬 𝐟𝐨𝐫 𝐛𝐞𝐢𝐧𝐠 𝐚 𝐩𝐚𝐫𝐭 𝐨𝐟 𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩  

💠━━━━━━━━━━━━━━━━💠
       🤖 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 𝐁𝐲 𝐀𝐤𝐚𝐬𝐡
💠━━━━━━━━━━━━━━━━💠`;

  api.sendMessage({ body: msg, mentions: mention }, threadID);
};
