module.exports.config = {
 name: "insta",
 version: "2.0.0",
 permission: 0,
 credits: "Shaon Ahmed",
 description: "Download video from facebook",
 prefix: true,
 category: "admin",
 usages: "link",
 cooldowns: 5,
 dependencies: {
 'image-downloader': '',
 }
};
module.exports.run = async function({ api, event, args }) {
 
 api.setMessageReaction("😘", event.messageID, (err) => {
 }, true);
 api.sendTypingIndicator(event.threadID, true);
 
 const { messageID, threadID } = event;
 const fs = require("fs");
 const axios = require("axios");
 const request = require("request");
 const { nayan } = global.apiNayan;
 const prompt = args.join(" ");
 if (!args[0]) return api.sendMessage("[ ! ] Input link.", threadID, messageID);

 const content = args.join(" ");
 if (!args[1]) api.sendMessage(`𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆 𝐕𝐈𝐃𝐄𝐎 𝐅𝐎𝐑 𝐘𝐎𝐔\n\n𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝟖...`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));

 try {
 let data = await axios.get(`${nayan}/instagram/downloadpost?url=${content}`);
 
 var file = fs.createWriteStream(__dirname + '/cache/insta.mp4');
 
 const url = data.data.video_url;
 const rqs = request(encodeURI(url));

 rqs.pipe(file); 
 file.on('finish', () => {
 
 setTimeout(function() {
 
 return api.sendMessage({
 body: `𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲.\n𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐯𝐢𝐝𝐞𝐨`,
 attachment: fs.createReadStream(__dirname + '/cache/insta.mp4')
 }, threadID, messageID)
 }, 5000)
 })
 } catch (err) {
 api.sendMessage(`ERROR: SHAON API IS BUSY OR YOU HAVE BEEN BLOCKED FROM SHAON API`, event.threadID, event.messageID); 
 }
};